import { useState } from "react"
import { toast } from "react-toastify"

import type { PostLoginArgs } from "~popup/api/postLogin"
import { useLogin } from "~popup/hooks/useLogin"
import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import githubIcon from "/assets/github-icon.png"
import googleIcon from "/assets/google-icon.png"
import icon from "/assets/icon.png"
import microsoftIcon from "/assets/microsoft-icon.png"

export const Login = () => {
  const { setRouterPage } = useRouter()

  const [form, setForm] = useState<PostLoginArgs>({
    email: "",
    password: ""
  })
  const { mutate: login, isPending } = useLogin()

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()

    if (form.email === "" || form.password === "") {
      toast("Please fill in all fields.")
      return
    }

    login(form)
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
        <button className="plasmo-btn plasmo-btn-outline plasmo-w-full">
          <img src={githubIcon} className="plasmo-w-8 plasmo-h-8" />
          Sign in with Github
        </button>
      </div>
      <form action="" className="plasmo-mt-8" onSubmit={handleLogin}>
        <div className="plasmo-space-y-6">
          <input
            type="email"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            required={true}
            placeholder="Email *"
            value={form?.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            required={true}
            placeholder="Password *"
            value={form?.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <button
              type="submit"
              className="plasmo-btn plasmo-btn-primary plasmo-w-full">
              {isPending ? (
                <div className="plasmo-loading plasmo-loading-spinner"></div>
              ) : (
                <>Login</>
              )}
            </button>
            <div>
              <div>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="plasmo-text-blue-500"
                  onClick={() => setRouterPage(ROUTE_PAGE.REGISTER)}>
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
