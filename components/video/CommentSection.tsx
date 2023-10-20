import { Contract } from 'ethers';
import React, { useEffect, useState } from 'react'
import useSuperstreamContract, { Comment } from '../../hooks/useSuperstreamContract';
import ChatInput from '../LiveChat/ChatInput';
import Message from '../LiveChat/Message';

type Props = {
  topic:string
}

const CommentSection = (props: Props) => {
  const [chats, setChats] = useState<Comment[]>([]);
  const superstream = useSuperstreamContract();
  const commentFilter = superstream.contract.filters.CommentAdded(null,props?.topic,null) ;
  const getComments = async () =>{
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
      getComments();
    }
  },[props])

  return (
    <div className='flex flex-col'>
      <h6 className='text-2xl font-display font-medium'>Comments</h6>
      <div className="flex-1  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700  my-4 gap-2  flex flex-col">
      {chats?.map((chat,i)=>(
        <Message chat={chat} key={i}/>
      ))}
  
      </div>
      <ChatInput topic={props?.topic} chats={chats} setChats={setChats} prepend={true}/>
    </div>
  )
}

export default CommentSection