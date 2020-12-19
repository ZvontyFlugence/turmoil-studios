import PublicLayout from '../components/layout/PublicLayout'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import homeStyles from '../styles/home.module.scss'
import starsStyles from '../styles/stars.module.scss'

export default function Home(): JSX.Element {
  return (
    <PublicLayout>
      <section className={`${homeStyles.ts_section} ${homeStyles.splash}`}>
        <div className={starsStyles.stars} />
        <div className={starsStyles.stars2} />
        <div className={starsStyles.stars3} />
        <img className={homeStyles.ts_splash_img} src='/TurmoilStudios_Dark.svg' alt='' />
        <h1 className={homeStyles.h1}>Turmoil Studios</h1>
        <div className={homeStyles.pulse}>
          <Button className={homeStyles.ts_about_btn} style={{ color: 'white' }} href='#about'>
            About Us
          </Button>
        </div>
      </section>
      <section id='about' className={`${homeStyles.ts_section} ${homeStyles.about}`}>
        <Row className={homeStyles.row}>
          <h1 className={homeStyles.h1}>About Us</h1>
        </Row>
        <Row className={homeStyles.ts_section_content}>
          <Col style={{ textAlign: 'center' }} xs={12} md={6}>
            <img
              className={homeStyles.ts_about_img}
              src='/TurmoilStudios_Dark.svg'
              alt=''
            />
          </Col>
          <Col xs={12} md={6}>
            <p className={homeStyles.ts_section_desc}>
              Turmoil Studios is a new indie game development studio. We specialize in making high-quality games
              across a multitude of genres. We craft our games with high attention to detail, amazing quality, unique feature set,
              and captivating storytelling. Made for gamers, by gamers.
            </p>
          </Col>
        </Row>
      </section>
      <section id='games' className={`${homeStyles.ts_section} ${homeStyles.games}`}>
        <Row className={homeStyles.row}>
          <h1 className={homeStyles.h1}>Our Games</h1>
        </Row>
        <Row className={homeStyles.ts_section_content}>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Col className={homeStyles.ts_games_container} xs={12} lg={{ span: 3, offset: 1 }}>
              <Card className={homeStyles.ts_icon_card}>
                <Image className={homeStyles.ts_card_img} src='/SoT.svg' roundedCircle thumbnail />
                <Card.Body>
                  <Card.Title>State of Turmoil</Card.Title>
                  <Card.Text>
                    State of Turmoil is a browser-based geo-political strategy MMORPG.
                    Team up with other players as a politician, soldier, businessman, or journalist
                    and help your country survive in a world consumed by turmoil.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={{ span: 3, offset: 1 }}>
              <Card className={homeStyles.ts_icon_card}>
                <Image className={homeStyles.ts_card_img} src='/GGG.png' thumbnail />
                <Card.Body>
                  <Card.Title>Gold, God, & Glory</Card.Title>
                  <Card.Text>
                    Gold, God, & Glory is a fresh take on the grand strategy genre. Take control
                    of a country from 1400 to 1750, and explore, trade, and conquer to your heart's
                    content -- all in the name of gold, god, and glory.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={{ span: 3, offset: 1 }}>
              <Card className={homeStyles.ts_icon_card}>
                <Image className={homeStyles.ts_card_img} src='/wolhaiksong_square.svg' roundedCircle thumbnail  />
                <Card.Body>
                  <Card.Title>Tower of God</Card.Title>
                  <Card.Text>
                    "At the top of the tower exists everything in this world, and all of it can be yours.
                    You can become a god." Tower of God is an action third-person MMORPG based on the 
                    popular manwha and anime, Tower of God. Are you brave enough to climb the tower?
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      </section>
      <section id='team' className={`${homeStyles.ts_section} ${homeStyles.team}`}>
        <Row className={homeStyles.row}>
          <h1 className={homeStyles.h1}>Our Team</h1>
        </Row>
        <Row className={homeStyles.ts_section_content}>
          <Col>
            <Card className={homeStyles.ts_icon_card}>
              <Image className={homeStyles.ts_card_img} src='/SmallHeadshot.png' roundedCircle thumbnail />
              <Card.Body>
                <Card.Title>Z'vonty Flugence</Card.Title>
                <Card.Text>
                  Z'vonty is currently a junior Computer Science major at the University of Pittsburgh
                  (Main Campus), and has always had a passion for gaming and technology. Now he is
                  able to combine those two passions as a hobbyist game developer as he prepares to
                  enter the workforce.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <p className={homeStyles.ts_section_desc}>
              Currently, Turmoil Studios' development team is a solo act led by Founder and CEO,
              Z'vonty Flugence. We currently are looking for additional developers, designers,
              and more (preferrably students), to assist on existing and upcoming games and
              software. However, due to the nature of being a student and a startup indie game
              studio, it would be without pay at least until a game can be released.
            </p>
          </Col>
        </Row>
      </section>
      <section id='contact' className={homeStyles.ts_section}>
        <Row className={homeStyles.row}>
          <h1 className={homeStyles.h1}>Contact Us</h1>
        </Row>
        <Row className={homeStyles.ts_section_content}>
          <Col>
            <a href='https://twitter.com/'>
              <FontAwesomeIcon icon={faTwitter} className={homeStyles.ts_contact_icon} />
            </a>
          </Col>
          <Col>
            <a href='https://discord.gg/d6EGxHa'>
              <FontAwesomeIcon icon={faDiscord} className={homeStyles.ts_contact_icon} />
            </a>
          </Col>
          <Col>
            <a href='mailto: zaf17@pitt.edu'>
              <FontAwesomeIcon icon={faEnvelope} className={homeStyles.ts_contact_icon} />
            </a>
          </Col>
        </Row>
      </section>
    </PublicLayout>
  )
}
