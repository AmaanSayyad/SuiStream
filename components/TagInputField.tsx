import { XIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  tags: string[];
  setTags: any;
  maxTagsLength:number
};

const TagInputField = ({ tags, setTags,maxTagsLength }: Props) => {
  const [input, setInput] = useState<string>('');
  const [isKeyReleased, setIsKeyReleased] = useState<boolean>();

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();


    if ((key === "," || key==='Enter') && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      if(tags.length == maxTagsLength){
        toast.error(`Maximum ${maxTagsLength} allowed.`)
        setIsKeyReleased(false);
        return;
      }
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput("");
    }

    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  return (
    <div>
      <div className="flex text-sm flex-wrap font-medium text-display  gap-1 mb-2">
      {tags.map((tag, index) => (
        <div key={index} className="bg-emerald-600 flex items-center gap-1 px-2  py-1 rounded-lg ">
          {tag}
          <XIcon className="h-5 w-5 cursor-pointer  rounded-full p-[2px]" onClick={() => deleteTag(index)}/>
        </div>
      ))}
      </div>
      <input
        id='tag-input'
        type="text"
        value={input}
        placeholder="Enter a tag"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export default TagInputField;
