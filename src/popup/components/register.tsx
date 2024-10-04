import { ROUTE_PAGE } from "~popup/types/route"

import icon from "/assets/icon.png"

interface RegisterProps {
  setRouterPage: (page: ROUTE_PAGE) => void
}

export const Register = ({ setRouterPage }: RegisterProps) => {
  const handleLogin = () => {
    setRouterPage(ROUTE_PAGE.LOGIN)
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Sign Up
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
          <button className="plasmo-btn plasmo-btn-primary plasmo-w-full">
            Sign Up
          </button>
          <button
            className="plasmo-btn plasmo-btn-ghost plasmo-w-full"
            onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
