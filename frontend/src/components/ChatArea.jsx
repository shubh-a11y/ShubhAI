import { useEffect } from "react"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import Nav from "./Nav"
import { useDispatch, useSelector } from "react-redux"
import getMessages from "../features/getMessages"


function ChatArea() {

  const dispatch = useDispatch();
  const {selectedConversation} = useSelector(state => state.conversation);


  useEffect(() =>
  {
    const getMesg = async () => {

      const data = await getMessages(selectedConversation._id);
      



    }
    
    
  })

  return (
    <div className = 'flex-1 bg-gray-200'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea