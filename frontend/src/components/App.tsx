import { DefaultLayout } from './Layout/DefaultLayout/DefaultLayout';
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function App() {
  return (
    <DefaultLayout />
  );
}

export default App;