-- =============================================
-- TeraReview Widget — Supabase Migration
-- 범용 리뷰 위젯용 스키마 (프로젝트별 분리)
-- =============================================

-- review_comments 테이블
CREATE TABLE IF NOT EXISTS review_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,                    -- 프로젝트 식별자 (e.g., 'evermarine')
  page_url TEXT NOT NULL,                      -- 페이지 경로 (e.g., '/about')
  x_percent NUMERIC(5,2) NOT NULL,            -- X 좌표 (뷰포트 %)
  y_percent NUMERIC(5,2) NOT NULL,            -- Y 좌표 (뷰포트 %)
  content TEXT NOT NULL,                       -- 코멘트 내용
  status TEXT NOT NULL DEFAULT 'open'          -- open | in_progress | resolved
    CHECK (status IN ('open', 'in_progress', 'resolved')),
  author_name TEXT NOT NULL DEFAULT 'Guest',   -- 작성자 이름
  image_url TEXT,                              -- 첨부 이미지 URL
  meta_viewport TEXT,                          -- 작성 시 뷰포트 크기
  meta_browser TEXT,                           -- 브라우저
  meta_os TEXT,                                -- OS
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_rc_project ON review_comments(project_id);
CREATE INDEX idx_rc_page ON review_comments(page_url);
CREATE INDEX idx_rc_status ON review_comments(status);
CREATE INDEX idx_rc_project_page ON review_comments(project_id, page_url);

-- RLS
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON review_comments FOR SELECT USING (true);

CREATE POLICY "Anyone can insert comments"
  ON review_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update comments"
  ON review_comments FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete comments"
  ON review_comments FOR DELETE USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE review_comments;

-- 이미지 Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read review images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Anyone can delete review images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'review-images');
