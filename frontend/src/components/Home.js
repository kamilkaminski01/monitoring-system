import React from 'react';
import Card from './Card';
import './css/App.css';

function Home() {
  return (
    <div>
      <div className="title">
        <h1>Monitoring system</h1>
      </div>
      <div className="App">
        <Card
          title="Whiteboard"
          imageUrl="https://picsum.photos/300"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link="http://localhost:3000/whiteboard"
        />
        <Card
          title="Bingo"
          imageUrl="https://picsum.photos/300"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link="http://localhost:3000/bingo"
        />
      </div>
    </div>
  );
}

export default Home;
