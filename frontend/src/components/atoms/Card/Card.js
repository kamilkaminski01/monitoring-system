import React from 'react';
import './Card.scss';
import { Link } from 'react-router-dom';

function Card({ title, imageUrl, body, link }) {
  return (
    <div className="card-wrapper">
      <Link to={link}>
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
      </Link>
    </div>
  );
}

export default Card;
