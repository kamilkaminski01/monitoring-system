import React from 'react';

const GameButton = ({ className, value, onClick, ...rest }) => {
  return (
    <button className={`btn btn-game ${className}`} onClick={onClick} {...rest}>
      {value}
    </button>
  );
};

export default GameButton;
