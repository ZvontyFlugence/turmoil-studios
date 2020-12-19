import Router from 'next/router'

import { IUser, useDispatchUser } from '../../context/UserContext'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

interface IProps {
  user?: IUser | null
}

export default function PrivateNavbar({ user }: IProps): JSX.Element {
  const dispatch = useDispatchUser()

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    Router.push('/')
  }

  return (
    <Navbar id='ts-navbar-nav' variant='dark' fixed='top' expand='lg' collapseOnSelect>
      <Navbar.Brand href='/dashboard'>
        <img
          className='d-inline-block align-top ts-navbar-brand'
          src='/TurmoilStudios_Dark.svg'
          alt=''
        />{' '}
        <h3 style={{ display: 'inline-block' }}>Turmoil Studios</h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar-collapse' />
      <Navbar.Collapse id='navbar-collapse'>
        <Nav className='justify-content-end ml-auto' style={{ paddingRight: '5vh' }}>
          {
            user && user.admin && (
              <Nav.Item>
                <Nav.Link href='https://turmoil-studios.atlassian.net'>JIRA</Nav.Link>
              </Nav.Item>
            )
          }
          <Nav.Item>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}