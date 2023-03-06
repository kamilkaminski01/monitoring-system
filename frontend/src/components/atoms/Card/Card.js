import React from 'react';
import './Card.scss';
import { useNavigate } from 'react-router-dom';

function Card({ title, imageUrl, body, link }) {
  const navigate = useNavigate();
  return (
    <div className="card-wrapper">
      <div className="image-container">
        <img src={imageUrl} alt="" />
      </div>
      <div className="card-content">
        <div className="card-title">
          <h3>{title}</h3>
        </div>
        <div>
          <p>{body}</p>
        </div>
      </div>
      <button className="btn-open" onClick={() => navigate(link)}>
        OPEN
      </button>
    </div>
  );
}

export default Card;
