import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import STORE from "./store/store";

ReactDOM.render(
    <BrowserRouter>
        <Provider store={STORE}>
            <App/>
        </Provider>
    </BrowserRouter>,
  document.getElementById('root')
);
