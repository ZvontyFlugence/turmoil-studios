import { useEffect, useState } from 'react'
import Router from 'next/router'

import { useDispatchUser, useUser } from '../../context/UserContext'
import PrivateNavbar from '../nav/PrivateNavbar'
import TSApi from '../../services/TurmoilStudios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

interface IProps {
  children: JSX.Element[] | JSX.Element
}

export default function PrivateLayout({ children }: IProps): JSX.Element {
  const user = useUser()
  const dispatch = useDispatchUser()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (!token) {
      Router.push('/')
    } else {
      if (token && !user) {
        TSApi.setToken(token)
        setIsLoading(true)
        TSApi.validate().then(data => {
          switch (data.result) {
            case 'valid':
              let payload = { user: data.user, token: undefined }
              dispatch({ type: 'VALIDATE', payload })
              break
            case 'refreshed':
              payload = { user: data.user, token: data.token }
              dispatch({ type: 'LOGIN', payload })
              break
            default:
              dispatch({ type: 'LOGOUT' })
              break
          }
          setIsLoading(false)
        })
      }
    }
  }, [])

  return !isLoading ? (
    <>
      {
        user ? (
          <Container fluid>
            <Row id='ts-navbar'>
              <PrivateNavbar user={user} />
            </Row>
            <Row id='ts-body'>
              { children }
            </Row>
            <Row id='ts-footer'>
              <p>
                2020 &copy; Turmoil Studios. All Rights Reserved.
              </p>
            </Row>
          </Container>
        ) : (
          <></>
        )
      }
    </>
  ) : (
    <Spinner animation='grow' />
  )
}