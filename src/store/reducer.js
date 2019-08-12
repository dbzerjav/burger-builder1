import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    lettuce: 0,
    bacon: 0,
    meat: 1,
    cheese: 0,
  },
  totalPrice: 3.5,
};

const INGREDIENT_PRICES = {
  lettuce: 0.50,
  cheese: 1.00,
  meat: 2.00,
  bacon: 1.75,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1, 
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      };
      case actionTypes.REMOVE_INGREDIENT:
        return {
          ...state,
          ingredients: {
            ...state.ingredients,
            [action.ingredientName]: state.ingredients[action.ingredientName] - 1, 
          },
          totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]        }
    default:
      return state; 
  }
}

export default reducer;