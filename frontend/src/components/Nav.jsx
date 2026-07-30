import { MessageSquare } from 'lucide-react'
import { useSelector } from 'react-redux'

function Nav() 
{

  const {selectedConversation} = useSelector(state => state.conversation)
  const {messages} = useSelector(state => state.message)

  return (
    <>
    {selectedConversation && 
       <div>
      <div className='flex justify-between items-center bg-gray-800 text-white p-4'>
      <MessageSquare/>
      </div>
      <div className='flex flex-col justify-center items-center bg-gray-800 text-white p-4'>
        <h3>{selectedConversation ? selectedConversation.title || "No Conversation Selected" : "No Conversation Selected"}</h3>
        <p>{messages.length} messages</p>
      </div>
    </div>
    }
   

    </>
  )
}
      

export default Nav