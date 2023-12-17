import { useEffect, useState } from 'react';
import './App.css';
import Navbaar from './Components/header/Navbaar';
import Newnav from './Components/newnavbaar/Newnav';
import Maincomp from './Components/home/Maincomp';
import Footer from './Components/footer/Footer';
import Signin from './Components/signup_signin/Signin';
import Signup from './Components/signup_signin/Signup';
import Cart from './Components/cart/Cart';
import Buynow from './Components/buynow/Buynow';
import { Routes, Route } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';



function App() {

  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 2000);
  }, [])

  return (
    <>
      {
        data ? (
          <>
            <Navbaar />
            <Newnav />
            <Routes>
              <Route path='/' element={<Maincomp />} />
              <Route path='/login' element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path='/getproductsone/:id' element={<Cart />} />
              <Route path='/buynow' element={<Buynow />} />

            </Routes>
            <Footer />
          </>)
          : (
            <div className='circle'>
              <CircularProgress />
              <h2> Loading.....</h2>
            </div>



          )
      }
    </>
  );
}
export default App;