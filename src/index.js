import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import App from './components/app/app.jsx';
import reducer from './reducer/reducer.js';
import {Operation as DataOperation} from './reducer/data/data.js';
import {createAPI} from './api.js';

const onUnauthorized = () => {};
const api = createAPI(onUnauthorized);

const store = createStore(
    reducer,
    compose(
        applyMiddleware(thunk.withExtraArgument(api)),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
    )
);

store.dispatch(DataOperation.loadQuestions());

const init = () => {
  ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.querySelector(`#root`)
  );
};

init();
