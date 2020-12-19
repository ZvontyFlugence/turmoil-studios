import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_ROOT = process.env.API_URL || 'http://localhost:8080/api/'
const TIMEOUT = 20000
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

interface IProps {
  baseURL?: string,
  timeout?: number,
  headers?: {
    [name: string]: string
  }
}

interface IApi {
  client: AxiosInstance,
}

export default class ApiService implements IApi {
  client: AxiosInstance
  constructor ({ baseURL = API_ROOT, timeout = TIMEOUT, headers = HEADERS }: IProps) {
    const client = axios.create({ baseURL, timeout, headers })
    client.interceptors.response.use(this.handleSuccess, this.handleError)
    this.client = client;
  }

  handleSuccess(response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>> {
    return response
  }

  handleError(error: any): any {
    return Promise.reject(error)
  }

  get(path: string): Promise<any> {
    return this.client.get(path).then(response => response.data)
  }

  post(path: string, payload: any): Promise<any> {
    return this.client.post(path, payload).then(response => response.data)
  }

  put(path: string, payload: any): Promise<any> {
    return this.client.put(path, payload).then(response => response.data);
  }

  patch(path: string, payload: any): Promise<any> {
    return this.client.patch(path, payload).then(response => response.data);
  }

  delete(path: string): Promise<any> {
    return this.client.delete(path).then(response => response.data);
  }
}