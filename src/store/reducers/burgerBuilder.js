import * as actionTypes from '../actions/actionTypes';
import { updateObject }  from '../../shared/utility';

const initialState = {
  ingredients: null,
  totalPrice: 3.5,
  error: false,
  building: false,
};

const INGREDIENT_PRICES = {
  lettuce: 0.50,
  cheese: 1.00,
  meat: 2.00,
  bacon: 1.75,
}

const addIngredient = ( state, action ) => {
  const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true,
  }
  return updateObject( state, updatedState );
}

const removeIngredient = ( state, action ) => {
  const updatedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
  const updatedIngs = updateObject( state.ingredients, updatedIng );
  const updatedSte = {
    ingredients: updatedIngs,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true,
  }
  return updateObject( state, updatedSte );
}

const setIngredients = ( state, action ) => {
  return updateObject( state, {
    ingredients: {
      lettuce: action.ingredients.lettuce,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat,
    },
    totalPrice: 3.5,
    error: false,
    building: false,
  } );
}

const fetchIngredientsFailed = ( action, state ) => {
  return updateObject( state, { error: true } );
}

const burgerBuilderReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.ADD_INGREDIENT: return addIngredient( state, action );
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient( state, action );
    case actionTypes.SET_INGREDIENTS: return setIngredients( state, action );
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed( state, action );
    default: return state; 
  }
}

export default burgerBuilderReducer;