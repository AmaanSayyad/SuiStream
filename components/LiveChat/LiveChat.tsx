
import React, { useEffect, useRef, useState } from "react";
import useSuperstreamContract,{Comment} from "../../hooks/useSuperstreamContract";
import ChatInput from "./ChatInput";
import Message from "./Message";

type Props = {
topic:string
};


const LiveChat = (props: Props) => {
  const chatsContainerRef = useRef<HTMLDivElement>();
  const [chats, setChats] = useState<Comment[]>([]);
  const superstream = useSuperstreamContract();
  const commentFilter = superstream.contract.filters.CommentAdded(null,props?.topic,null) ;
  const getLiveChat = async () =>{
    const _chats = await superstream.getComments(props?.topic);
    setChats(_chats);
  }

  useEffect(()=>{
    const callback = (comment,topic,createdAt)=>{
      console.log("New Comment Added");
      console.log({comment});
      setChats([...chats,{createdAt:comment.createdAt,message:comment.message,senderAddress:comment.senderAddress,senderUsername:comment.senderUsername,topic:comment.topic}])
    }

    superstream.contract.on(commentFilter,callback)
    
    return () =>{
      superstream.contract.removeAllListeners();
    }
  },[superstream]) 
  useEffect(()=>{
    if(props?.topic){
      getLiveChat();
    }
  },[props])

  useEffect(()=>{
    if(chatsContainerRef.current){
      const chatsContainer = chatsContainerRef?.current;
      chatsContainer.scrollTop = chatsContainer?.scrollHeight
    }
  },[chats,chatsContainerRef])

  return (
    <div className="bg-gradient-to-t hidden hover:shadow-2xl shadow-purple-500 duration-200  relative p-4  from-slate-800 rounded-2xl to-transparent h-[480px] lg:flex flex-col">
      {/* Messages */}
      <div ref={chatsContainerRef} className="flex-1 h scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700  h-full gap-2 overflow-y-scroll items-end flex flex-col">
      {chats?.map((chat,i)=>(
        <Message chat={chat} key={i}/>
      ))}
  
      </div>
      {/* Input */}
      
      <ChatInput topic={props?.topic} chats={chats} setChats={setChats} />
    </div>
  );
};

export default LiveChat;
