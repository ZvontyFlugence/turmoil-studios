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
  username: string,
  email: string,
  password: string,
  error?: string
}

interface IAuthResponse {
  token?: string,
  user?: IUser,
  error?: string,
}

export default function Register(): JSX.Element {
  const dispatch = useDispatchUser()
  const [formData, setFormData] = useState<IFormData>({
    username: '',
    email: '',
    password: '',
  })

  const submit = (e: any) => {
    e.preventDefault()

    let payload = { ...formData, error: undefined }
    TSApi.register(payload).then((data: IAuthResponse) => {
      if (data.token && data.user) {
        dispatch({ type: 'LOGIN', payload: { token: data.token, user: data.user } })
      }
    })
    .catch(({ error }: IAuthResponse) => {
        setFormData({ ...formData, error })
    })
    .catch(err => console.log('REGISTER ERROR:', err))
  }

  const clearErrors = () => {
    setFormData({ ...formData, error: undefined })
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <PublicLayout>
      <div id='register' className={styles.login}>
        {
          formData.error && (
            <Alert variant='danger' onClose={clearErrors} dismissible>
              { formData.error }
            </Alert>
          )
        }      
        <Form onSubmit={submit}>
          <Form.Group controlId='username'>
            <Form.Label>Username:</Form.Label>
            <Form.Control type='text' name='username' onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email:</Form.Label>
            <Form.Control type='email' name='email' onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password:</Form.Label>
            <Form.Control type='password' name='password' onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Button variant='outline-secondary' type='submit' block>
              Register
            </Button>
            <p>
              Already have an account? <Link href='/login'><a style={{ color: 'white' }}>Login</a></Link>
            </p>
          </Form.Group>
        </Form>
      </div>
    </PublicLayout>
  )
}