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
    ingredients: {
      lettuce: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 3.00,
    purchaseable: false,
    purchasing: false,
    loading: false,
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
    this.setState( { loading: true } );
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Mad Max',
        address: {
          street: '1 TestStreet',
          zip: '12345',
        },
        email: 'test@test.com',  
      },
      deliveryMethod: 'pickUp'
    }
    axios.post('/orders.json', order)
     .then(response => {
      this.setState( { loading: false, purchasing: false } );
     })
     .catch(error => {
      this.setState( { loading: false, purchasing: false } );
     });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = <OrderSummary 
                  ingredients={this.state.ingredients}
                  price={this.state.totalPrice}
                  purchaseCancelled={this.purchseCancelledHandler}
                  purchaseContinued={this.purchaseContinueHandler} />
    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return(
      <Hoc>
        <Modal 
          show={this.state.purchasing}
          modalClosed={this.purchseCancelledHandler}>
            {orderSummary}
        </Modal>
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
  }
}

export default withErrorHandler(BurgerBuilder, axios);