import { PATHS } from 'utils/consts';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = ({ className }) => {
  const navigate = useNavigate();
  return (
    <button className={`btn btn-home ${className}`} onClick={() => navigate(PATHS.home)}>
      Home
    </button>
  );
};

export default HomeButton;
