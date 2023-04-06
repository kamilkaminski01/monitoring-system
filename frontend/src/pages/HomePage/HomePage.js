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
          body="Drawing board app where users can create whiteboards and draw in real time for users within a whiteboard."
          link={PATHS.whiteboard}
        />
        <Card
          title="Fifteen Puzzle"
          imageUrl="https://img.icons8.com/glyph-neue/400/null/strategy-board.png"
          body="Single player app where users see other online users solving the puzzle with as few moves as possible."
          link={PATHS.fifteen}
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
