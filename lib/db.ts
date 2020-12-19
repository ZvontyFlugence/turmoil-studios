import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const dbName = process.env.NEXT_PUBLIC_DB_NAME
const uri = process.env.NEXT_PUBLIC_MONGO_URI || 'mongodb://localhost:27017'
const options = { useNewUrlParser: true, useUnifiedTopology: true }

interface IDb {
  db?: mongodb.Db | null
}

const state: IDb = { db: null }

export const connect = async (callback: (err: any, db: any) => any) => {
  if (state.db) {
    return await callback(undefined, state.db)
  } else {
    return await MongoClient.connect(uri, options, async (err: any, client: any) => {
      if (err) {
        return await callback(err, undefined)
      } else {
        state.db = client.db(dbName)
        return await callback(undefined, state.db)
      }
    })
  }
}

export const connectAsync = async () => {
  if (state.db) {
    return state.db
  } else {
    let dbClient = await MongoClient.connect(uri, options)

    if (dbClient) {
      state.db = dbClient.db(dbName)
      return state.db
    } else {
      return null
    }
  }
}

export const getPrimaryKey = (_id?: string): mongodb.ObjectID => {
  return new ObjectID(_id)
}

export const getDB = (): any => {
  return state.db
}