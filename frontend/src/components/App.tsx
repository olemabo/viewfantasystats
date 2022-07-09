import ReactDOM from 'react-dom';
import { DefaultLayout } from './Layout/defaultLayout/defaultLayout';
import { Provider } from 'react-redux';
import store from "../store/index";
import React from "react"; // this must be here
import { BrowserRouter } from "react-router-dom";

function App() {
  return (<DefaultLayout />
  );
}

export default App;

ReactDOM.render(
    <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
    </BrowserRouter>,
  document.getElementById('app')
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);