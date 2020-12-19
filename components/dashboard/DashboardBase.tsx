import Router from 'next/router'

import { useUser } from '../../context/UserContext'
import { IPage, useDispatchPath, usePath } from '../../context/PathContext'
import PrivateLayout from '../layout/PrivateLayout'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import styles from '../../styles/dashboard.module.scss'

interface IProps {
  children: JSX.Element[] | JSX.Element
}

export default function Dashboard({ children }: IProps): JSX.Element {
  const user = useUser()
  const pagePath = usePath()
  const dispatchPath = useDispatchPath()
  
  const navigateTo = (page: IPage) => {
    if (page.name !== 'Dashboard') {
      while (pagePath[pagePath.length - 1].name !== page.name) {
        dispatchPath({ type: 'POP' })
      }
    } else {
      dispatchPath({ type: 'RESET' })
    }

    Router.push(page.url)
  }

  return (
    <PrivateLayout>
      <Container id='dashboard' fluid className={styles.dashboard}>
        <Row>
          <Breadcrumb style={{ width: '100vw' }}>
            {
              pagePath.map((page, idx) => {
                if (idx === pagePath.length - 1) {
                  return (
                    <Breadcrumb.Item key={idx} active>{ page.name }</Breadcrumb.Item>
                  )
                } else {
                  return (
                    <Breadcrumb.Item key={idx} onClick={() => navigateTo(page)}>
                      { page.name }
                    </Breadcrumb.Item>
                  )
                }
              })
            }
          </Breadcrumb>
        </Row>
        { children }
      </Container>
    </PrivateLayout>
  )
}