export interface Team {
  id: number
  name: string
  slug: string
  members: Member[]
  invitations: string[]
  dashboard_url: string
  is_admin: boolean
  subscription: string | null
  has_active_subscription: boolean
}

export const TEAM_ID_COOKIE = "team_id"

export interface Member {
  id: number
  user_id: number
  first_name: string
  last_name: string
  display_name: string
  role: string
}
