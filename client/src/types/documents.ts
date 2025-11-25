export interface Document {
  id: number;
  user_id: number;
  title: string;
  original_filename: string | null;
  source_path: string | null;
  content_text: string | null;
  uploaded_at: string;
  updated_at: string;
}

export interface ListDocumentsParams {
  search?: string;
}
