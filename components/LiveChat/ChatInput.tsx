import { PaperAirplaneIcon } from "@heroicons/react/outline";
import { profile } from "console";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import useSuperstreamContract, { Comment } from "../../hooks/useSuperstreamContract";
import { currentUserState } from "../../recoil/states";

type Props = {
  chats:Comment[]
  setChats:(chats)=>void
  topic:string
  prepend?:boolean
};

const ChatInput = ({chats,setChats,topic,prepend}: Props) => {
  const [input,setInput] = useState<string>('');
  const superstream = useSuperstreamContract();
  const currentUser = useRecoilValue(currentUserState);


  const handleSendChat = async (e) => {
    e.preventDefault();
    if(!input) return;
    
    await superstream.addComment(topic,input).then(()=>{
      toast.success("Message Sent")
      setInput('')
    }).catch(err=>console.error(err));
    
    
  }

  return (
    <form onSubmit={handleSendChat} className=" bottom-0 w-full flex gap-2 ">
      <input placeholder="Type a message" value={input} onChange={(e)=>setInput(e.target.value)} id='chat-input' name='chat-input' type="text" className="w-full" />
      <button disabled={!input} className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 disabled:text-gray-400  gap-2 group rounded-xl  ">
        Send
        <PaperAirplaneIcon className="h-5 w-5 relative group-hover:scale-110  rotate-90" />
      </button>
    </form>
  );
};

export default ChatInput;
