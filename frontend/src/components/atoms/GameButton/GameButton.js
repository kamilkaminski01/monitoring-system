import React from 'react';
import './GameButton.scss';

const GameButton = ({ className = null, value, onClick, ...rest }) => {
  return (
    <button className={`btn btn-game ${className || ''}`} onClick={onClick} {...rest}>
      {value}
    </button>
  );
};

export default GameButton;
