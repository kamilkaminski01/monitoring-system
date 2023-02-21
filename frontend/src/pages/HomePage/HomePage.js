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
          imageUrl="https://picsum.photos/900/500"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={PATHS.whiteboard}
        />
        <Card
          title="Bingo"
          imageUrl="https://picsum.photos/900/500"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={PATHS.bingo}
        />
        <Card
          title="Tic Tac Toe"
          imageUrl="https://picsum.photos/900/500"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={PATHS.tempTictactoe}
        />
      </div>
    </div>
  );
}

export default HomePage;
