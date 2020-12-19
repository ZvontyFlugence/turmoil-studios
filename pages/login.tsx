import { useState } from 'react'
import Link from 'next/link'

import { IUser, useDispatchUser } from '../context/UserContext'
import PublicLayout from '../components/layout/PublicLayout'
import styles from '../styles/login.module.scss'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import TSApi from '../services/TurmoilStudios'

interface IFormData {
  email: string,
  password: string,
  error: string,
}

interface ILoginResponse {
  token?: string,
  user?: IUser,
}

export default function Login(): JSX.Element {
  const dispatchUser = useDispatchUser()
  const [formData, setFormData] = useState<IFormData>({ email: '', password: '', error: '' });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitLogin = (e: any) => {
    e.preventDefault()

    TSApi.login({ email: formData.email, password: formData.password })
      .then((data: ILoginResponse) => {
        if (data.token && data.user) {
          dispatchUser({ type: 'LOGIN', payload: { user: data.user, token: data.token } })
        }
      })
  }

  const clearErrors = () => {
    setFormData({ ...formData, error: '' })
  }

  return (
    <PublicLayout>
      <div id='login' className={styles.login}>
        {
          formData.error && (
            <Alert variant='danger' onClose={clearErrors} dismissible>
              { formData.error }
            </Alert>
          )
        }
        <Form onSubmit={submitLogin}>
          <Form.Group controlId='email'>
            <Form.Label>Email:</Form.Label>
            <Form.Control type='email' name='email' onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' name='password' onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Button variant='outline-secondary' type='submit' block>Login</Button>
            <p>
              Don't have an account? <Link href='/register'><a style={{ color: 'white' }}>Register</a></Link>
            </p>
          </Form.Group>
        </Form>
      </div>
    </PublicLayout>
  )
}