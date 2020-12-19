import { useState } from 'react'

import { IUser, useDispatchUser } from '../../context/UserContext'
import TSApi from '../../services/TurmoilStudios'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'

interface IProps {
  user: IUser | null
}

export default function Settings({ user }: IProps): JSX.Element {
  const dispatch = useDispatchUser()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    newPass: '',
    confirm: '',
  })

  const handleChange = (e: any) => {
    setFormData(data => ({ ...data, [e.target.name]: e.target.value }))
  }

  const submitSettings = (e: any) => {
    e.preventDefault()

    const { username, email, password, newPass, confirm } = formData

    let payload = {}
    if (password) {
      if (newPass !== confirm) {
        // TODO: Display Error Message
        return;
      }

      payload = {
        username,
        email,
        password,
        newPass,
      }
    } else {
      if (username)
        payload = { ...payload, username }
      
      if (payload)
        payload = { ...payload, email }
    }

    TSApi.editAccount(payload).then((data: any) => {
      if (data.user) {
        dispatch({ type: 'LOAD', payload: { user: data.user } })
      }
    })
  }
  
  const deleteAccount = () => {
    TSApi.deleteAccount().then((_: any) => {
      dispatch({ type: 'DELETE' })
    })
  }

  return user ? (
    <Container fluid>
      <Row className='dashboard-header'>
        <h5>Settings</h5>
      </Row>
      <Row className='dashboard-content'>
        <Col lg={5}>
          <h6>Edit Account Details</h6>
          <Form onSubmit={submitSettings}>
            <Form.Group controlId='accountUsername'>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type='text'
                name='username'
                defaultValue={user.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId='accountPw'>
              <Form.Label>Current Password:</Form.Label>
              <Form.Control
                type='password'
                name='password'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId='accountConfirmPw'>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type='password'
                name='confirm'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' variant='outline-primary'>Save</Button>
            </Form.Group>
          </Form>
        </Col>
        <Col lg={{ span: 6, offset: 1 }}>
          <h6>Delete Account</h6>
          <p>Deleting your account will result in the loss of all games associated with your account!</p>
          <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
        </Col>
      </Row>
      <Modal id='deleteAccountModal' show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? Doing so will result in the loss of all Turmoil Studios
            games associated with your account!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setShowDeleteModal(false)}>Close</Button>
          <Button variant='danger' onClick={deleteAccount}>Delete Account</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  ) : (
    <></>
  )
}