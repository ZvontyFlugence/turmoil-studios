import { useEffect } from 'react'
import Router from 'next/router'
import Head from 'next/head'

import { useDispatchUser, useUser } from '../../context/UserContext'
import PublicNavbar from '../nav/PublicNavbar'
import TSApi from '../../services/TurmoilStudios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

interface IProps {
  children?: JSX.Element[] | JSX.Element
}

export default function PublicLayout({ children }: IProps): JSX.Element {
  const user = useUser()
  const dispatch = useDispatchUser()

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token && !user) {
      TSApi.setToken(token)
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
      })
      .catch(_ => {
        dispatch({ type: 'LOGOUT' })
      })
    }
  })

  useEffect(() => {
    if (user) {
      Router.push('/dashboard')
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Turmoil Studios</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid>
        <Row id='ts-navbar'>
          <PublicNavbar /> 
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
    </>
  )
}