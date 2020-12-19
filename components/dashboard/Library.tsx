import { IUser } from '../../context/UserContext'
import GameCard from './GameCard'

import CardDeck from 'react-bootstrap/CardDeck'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

interface IProps {
  user: IUser | null
}

export default function Library({ user }: IProps): JSX.Element {
  return (
    <Container fluid>
      <Row>
        <h5>Owned Games:</h5>
      </Row>
      <Row>
        <CardDeck>
          {
            user && user.games && user.games.map((game, idx) => (
              <GameCard key={idx} game={game} />
            ))
          }
        </CardDeck>
      </Row>
    </Container>
  )
}