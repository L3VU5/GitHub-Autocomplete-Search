"use client";

import React, { InputHTMLAttributes, forwardRef, Ref } from "react";

const TextInput = forwardRef(
  (
    { value, onChange, ...rest }: InputHTMLAttributes<HTMLInputElement>,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <input
        ref={ref}
        className="w-full text-gray-950 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
