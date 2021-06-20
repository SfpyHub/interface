import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from './AuthContext'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function ProtectedRoute({ component, ...rest }) {
  const { merchant, apikey } = useAuth()
  let Component = component
  return (
    <Route
      {...rest}
      component={({ location, ...rest }) =>
        merchant && apikey ? (
          <Component {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
