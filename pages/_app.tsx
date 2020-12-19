import React from 'react'

import { UserProvider } from '../context/UserContext'
import { PathProvider } from '../context/PathContext'

import '../styles/index.scss'
import '../styles/app.scss'

interface IProps {
  Component: typeof React.Component,
  pageProps: any
}

function MyApp({ Component, pageProps }: IProps): JSX.Element {
  return (
    <UserProvider>
      <PathProvider>
        <Component {...pageProps} />
      </PathProvider>
    </UserProvider>
  )
}

export default MyApp
