import { useReducer, createContext, useContext, Dispatch } from 'react'

interface IProps {
  children: JSX.Element[] | JSX.Element
}

interface IAction {
  type: string,
  payload: any
}

export interface IPage {
  name: string,
  url: string,
}

type Path = IPage[]

const initialState: Path = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Library', url: '/dashboard' },
]

const reducer = (state: Path = initialState, action: IAction): Path => {
  switch (action.type) {
    case 'APPEND':
      return [...state, action.payload.page]
    case 'POP':
      let newState: Path = state
      newState.pop()
      return [...newState]
    case 'REPLACE':
      newState = state
      newState[newState.length - 1] = action.payload.page
      return [...newState]
    case 'RESET':
      return [...initialState]
    default:
      return state
  }
}

const PathStateContext = createContext<Path>(initialState)
const PathDispatchContext = createContext<Dispatch<any> | (() => void)>(() => {})

export const PathProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PathDispatchContext.Provider value={dispatch}>
      <PathStateContext.Provider value={state}>
        { children }
      </PathStateContext.Provider>
    </PathDispatchContext.Provider>
  )
}

export const usePath = () => useContext(PathStateContext)
export const useDispatchPath = () => useContext(PathDispatchContext)