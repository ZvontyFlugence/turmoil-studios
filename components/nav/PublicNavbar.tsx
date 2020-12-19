import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export default function PublicNavbar(): JSX.Element {
  return (
    <Navbar id='ts-navbar-nav' variant='dark' fixed='top' expand='lg' collapseOnSelect>
      <Navbar.Brand href='/'>
        <img
          className='d-inline-block align-top ts-navbar-brand'
          src='/TurmoilStudios_Dark.svg'
          alt=''
        />{' '}
        <h3 style={{ display: 'inline-block' }}>Turmoil Studios</h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar-collapse' />
      <Navbar.Collapse id='navbar-collapse'>
        <Nav className='justify-content-end ml-auto' style={{ paddingRight: '5vw' }}>
          <Nav.Item>
            <Nav.Link href='/#about'>About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/#games'>Games</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/#team'>Team</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/#contact'>Contact</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/login'>Login</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}