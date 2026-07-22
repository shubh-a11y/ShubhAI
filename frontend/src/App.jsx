
import { useEffect } from 'react';
import getCurrentUser from './features/getCurrentUser'
import Home from './pages/Home'
import { useDispatch } from 'react-redux';
import { setUserdata } from './redux/userSlice';

function App() 
{
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () =>
    {
      const data = await getCurrentUser();
      dispatch(setUserdata(data));
    }
    getUser();
  },[]);



  return (
    <>
    <Home />
    </>
  )
}

export default App