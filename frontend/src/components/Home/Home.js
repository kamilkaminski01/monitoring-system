import React from 'react';
import Card from '../Card/Card.js';
import '../../App.css';

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
          link="http://localhost:8000/bingo"
        />
        <Card
          title="Tic Tac Toe"
          imageUrl="https://picsum.photos/300"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link="http://localhost:8000/tictactoe"
        />
      </div>
    </div>
  );
}

export default Home;
