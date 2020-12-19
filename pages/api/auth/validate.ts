import Cors from 'cors'
import jwt from 'jsonwebtoken'
import initMiddleware from '../../../lib/initMiddleware'
import { connect } from '../../../lib/db'

const secret = process.env.NEXT_PUBLIC_SECRET || 'TS_SECRET'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'GET':
      return await validate(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function validate(req: any, res: any) {
  let token = req.headers.authorization
  if (!token) {
    return res.status(403).json({ error: 'No Auth Token!' })
  }

  await jwt.verify(token, secret, async (err: any, decoded: any) => {
    if (err) {
      if (typeof err == typeof jwt.TokenExpiredError) {
        let expiredAt = err.expiredAt
        let now = Math.floor(Date.now() / 1000)
        let acceptableRange = 86400 * 7
        if ((now - expiredAt) <  acceptableRange) {
          let decoded: any = jwt.decode(token)
          if (decoded) {
            // Get User
            await connect(async (dbErr, dbClient) => {
              if (dbErr) {
                return res.status(500).json({ result: 'invalid', error: 'Something Went Wrong' })
              }
              const users = dbClient.collection('users')
              const user = await users.findOne({ _id: decoded.user_id }, { projection: { password: 0 } })

              if (!user) {
                return res.status(404).json({ result: 'invalid', error: 'User Not Found' })
              }

              const new_token = jwt.sign({ user_id: user._id }, secret, { expiresIn: '1d' })
              return res.status(202).json({ result: 'refreshed', user, token: new_token })
            })
          }
        }
      }

      return res.status(400).json({ result: 'invalid', error: err.message })
    } else {
      // Get User
      await connect(async (dbErr, dbClient) => {
        if (dbErr) {
          return res.status(500).json({ result: 'invalid', error: 'Something Went Wrong' })
        }

        const users = dbClient.collection('users')
        const user = await users.findOne({ _id: decoded.user_id }, { projection: { password: 0 } })

        if (!user) {
          return res.status(404).json({ result: 'invalid', error: 'User Not Found' })
        }

        return res.status(202).json({ result: 'valid', user })
      })
    }
  })
}