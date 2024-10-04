import { createContext, useContext, useState } from "react"

import { ROUTE_PAGE } from "~popup/types/route"

interface RouteContextProps {
  currentRoute: ROUTE_PAGE
  setRoute: (route: ROUTE_PAGE) => void
}

const RouteContext = createContext<RouteContextProps>({
  currentRoute: ROUTE_PAGE.LOGIN,
  setRoute: () => {}
})

export const RouteProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<ROUTE_PAGE>(ROUTE_PAGE.LOGIN)

  const setRoute = (route: ROUTE_PAGE) => {
    setCurrentRoute(route)
  }

  return (
    <RouteContext.Provider value={{ currentRoute, setRoute }}>
      {children}
    </RouteContext.Provider>
  )
}

export const useRoute = (): RouteContextProps => {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider")
  }
  return context
}
