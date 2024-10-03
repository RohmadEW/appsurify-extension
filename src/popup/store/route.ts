import { atom } from "jotai"

import { ROUTE_PAGE } from "~popup/types/route"

export const routerPageStore = atom<ROUTE_PAGE>(ROUTE_PAGE.LOGIN)
