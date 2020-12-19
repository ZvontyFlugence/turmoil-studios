import { useEffect, useState } from 'react'
import Router from 'next/router'

import Card from 'react-bootstrap/Card'

interface IProps {
  game: string
}

interface GameInfo {
  name: string,
  img: string,
  url: string,
}

export default function GameCard({ game }: IProps): JSX.Element {
  const [gameInfo, setGameInfo] = useState<GameInfo>({ name: '', img: '', url: '' })

  const cardStyle = {
    padding: '1px',
    color: 'white',
  }

  useEffect(() => {
    switch (game) {
      case 'SoT':
        setGameInfo({ name: 'State of Turmoil', img: '/SoT.svg', url: '/state-of-turmoil' })
        break
      default:
        break
    }
  }, [])

  const goToGame = () => {
    Router.push(`/dashboard${gameInfo.url}`)
  }

  return (
    <Card as='button' bg='primary' style={cardStyle} onClick={() => goToGame()}>
      <Card.Img className='ts-card-img' variant='top' src={gameInfo.img} />
      <Card.Body style={{ padding: 5, width: '100%' }}>
        <Card.Title style={{ textAlign: 'center' }}>
          { gameInfo.name }
        </Card.Title>
      </Card.Body>
    </Card>
  )
}