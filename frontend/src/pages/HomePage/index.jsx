import Card from 'components/atoms/Card'
import { PATHS } from 'utils/consts'
import './style.scss'
import Whiteboard from 'assets/images/whiteboard.svg'
import Puzzle from 'assets/images/puzzle.svg'
import TicTacToe from 'assets/images/tictactoe.svg'
import Bingo from 'assets/images/bingo.svg'
import useDocumentTitle from 'hooks/useDocumentTitle'

const HomePage = () => {
  useDocumentTitle('Monitoring System')

  return (
    <div className="home-page">
      <Card
        title="Whiteboard"
        img={Whiteboard}
        text="Drawing board app where users can create whiteboards and draw in real time."
        link={PATHS.whiteboard}
      />
      <Card
        title="Fifteen Puzzle"
        img={Puzzle}
        text="Single player app where users can try to solve the fifteen puzzle riddle."
        link={PATHS.fifteen}
      />
      <Card
        title="Tic Tac Toe"
        img={TicTacToe}
        text="Multiplayer tic tac toe game where users can create and join rooms."
        link={PATHS.tictactoe}
      />
      <Card
        title="Bingo"
        img={Bingo}
        text='Multiplayer app where users race with each other to reach "BINGO".'
        link={PATHS.bingo}
      />
    </div>
  )
}

export default HomePage
