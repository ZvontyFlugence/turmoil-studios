import { useUser } from '../../context/UserContext'
import { IPage, useDispatchPath } from '../../context/PathContext'
import DashboardBase from '../../components/dashboard/DashboardBase'
import AdminPortal from '../../components/dashboard/AdminPortal'
import Library from '../../components/dashboard/Library'
import Settings from '../../components/dashboard/Settings'

import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'

export default function Dashboard(): JSX.Element {
  const user = useUser()
  const dispatchPath = useDispatchPath()

  const handleTabClick = (eventKey: any, _: any) => {
    let page: IPage = { name: eventKey, url: '' }

    switch (eventKey) {
      default:
        page.url = '/dashboard'
        break
    }

    dispatchPath({ type: 'REPLACE', payload: { page } })
  }

  return (
    <DashboardBase>
      <Tab.Container id='ts-tab-container' defaultActiveKey='Library'>
        <Row>
          <Col lg={2}>
            <Nav variant='pills' className='flex-column'>
              <Nav.Item>
                <Nav.Link eventKey='Library' onSelect={handleTabClick}>Library</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='Settings' onSelect={handleTabClick}>Settings</Nav.Link>
              </Nav.Item>
              {
                user && user.admin && (
                  <Nav.Item>
                    <Nav.Link eventKey='Admin Portal' onSelect={handleTabClick}>Admin Portal</Nav.Link>
                  </Nav.Item>
                )
              }
            </Nav>
          </Col>
          <Col lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey='Library'>
                <Library user={user} />
              </Tab.Pane>
              <Tab.Pane eventKey='Settings'>
                <Settings user={user} />
              </Tab.Pane>
              {
                user && user.admin && (
                  <Tab.Pane eventKey='Admin Portal'>
                    <AdminPortal />
                  </Tab.Pane>
                )
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </DashboardBase>
  )
}