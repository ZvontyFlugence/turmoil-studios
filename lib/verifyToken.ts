import jwt from 'jsonwebtoken'
import { connect } from './db'

const secret = process.env.TS_SECRET || 'TS_SECRET'

export default async function verifyToken(old_token: string) {
  return await jwt.verify(old_token, secret, async (err: any, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        let expiredAt = err.expiredAt
        let now = Math.floor(Date.now() / 1000)
        let acceptableRange = 86400 * 7
        if ((now - expiredAt) < acceptableRange) {
          let decoded: any = jwt.decode(old_token)
          return await connect(async (dbErr, dbClient) => {
            if (dbErr) {
              return { type: 'invalid', error: dbErr.message }
            }
            const users = dbClient.collection('users')
            const user = await users.findOne({ _id: decoded.user_id }, { projection: { password: 0 }})
            const new_token = jwt.sign({ user_id: decoded.user_id }, secret, { expiresIn: '1d' })
            return { type: 'refreshed', user_id: decoded.user_id, token: new_token, user, admin: user.admin }
          })
        }
      }

      return { type: 'invalid', error: err.message }
    } else {
      return await connect(async (dbErr, dbClient) => {
        if (dbErr) {
          return { type: 'invalid', error: dbErr.message }
        }
        const users = dbClient.collection('users')
        const user = await users.findOne({ _id: decoded.user_id }, { projection: { password: 0 }})
        return { type: 'valid', user_id: decoded.user_id, user , admin: user.admin}
      })      
    }
  })
}