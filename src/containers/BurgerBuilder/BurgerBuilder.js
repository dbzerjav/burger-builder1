import React, { Component } from 'react';

import Hoc from '../../hoc/Hoc/Hoc';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders'; 

const INGREDIENT_PRICES = {
  lettuce: 0.50,
  cheese: 1.00,
  meat: 2.00,
  bacon: 1.75,
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 3.00,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: null,
  }

  componentDidMount() {
    axios.get('https://react-my-burger1-b0ed3.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState( { ingredients: response.data } );
      } )
      .catch(error => {
        this.setState( { error: true } ); 
      });
  }
  

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState( { purchaseable: sum > 0 } );
  }

  addIngredientHandler = ( type ) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice  = oldPrice + priceAddition;
    this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    this.updatePurchaseState(updatedIngredients); 
  }
  
  removeIngredientHandler = ( type ) => {
    const oldCount = this.state.ingredients[type];
     if (oldCount <= 0) {
       return;
     } 
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceSubtraction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice  = oldPrice - priceSubtraction;
    this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    this.updatePurchaseState(updatedIngredients); 
  }

  purchaseHandler = () => {
    this.setState( { purchasing: true } );
  }
  
  purchseCancelledHandler = () => {
    this.setState( { purchasing: false } );
  }

  purchaseContinueHandler = () => {
    // alert('You Cliked Continue!');

    const queryParams = []
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname:  '/checkout',
      search: '?' + queryString,
    });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for ( let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner ca />

    if ( this.state.ingredients ) {
      burger = (
        <Hoc>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}  
            disabled={disabledInfo}
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice} />
        </Hoc>
      );
      orderSummary = <OrderSummary 
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchseCancelledHandler}
          purchaseContinued={this.purchaseContinueHandler} />
    }
    if ( this.state.loading ) {
      orderSummary = <Spinner />
    }



    return(
      <Hoc>
        <Modal 
          show={this.state.purchasing}
          modalClosed={this.purchseCancelledHandler}>
            {orderSummary}
        </Modal>
        {burger}
      </Hoc>
    );
  }
}

export default withErrorHandler( BurgerBuilder, axios );