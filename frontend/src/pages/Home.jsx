import { signInWithPopup } from 'firebase/auth'
import api from '../../utils/axios';
import { auth, googleProvider } from '../../utils/firebase';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import Sidebar from '../components/Sidebar.jsx';
import ChatArea from '../components/ChatArea.jsx';
import Artifact from '../components/Artifact.jsx';


function Home() {

    const dispatch = useDispatch();


    const {userData} = useSelector(state => state.user);
    console.log("userData", userData);



    const handleLogin = async (token) =>
  {
    try{
      const data = await api.post("/api/auth/login",{token});
      console.log(data);
      dispatch(setUserdata(data.data));


    }
    catch(error){
      console.log("Error during login:", error);
    }
  }


  const googleLogin = async () =>
  {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data)
  }

  return (
    <div className='flex justify-center bg-black items-center h-screen'>
      <div className='flex justify-center items-center h-screen'>

        <Sidebar/>
        <ChatArea/>
        <Artifact/>
        {!userData && (
        <div>
          <div className='flex flex-col justify-center items-center text-white bg-blue-500 p-5'>
            <h2>
              Welcome to ShubhAI
            </h2>
            <p>
              Please login to continue
            </p>
          </div>

          <button className='flex justify-center items-center bg-white p-2 rounded-lg mt-5 cursor-pointer hover:bg-gray-100' onClick={googleLogin}>
            <FcGoogle size={15} className='mr-2'/>
            Continue with Google
          </button>
        </div>)}




      </div>
    </div>
  )
}

export default Home