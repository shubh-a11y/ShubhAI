import { Mic, Paperclip, Send } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import sendMessage from '../features/sendMessage';

function ChatInput() 
{
  const [value,setValue] = useState("");
  const {selectedConversation} = useSelector(state => state.conversation)

  const handleSendMessage = async () => 
  {
     try{
        const payload = {
          conversationId: selectedConversation._id,
          prompt: value.trim()
        }

        const data = await sendMessage(payload);
        console.log(data);
        setValue("");

     }
     catch(err)
      {
        console.log("message error", err);
      }
  }

  return (
    <div className='flex justify-center items-center bg-gray-800 text-white p-4'>
      <textarea className='w-full bg-gray-800 text-white placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Type your message...' row={3}
      onChange={(e) => setValue(e.target.value)} value = {value.trim()}/>

      <div className='flex justify-center items-center gap-2 ml-2'>
        <div className='flex justify-center items-center bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600'>
         <Paperclip/> 
        </div>
        <div className='flex justify-center items-center bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600'>
          <Mic/>
        </div>
      </div>

      <button disabled={value.length == 0} onClick={handleSendMessage} className={`flex justify-center items-center bg-blue-500 p-2 rounded-lg ml-2 cursor-pointer hover:bg-blue-600 ${value.length == 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
        <Send/>
      </button>

      
    </div>
  )
}

export default ChatInput