import { DefaultLayout } from './Layout/defaultLayout/defaultLayout';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from "react-router-dom";
import {store, persistor} from "../store/index";
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from "react"; // this must be here

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