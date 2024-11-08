import { useCookies } from "react-cookie"

import { ROUTE_PAGE, ROUTE_PAGE_COOKIE } from "~popup/types/route"

export const useRouter = () => {
  const [cookieRoutePage, setCookieRoutePage] = useCookies([ROUTE_PAGE_COOKIE])

  const setRouterPage = (page: ROUTE_PAGE) => {
    setCookieRoutePage(ROUTE_PAGE_COOKIE, page)
  }

  return {
    routerPage: cookieRoutePage[ROUTE_PAGE_COOKIE],
    setRouterPage
  }
}
