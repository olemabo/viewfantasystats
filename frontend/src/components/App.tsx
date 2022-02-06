import React from "react"; // this must be here
import ReactDOM from 'react-dom';
import { FPLLayout } from "./fplLayout/fplLayout";
import { Provider } from 'react-redux';
import store from "../store/index";

function App() {
  return (<FPLLayout />
  );
}

export default App;

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('app')
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);