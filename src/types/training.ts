export interface DownloadableFile {
  name: string
  url: string
  size_bytes: number
  type: string
}

export interface TrainingCourse {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  sort_order: number
  module_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TrainingModule {
  id: string
  course_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  sort_order: number
  lesson_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TrainingLesson {
  id: string
  module_id: string
  title: string
  description: string | null
  video_url: string | null
  video_duration_seconds: number | null
  content_html: string | null
  downloadable_files: DownloadableFile[]
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  module_id: string
  completed: boolean
  completed_at: string | null
  last_watched_seconds: number
  created_at: string
  updated_at: string
}
