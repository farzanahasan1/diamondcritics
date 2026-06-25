export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  post_karma: number
  comment_karma: number
  is_admin: boolean
  is_banned: boolean
  created_at: string
}

export interface Community {
  id: string
  slug: string
  name: string
  description: string | null
  rules: string | null
  icon_url: string | null
  banner_url: string | null
  member_count: number
  post_count: number
  created_at: string
}

export interface Post {
  id: string
  community_id: string
  author_id: string | null
  title: string
  body: string | null
  url: string | null
  image_url: string | null
  type: 'text' | 'link' | 'image'
  score: number
  upvotes: number
  downvotes: number
  comment_count: number
  is_deleted: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
  author?: Profile | null
  community?: Community | null
  user_vote?: -1 | 0 | 1
}

export interface Comment {
  id: string
  post_id: string
  author_id: string | null
  parent_id: string | null
  body: string
  score: number
  is_deleted: boolean
  created_at: string
  author?: Profile | null
  user_vote?: -1 | 0 | 1
  replies?: Comment[]
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string
  color: string
}

export interface UserBadge {
  badge_id: string
  awarded_at: string
  badge: Badge
}
