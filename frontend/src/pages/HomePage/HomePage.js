import React from 'react';
import Card from 'components/atoms/Card/Card';
import { PATHS } from 'utils/consts';
import './HomePage.scss';

function HomePage() {
  return (
    <div>
      <div className="home-wrapper">
        <Card
          title="Whiteboard"
          imageUrl="https://img.icons8.com/ios/400/null/whiteboard.png"
          body="Simple drawing board application in which users can draw in real time for those who are present in the app."
          link={PATHS.whiteboard}
        />
        <Card
          title="Tic Tac Toe"
          imageUrl="https://img.icons8.com/external-dreamstale-lineal-dreamstale/400/null/external-tic-tac-toe-game-dreamstale-lineal-dreamstale.png"
          body="Two player application where users can create and join rooms to play with each other within them."
          link={PATHS.tictactoe}
        />
        <Card
          title="Bingo"
          imageUrl="https://img.icons8.com/external-ddara-lineal-ddara/400/null/external-bingo-gaming-gambling-ddara-lineal-ddara.png"
          body='Multiplayer app where users can create and join rooms. The race is about who first achieves "BINGO".'
          link={PATHS.bingo}
        />
      </div>
    </div>
  );
}

export default HomePage;
