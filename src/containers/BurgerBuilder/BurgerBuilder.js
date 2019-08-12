import React, { Component } from 'react';
import { connect } from 'react-redux';

import Hoc from '../../hoc/Hoc/Hoc';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders'; 
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: null,
  }

  componentDidMount() {
    // axios.get('https://react-my-burger1-b0ed3.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState( { ingredients: response.data } );
    //   } )
    //   .catch(error => {
    //     this.setState( { error: true } ); 
    //   });
  }
  

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState( { purchasing: true } );
  }
  
  purchseCancelledHandler = () => {
    this.setState( { purchasing: false } );
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for ( let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner ca />

    if ( this.props.ings ) {
      burger = (
        <Hoc>
          <Burger ingredients={this.props.ings} />
          <BuildControls 
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}  
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price} />
        </Hoc>
      );
      orderSummary = <OrderSummary 
          ingredients={this.props.ings}
          price={this.props.price}
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));