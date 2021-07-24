const INITIAL_STATE = {
    adResponse: {}
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'AD_REQ':
        return {...state, adResponse: action.payload};
      default:
        return state;
    }
  }
  