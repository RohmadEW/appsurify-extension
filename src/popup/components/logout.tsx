import { useLogout } from "~popup/hooks/useLogout"

export const Logout = () => {
  const { mutate: logout, isPending: loading } = useLogout()

  const handleLogout = () => {
    logout({})
  }

  return (
    <button
      className="plasmo-btn plasmo-btn-warning plasmo-btn-outline plasmo-w-full plasmo-mt-10"
      onClick={handleLogout}>
      {loading ? (
        <div className="plasmo-loading plasmo-loading-spinner"></div>
      ) : (
        <>Logout</>
      )}
    </button>
  )
}
