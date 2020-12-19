import Cors from 'cors'
import bcrypt from 'bcryptjs'

import { connect } from '../../../lib/db'
import initMiddleware from '../../../lib/initMiddleware'
import verifyToken from '../../../lib/verifyToken'

const cors = initMiddleware(
  Cors({
    methods: ['DELETE', 'PATCH', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'DELETE':
      return await deleteAccount(req, res)
    case 'PATCH':
      return await editAccount(req, res)
    default:
      res.setHeader('Allow', ['DELETE', 'PATCH', 'OPTIONS'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function editAccount(req: any, res: any) {
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
        if (req.body.hasOwnProperty('password') && req.body.hasOwnProperty('newPass')) {
          // Check Password
          const { password, newPass } = req.body
          let user = await users.findOne({ _id: result.user_id })
          if (await bcrypt.compare(password, user.password)) {
            // Valid Password
            let hashedpw = await bcrypt.hash(newPass, await bcrypt.genSalt())
            let updates = {
              ...req.body,
              password: hashedpw,
            }
            delete updates.newPass
            let patch_res = await users.findOneAndUpdate({ _id: result.user_id }, { $set: updates }, { returnOriginal: false })
            if (patch_res.ok) {
              delete patch_res.value.password
              return res.status(200).json({ success: true, user: patch_res.value, status_code: 200 })
            } else {
              return res.status(500).json({ success: false, error: 'Failed to update account', status_code: 500 })
            }
          } else {
            // Invalid Password
            return res.status(401).json({ success: false, error: 'Invalid Credentials', status_code: 401 })
          }
        } else {
          // Check if Username already taken
          if (req.body.hasOwnProperty('username')) {
            let user = await users.findOne({ username: req.body.username })
            if (user) {
              return res.status(400).json({ success: false, error: 'Username is already taken!', status_code: 400 })
            }
          }

          // Check if email is already associated with an account
          if (req.body.hasOwnProperty('email')) {
            let user = await users.findOne({ email: req.body.email })
            if (user) {
              return res.status(400).json({ success: false, error: 'Email is already in use!', status_code: 400 })
            }
          }
          // Edit User
          let patch_res = await users.findOneAndUpdate({ _id: result.user_id }, { $set: { ...req.body } }, { projection: { password: 0 }, returnOriginal: false })
          if (patch_res.ok) {
            return res.status(200).json({ success: true, user: patch_res.value, status_code: 200 })
          } else {
            return res.status(500).json({ success: false, error: 'Failed to update account', status_code: 500 })
          }
        }
      })
    default:
      return res.status(401).json({ error: 'Error Occurred' })
  }
}

async function deleteAccount(req: any, res: any) {
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
        const delete_res = await users.findOneAndDelete({ _id: result.user_id })
          if (delete_res.ok) {
            return res.status(200).json({ success: true, status_code: 200 })
          } else {
            return res.status(500).json({ success: false, error: 'Failed to delete account', status_code: 500 })
          }
      })
    default:
      return res.status(401).json({ error: 'Error Occurred' })
  }
}