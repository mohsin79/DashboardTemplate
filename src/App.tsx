import { useState } from 'react'
import logo from './logo.svg'
import Routers from './routes'
import { StoreProvider } from './store/store'
import { appReducer, initialState } from './store/adminReducer'
import 'devextreme/dist/css/dx.light.css';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import "./Styles/Styles.scss"
import { ToastContainer } from 'react-toastify'
import { store } from './store/store';
import { Provider } from 'react-redux';

function App() {

  return (
    <div className="App" style={{height: "100%"}}>
      <StoreProvider initialState={initialState} reducer={appReducer}>
        <Provider store={store}>
          <Routers />
        </Provider>
      </StoreProvider>
      <ToastContainer />
    </div>
  )
}

export default App
