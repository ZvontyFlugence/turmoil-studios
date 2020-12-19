import { useEffect, useState } from 'react'
import TSApi from '../../services/TurmoilStudios'

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'

export default function AdminPortal(): JSX.Element {
  const [accounts, setAccounts] = useState([])
  //const [activeKey, setActiveKey] = useState('accounts')

  useEffect(() => {
    TSApi.getAccounts().then(data => {
      if (data.success)
        setAccounts(data.accounts)
    })
    .catch(async (_: any) => {
      while (accounts.length === 0) {
        let data: any = await TSApi.getAccounts()

        if (data.success) {
          setAccounts(data.accounts)
          break
        }
      }
    })
  }, [])

  const banAccount = (accountID: number) => {
    TSApi.adminEditAccount(accountID, { status: 'Banned' })
      .then(data => {
        if (data.success)
          window.location.reload()
      })
  }

  const unbanAccount = (accountID: number) => {
    TSApi.adminEditAccount(accountID, { status: 'Ok' })
      .then(data => {
        if (data.success)
          window.location.reload()
      })
  }

  const adminBadge = (acc: any) => acc.admin ? (<Badge className='acc-badge' variant='info'>Admin</Badge>) : (<></>);
  const bannedBadge = (acc: any) => acc.status === 'Banned' ? (<Badge className='acc-badge' variant='danger'>Banned</Badge>) : (<></>);
  const accAction = (acc: any) => {
    if (acc.status === 'Banned') {
      return (<Button variant='warning' onClick={() => unbanAccount(acc._id)}>Unban</Button>);
    } else if (acc.admin) {
      return (<span>None</span>);
    } else {
      return (<Button variant='danger' onClick={() => banAccount(acc._id)}>Ban</Button>);
    }
  }


  return (
    <Container fluid>
      <Row>
        <h5>Admin Portal</h5>
      </Row>
      <Tabs id='adminPortalNav' defaultActiveKey='accounts'>
        <Tab eventKey='accounts' title='Accounts'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                accounts.map((acc: any) => {
                  let date = new Date(Date.parse(acc.createdAt))
                  return (
                    <tr key={acc._id}>
                      <td>{ acc._id }</td>
                      <td>
                        { acc.username }
                        { adminBadge(acc) }
                        { bannedBadge(acc) }
                      </td>
                      <td>{ acc.email}</td>
                      <td>{ date.getMonth()+1 }/{ date.getDate() }/{ date.getFullYear() }</td>
                      <td>{ acc.status }</td>
                      <td>{ accAction(acc) }</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey='blogs' title='Blogs'>
          
        </Tab>
      </Tabs>
    </Container>
  )
}