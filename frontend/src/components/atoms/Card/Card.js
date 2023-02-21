import React from 'react';
import './Card.scss';

function Card({ title, imageUrl, body, link }) {
  return (
    <div className="card-wrapper">
      <div className="image-container">
        <img src={imageUrl} alt="" />
      </div>
      <div className="card-content">
        <div className="card-title">
          <h3>{title}</h3>
        </div>
        <div className="card-body">
          <p>{body}</p>
        </div>
      </div>
      <button className="btn-open" onClick={() => (window.location.href = link)}>
        OPEN
      </button>
    </div>
  );
}

export default Card;
