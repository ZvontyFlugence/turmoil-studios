import ApiService from './Api'

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

interface LoginPayload {
  email: string,
  password: string,
}

interface ITSApi {
  setToken: (token: string | null) => void,
  login: (payload: LoginPayload) => Promise<any>,
  validate: () => Promise<any>,
  deleteAccount: () => Promise<any>,
  editAccount: (payload: any) => Promise<any>,
  getAccounts: () => Promise<any>,
  adminEditAccount: (id: number, payload: any) => Promise<any>,
}

let client: ApiService = new ApiService({})
const TSApi: ITSApi = {
  setToken: (token: string | null) => {
    if (token)
      client = new ApiService({ headers: { ...HEADERS, 'Authorization': token } })
  },
  login: (payload: LoginPayload) => client.post('/auth/login', payload),
  validate: () => client.get('/auth/validate'),
  deleteAccount: () => client.delete('/users'),
  editAccount: (payload: any) => client.patch('/users', payload),
  getAccounts: () => client.get('/users/all'),
  adminEditAccount: (id: number, payload: any) => client.patch(`/users/${id}`, payload),
}

export default TSApi