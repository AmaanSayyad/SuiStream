import { HashtagIcon } from '@heroicons/react/outline'
import moment from 'moment'
import React from 'react'

import { Comment } from '../../hooks/useSuperstreamContract'

type Props = {
  chat:Comment
  key:number
}
const Message = ({chat,key}: Props) => {
  return (
    <div className="bg-slate-700 px-4 py-2 rounded-xl max-w-fit" >
    <div className="flex items-center  gap-2 text-sm font-display text-gray-400">{chat?.senderUsername} <div className="h-1 w-1 rounded-full bg-gray-400"/> {moment.unix(chat?.createdAt).fromNow()}</div> 
    <p>
       {chat?.message}
     </p>
   </div>
  )
}

export default Message;