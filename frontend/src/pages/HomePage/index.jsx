import Card from 'components/atoms/Card'
import { PATHS } from 'utils/consts'
import './style.scss'

const HomePage = () => {
  return (
    <div className="home-page">
      <Card
        title="Whiteboard"
        imageUrl="https://img.icons8.com/ios/400/null/whiteboard.png"
        text="Drawing board app where users can create whiteboards and draw in real time."
        link={PATHS.whiteboard}
      />
      <Card
        title="Fifteen Puzzle"
        imageUrl="https://img.icons8.com/glyph-neue/400/null/strategy-board.png"
        text="Single player app where users can try to solve the fifteen puzzle riddle."
        link={PATHS.fifteen}
      />
      <Card
        title="Tic Tac Toe"
        imageUrl="https://img.icons8.com/external-dreamstale-lineal-dreamstale/400/null/external-tic-tac-toe-game-dreamstale-lineal-dreamstale.png"
        text="Multiplayer tic tac toe game where users can create and join rooms."
        link={PATHS.tictactoe}
      />
      <Card
        title="Bingo"
        imageUrl="https://img.icons8.com/external-ddara-lineal-ddara/400/null/external-bingo-gaming-gambling-ddara-lineal-ddara.png"
        text='Multiplayer app where users race with each other to reach "BINGO".'
        link={PATHS.bingo}
      />
    </div>
  )
}

export default HomePage
