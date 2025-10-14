export interface Club {
  id: string
  name: string
  nameEn: string
  nameTh: string
  description: string
  descriptionEn: string
  descriptionTh: string
  category: ClubCategory
  coverImage: string
  logo?: string
  memberCount: number
  contactEmail?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    line?: string
  }
  createdAt: string
}

export interface Event {
  id: string
  clubId: string
  club?: Club
  title: string
  titleEn: string
  titleTh: string
  description: string
  descriptionEn: string
  descriptionTh: string
  coverImage: string
  date: string
  time: string
  location: string
  locationEn: string
  locationTh: string
  capacity?: number
  registeredCount: number
  category: EventCategory
  tags: string[]
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  createdAt: string
}

export interface Activity {
  id: string
  type: "event" | "announcement" | "achievement"
  title: string
  description: string
  image?: string
  clubId?: string
  clubName?: string
  date: string
  likes: number
  comments: number
  shares: number
}

export type ClubCategory = "arts" | "sports" | "academic" | "technology" | "culture" | "volunteer" | "music" | "other"

export type EventCategory =
  | "workshop"
  | "competition"
  | "seminar"
  | "social"
  | "sports"
  | "cultural"
  | "volunteer"
  | "other"

export interface User {
  id: string
  studentId: string
  name: string
  email: string
  faculty: string
  year: number
  interests: string[]
  followedClubs: string[]
  language: "en" | "th"
  avatar?: string
}
