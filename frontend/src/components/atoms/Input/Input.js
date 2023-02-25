import React from 'react';
import './Input.scss';

const Input = ({ value, onChange, ...rest }) => {
  return (
    <input
      type="text"
      className="form-control my-1 home-input"
      autoComplete="off"
      placeholder="Your username"
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
