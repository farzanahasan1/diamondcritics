export const USER_FLAIR_OPTIONS = [
  { value: "Just Engaged 💍",      color: '#9D174D', bg: '#FDF2F8' },
  { value: "GIA Graduate 🎓",      color: '#1D4ED8', bg: '#EFF6FF' },
  { value: "Lab Diamond Fan 🔬",   color: '#166534', bg: '#F0FDF4' },
  { value: "Veteran Buyer ⭐",     color: '#92400E', bg: '#FFFBEB' },
  { value: "Jeweller 💼",          color: '#5B21B6', bg: '#F5F3FF' },
  { value: "2ct Club 💎",          color: '#065F46', bg: '#ECFDF5' },
  { value: "First Timer 🌱",       color: '#9A3412', bg: '#FFF7ED' },
  { value: "Ring Nerd 🔍",         color: '#334155', bg: '#F8FAFC' },
] as const

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  user_flair?: string | null
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

export const FLAIR_OPTIONS = [
  { value: 'engaged',     label: "I'm Engaged! 💍",    bg: '#FDF2F8', color: '#9D174D' },
  { value: 'natural',     label: 'Natural Diamond 💎',  bg: '#EFF6FF', color: '#1D4ED8' },
  { value: 'lab',         label: 'Lab Diamond 🔬',      bg: '#F0FDF4', color: '#166534' },
  { value: 'just-bought', label: 'Just Bought 🛍️',      bg: '#FFFBEB', color: '#92400E' },
  { value: 'need-advice', label: 'Need Advice 🙋',      bg: '#FFF7ED', color: '#9A3412' },
  { value: 'price-check', label: 'Price Check 💰',      bg: '#F5F3FF', color: '#5B21B6' },
  { value: 'show-tell',   label: 'Show & Tell ✨',      bg: '#ECFDF5', color: '#065F46' },
  { value: 'comparison',  label: 'Comparison 🔍',       bg: '#F8FAFC', color: '#334155' },
  { value: 'gia-igi',     label: 'GIA / IGI Report 📋', bg: '#FEF9C3', color: '#713F12' },
  { value: 'discussion',  label: 'Discussion 💬',       bg: '#F9FAFB', color: '#374151' },
] as const

export type FlairValue = typeof FLAIR_OPTIONS[number]['value']

export interface Post {
  id: string
  community_id: string
  author_id: string | null
  title: string
  body: string | null
  url: string | null
  image_url: string | null
  link_preview_image: string | null
  flair: FlairValue | null
  type: 'text' | 'link' | 'image'
  score: number
  upvotes: number
  downvotes: number
  comment_count: number
  is_deleted: boolean
  is_draft: boolean
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
