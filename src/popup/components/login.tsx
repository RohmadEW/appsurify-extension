import { useRoute } from "~popup/context/route"
import { ROUTE_PAGE } from "~popup/types/route"

import googleIcon from "/assets/google-icon.png"
import icon from "/assets/icon.png"
import microsoftIcon from "/assets/microsoft-icon.png"

export const Login = () => {
  const { setRoute } = useRoute()

  const routeToRegister = () => {
    setRoute(ROUTE_PAGE.REGISTER)
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-mt-6 plasmo-space-y-2 plasmo-px-8">
        <button className="plasmo-btn plasmo-btn-outline plasmo-w-full">
          <img src={googleIcon} className="plasmo-w-8 plasmo-h-8" />
          <div>Sign in with Google</div>
        </button>
        <button className="plasmo-btn plasmo-btn-outline plasmo-w-full">
          <img src={microsoftIcon} className="plasmo-w-8 plasmo-h-8" />
          Sign in with Microsoft
        </button>
      </div>
      <form action="" className="plasmo-mt-8">
        <div className="plasmo-space-y-6">
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Email *"
          />
          <input
            type="password"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Password *"
          />
          <div className="plasmo-space-y-3">
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
              <input
                type="checkbox"
                className="plasmo-checkbox plasmo-checkbox-sm"
                id="remember-me"
              />
              <label
                className="plasmo-font-medium plasmo-mr-auto"
                htmlFor="remember-me">
                Remember me
              </label>
              <a href="#" className="plasmo-text-blue-500">
                Forgot password?
              </a>
            </div>
            <button className="plasmo-btn plasmo-btn-primary plasmo-w-full">
              Login
            </button>
            <div>
              Don't have an account?{" "}
              <button
                className="plasmo-text-blue-500"
                onClick={routeToRegister}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
