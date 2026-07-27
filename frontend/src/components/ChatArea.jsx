import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import Nav from "./Nav"


function ChatArea() {
  return (
    <div className = 'flex-1 bg-gray-200'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea