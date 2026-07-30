import { useEffect } from "react"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import Nav from "./Nav"
import { useDispatch, useSelector } from "react-redux"
import getMessages from "../features/getMessages"
import { setMessages } from "../redux/messageSlice"


function ChatArea() {

  const dispatch = useDispatch();
  const {selectedConversation} = useSelector(state => state.conversation);


  useEffect(() =>
  {
    const getMesg = async () => {
      
      if(selectedConversation)
      {
           const data = await getMessages(selectedConversation._id);
           dispatch(setMessages(data.messages));
      }
    }

    getMesg();
  },[selectedConversation])



  return (
    <div className = 'flex-1 bg-gray-200'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea