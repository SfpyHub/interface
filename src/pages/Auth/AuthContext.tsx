import React, { useContext, createContext } from 'react'
import { useProvideMerchantAuth } from '../../state/auth/hooks'

const AuthContext = createContext(undefined)

export function useAuth() {
  return useContext(AuthContext)
}

export function ProvideAuth({ children }) {
  const auth = useProvideMerchantAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
