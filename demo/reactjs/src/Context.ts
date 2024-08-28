import React from "react"

interface ContextValue {
  count?: () => void
}

export const Context = React.createContext<ContextValue>({})
