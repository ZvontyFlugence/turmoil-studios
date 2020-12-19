import { useEffect, useState } from 'react'

import DashboardBase from '../../components/dashboard/DashboardBase'
import { IPage, useDispatchPath, usePath } from '../../context/PathContext'

import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'

export default function SoT(): JSX.Element {
  const pagePath = usePath()
  const dispatchPath = useDispatchPath()
  const [activeKey, setActiveKey] = useState<string>('home')

  useEffect(() => {
    let defaultPage: IPage = {
      name: 'State of Turmoil',
      url: '/dashboard/state-of-turmoil',
    }
    
    dispatchPath({ type: 'APPEND', payload: { page: defaultPage } })
    setActiveKey('home')
  }, [])

  const visit = (eventKey: string | null, _: any): void => {
    if (eventKey) {
      let page: IPage = { name: eventKey, url: '/dashboard/state-of-turmoil' }
      let currPage: IPage = pagePath[pagePath.length - 1]

      if (currPage.name === 'State of Turmoil') {
        dispatchPath({ type: 'APPEND', payload: { page } })
      } else {
        if (eventKey === 'home') {
          dispatchPath({ type: 'POP' })
        } else {
          dispatchPath({ type: 'REPLACE', payload: { page } })
        }
      }

      setActiveKey(eventKey)
    }
  }

  return (
    <DashboardBase>
      <Tab.Container id='ts-tab-container' activeKey={activeKey}>
        <Row>
          <Col lg={2}>
            <Nav variant='pills' className='flex-column'>
              <Nav.Item>
                <Nav.Link eventKey='home' onSelect={visit}>Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='Achievements' onSelect={visit}>Achievements</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='Friends' onSelect={visit}>Friends</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey='home'>
                Game Home Page
              </Tab.Pane>
              <Tab.Pane eventKey='Achievements'>
                Achievements
              </Tab.Pane>
              <Tab.Pane eventKey='Friends'>
                Friends
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </DashboardBase>
  )
}