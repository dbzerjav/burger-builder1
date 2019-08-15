export const updateObject = ( oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = ( value, rules ) => {
  let isValid = true;
  if (!rules) {
      return true;
  }

  if (rules.required) {
      isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
  }
  
  if (rules.isEmail) {
    const patternE =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    isValid = patternE.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const patternN = /^\d+$/;
    isValid = patternN.test(value) && isValid;
  }

  return isValid;
}