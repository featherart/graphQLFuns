import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({ uri: 'https://snowtooth.moonhighway.com' })
const cache = new InMemoryCache()

const wsLink = new WebSocketLink({
  uri: 'ws://snowtooth.moonhighway.com/graphql',
  options: {
    reconnect: true,
    lazy: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
    wsLink,
    httpLink
)

const client = new ApolloClient({
  link,
  cache
})

console.log(client)

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
