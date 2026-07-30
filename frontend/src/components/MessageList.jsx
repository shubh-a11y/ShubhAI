
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'

function MessageList() 
{
  const {selectedConversation} = useSelector(state => state.conversation);
  const {messages} = useSelector(state => state.message);

  return (
    <div>
      {((messages.length == 0 || !selectedConversation) ? (<>
        <div className='text-3xl'>Shubh AI</div>
        <p className='text-sm'>Start a conversation</p></>)
      :
      <>
        {messages.map((msg,i) =>
        (
          <div>
            <MessageBubble role={msg?.role} content={msg?.content} key={i}/>
          </div>
        ))}
      </>)} 
      
    </div>
  )
}

export default MessageList
