import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { Loading } from './Loading'
import { StatusIndicator } from './StatusIndicator'

const QUERY = gql `
  query {
    allLifts {
      id
      name
      status
      capacity
    }
  }
`
const MUTATION = gql`
  mutation($id: ID! $status: LiftStatus!) {
    setLiftStatus(id: $id status: $status) {
      id
      name
      status
    }
  }
`

const SUBSCRIPTION = gql`
  subscription {
    liftStatusChange {
      id
      status
    }
  }
`

export default function App() {
  const { loading, data } = useQuery(QUERY)
  const [setStatus] = useMutation(MUTATION)
  useSubscription(SUBSCRIPTION)
  if (loading) {
    return <Loading />
  }

  return (
    <section className='container'>
      <h1>Snowtooth Lift Status</h1>
      {data && !loading && (
        <table className='table'>
          <thead>
            <tr>
              <th>Lift Name</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {data.allLifts.map((lift, i) => (
              <tr key={i}>
                <td>{lift.name}</td>
                <td>
                  <StatusIndicator
                    status={lift.status} 
                    onChange={status => setStatus({
                      variables: {
                        id: lift.id,
                        status
                      }
                    })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
