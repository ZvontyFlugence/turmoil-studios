import Cors from 'cors'
import bcrypt from 'bcryptjs'

import { connect } from '../../../lib/db'
import initMiddleware from '../../../lib/initMiddleware'
import verifyToken from '../../../lib/verifyToken'

const cors = initMiddleware(
  Cors({
    methods: ['PATCH', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'PATCH':
      return await adminEditAccount(req, res)
    default:
      res.setHeaders('Allow', ['PATCH', 'OPTIONS'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function adminEditAccount(req: any, res: any) {
  let result: any = await verifyToken(req.headers.authorization)

  if (!result) {
    return res.status(500).json({ error: 'Something Went Wrong!' })
  } else if (result.error) {
    return res.status(500).json({ error: result.error })
  } else if (!result.admin) {
    return res.status(403).json({ error: 'You do not have permission to do this' })
  }

  if (req.body.hasOwnProperty('password')) {
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
  }

  switch (result.type) {
    case 'valid':
    case 'refreshed':
      return await connect(async (dbErr, dbClient) => {
        if (dbErr) {
          return res.status(500).json({ error: 'Something Went Wrong!' })
        }

        const users = dbClient.collection('users')
        if (req.body.hasOwnProperty('status') && req.body.status === 'Banned') {
          const user = await users.findOne({ _id: Number.parseInt(req.params.id) }, { projection: { admin: 1 } })
          if (user.admin) {
            return res.status(400).json({ error: 'You cannot ban another admin!' })
          }
        }
        let patch_res = await users.findOneAndUpdate({ _id: Number.parseInt(req.params.id) }, { $set: req.body })
        if (patch_res.ok) {
          return res.status(200).json({ success: true })
        }
        return res.status(500).json({ error: 'Failed to update account' })
      })
    default:
      return res.status(401).json({ error: 'Error Occurred' })
  }
}