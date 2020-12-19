import Cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { connect } from '../../../lib/db'
import initMiddleware from '../../../lib/initMiddleware'

const secret = process.env.NEXT_PUBLIC_SECRET || 'TS_SECRET'

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'POST':
      return await login(req, res)
    default:
      res.setHeader('Allow', ['POST', 'OPTIONS'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function login(req: any, res: any) {
  const { email, password } = req.body
  connect(async (dbErr: any, dbClient: any) => {
    if (dbErr)
      return res.status(500).json({ error: 'Something Went Wrong!' })

    const users = dbClient.collection('users')
    let user = await users.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'Invalid Credentials!' })
    } else {
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(400).json({ error: 'Invalid Credentials!' })
      } else if (user.status === 'Banned') {
        return res.status(400).json({ error: 'Your account is currently banned!' })
      }

      let token = jwt.sign({ user_id: user._id, email: user.email }, secret, { expiresIn: '1d' })
      delete user.password
      return res.status(200).json({ token, user })
    }
  })
}