import Cors from 'cors'

import { connect } from '../../../lib/db'
import initMiddleware from '../../../lib/initMiddleware'
import verifyToken from '../../../lib/verifyToken'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'GET':
      return await getAllUsers(req, res)
    default:
      res.setHeader('Allow', ['GET', 'OPTIONS'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function getAllUsers(req: any, res: any) {
  let result: any = await verifyToken(req.headers.authorization)

  if (!result) {
    return res.status(500).json({ error: 'Something Went Wrong!' })
  } else if (result.error) {
    return res.status(500).json({ error: result.error })
  }

  switch (result.type) {
    case 'valid':
    case 'refreshed':
      return await connect(async (dbErr, dbClient) => {
        if (dbErr) {
          return res.status(500).json({ error: 'Something Went Wrong!' })
        }

        const users = dbClient.collection('users')
        if (result.admin) {
          return users.find({}, { projection: { password: 0 } })
            .toArray((err: any, docs: any) => {
              if (err) {
                return res.status(500).json({ error: 'Something Went Wrong!'})
              }
              return res.status(200).json({ success: true, accounts: docs })
            })
        } else {
          return users.find({}, { projection: { email: 0, password: 0 } })
            .toArray((err: any, docs: any) => {
              if (err) {
                return res.status(500).json({ error: 'Something Went Wrong!' })
              }
              return res.status(200).json({ success: true, accounts: docs })
            })
        }
      })
    default:
      return res.status(401).json({ error: 'Error Occurred' })
  }
}