import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import githubIcon from "/assets/github-icon.png"
import googleIcon from "/assets/google-icon.png"
import icon from "/assets/icon.png"
import microsoftIcon from "/assets/microsoft-icon.png"

export const Register = () => {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Sign Up
      </div>
      <div className="plasmo-mt-6 plasmo-space-y-2 plasmo-px-8">
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-w-full"
          onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
          <img src={googleIcon} className="plasmo-w-8 plasmo-h-8" />
          <div>Sign Up with Google</div>
        </button>
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-w-full"
          onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
          <img src={microsoftIcon} className="plasmo-w-8 plasmo-h-8" />
          Sign Up with Microsoft
        </button>
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-w-full"
          onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
          <img src={githubIcon} className="plasmo-w-8 plasmo-h-8" />
          <div>Sign Up with Github</div>
        </button>
      </div>
      <form action="" className="plasmo-mt-6">
        <div className="plasmo-space-y-6">
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Name *"
          />
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Last Name *"
          />
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Email *"
          />
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Company *"
          />
          <input
            type="password"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Password *"
          />
          <input
            type="password"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Re-enter Password *"
          />
          <button
            className="plasmo-btn plasmo-btn-primary plasmo-w-full"
            onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
            Sign Up
          </button>
          <button
            className="plasmo-btn plasmo-btn-ghost plasmo-w-full"
            onClick={() => setRouterPage(ROUTE_PAGE.LOGIN)}>
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
