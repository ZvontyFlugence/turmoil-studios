import Cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Collection, Db, InsertOneWriteOpResult } from 'mongodb'

import { connectAsync } from '../../../lib/db'
import initMiddleware from '../../../lib/initMiddleware'

const secret = process.env.NEXT_PUBLIC_SECRET || 'TS_SECRET'

type DB = (Db | null)

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
  })
)

export default async (req: any, res: any) => {
  await cors(req, res)

  switch (req.method) {
    case 'POST':
      return await register(req, res)
    default:
      res.setHeader('Allow', ['POST', 'OPTIONS'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function register(req: any, res: any) {
  const { username, email, password } = req.body

  // Check for missing fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing credentials' })
  }

  // Get DB connection
  let db: DB = await connectAsync()

  if (!db) {
    return res.status(500).json({ error: 'MongoDB connection failed' })
  }

  // Get collection
  let userColl: Collection<any> = db.collection('users')

  // Check if username is taken
  let user = await userColl.findOne({ username })
  if (user) {
    return res.status(400).json({ error: 'Username is already taken!' })
  }

  // Check if email is taken
  user = await userColl.findOne({ email })
  if (user) {
    return res.status(400).json({ error: 'Email is already in use!' })
  }

  // Create TS Account
  const hashedpw: string = await bcrypt.hash(password, await bcrypt.genSalt())
  const num_users: number = await userColl.estimatedDocumentCount()
  const user_doc = {
    _id: num_users + 1,
    username,
    email,
    password: hashedpw,
    admin: false,
    createdAt: new Date(Date.now()),
    status: 'Ok',
    games: ['SoT'],
  }

  const result: InsertOneWriteOpResult<any> = await userColl.insertOne(user_doc)
  if (result.result.ok === 1 && result.insertedCount === 1) {
    let user = result.ops[0]
    let token: string = jwt.sign({ user_id: user._id }, secret, { expiresIn: '1d' })
    delete user.password
    return res.status(201).json({ token, user })
  } else {
    return res.status(500).json({ error: 'Registration Failed!' })
  }
}