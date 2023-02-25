import { PATHS } from 'utils/consts';
import React from 'react';

const HomeButton = ({ className }) => {
  return (
    <button
      className={`btn btn-home ${className}`}
      onClick={() => (window.location.href = PATHS.home)}>
      Menu
    </button>
  );
};

export default HomeButton;
