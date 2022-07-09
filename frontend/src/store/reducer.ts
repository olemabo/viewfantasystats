const initialState = {
    isMenuOpen: false,
    league_type: 'FPL',
}
  
  // Use the initialState as a default value
  export default function appReducer(state = initialState, action: any) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      // Do something here based on the different types of actions
      case "isMenuOpen":
        state.isMenuOpen = action.payload;
        return {...state};
      case "league_type":
        state.league_type = action.payload;
        return {...state};
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }