import { useReducer, useContext, createContext, Dispatch } from 'react'
import TSApi from '../services/TurmoilStudios'

interface IProps {
  children: JSX.Element[] | JSX.Element
}

export interface IUser {
  _id: number,
  email: string,
  username: string,
  password?: string,
  createdAt: Date,
  admin: boolean,
  status: string,
  games: string[],
}

const reducer = (state: IUser | null, action: any): IUser | null => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token)
      TSApi.setToken(action.payload.token)
      return { ...action.payload.user }
    case 'LOAD':
    case 'VALIDATE':
      return { ...action.payload.user }
    case 'DELETE':
    case 'LOGOUT':
      localStorage.removeItem('token')
      TSApi.setToken(undefined)
      return null
    default:
      return state
  }
}

const UserStateContext = createContext<IUser | null>(null)
const UserDispatchContext = createContext<Dispatch<any> | (() => void)>(() => {})

export const UserProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, null)

  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={state}>
        { children }
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  )
}

export const useUser = () => useContext(UserStateContext)
export const useDispatchUser = () => useContext(UserDispatchContext)