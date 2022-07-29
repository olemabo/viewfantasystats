import ReactDOM from 'react-dom';
import { DefaultLayout } from './Layout/defaultLayout/defaultLayout';
import { Provider } from 'react-redux';
import {store, persistor} from "../store/index";
import React from "react"; // this must be here
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (<DefaultLayout />
  );
}

export default App;

ReactDOM.render(
    <BrowserRouter>
    <Provider store={store}><PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
    </Provider>
    </BrowserRouter>,
  document.getElementById('app')
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);