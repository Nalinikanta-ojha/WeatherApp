import React from "react";

const Input = ({ labelName, placeholder, inputValue, setInputValue, type }) => {
  return (
    <div className="flex gap-3 justify-between items-center ">
      <label>{labelName}</label>
      <input
        className=" border border-black p-2"
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

export default Input;
