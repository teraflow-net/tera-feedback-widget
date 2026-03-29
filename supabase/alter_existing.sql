-- 기존 EverMarine review_comments 테이블에 위젯용 컬럼 추가
-- (이미 존재하면 무시)
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS project_id TEXT DEFAULT 'evermarine';
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS meta_viewport TEXT;
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS meta_browser TEXT;
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS meta_os TEXT;

-- project_id 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_rc_project ON review_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_rc_project_page ON review_comments(project_id, page_url);
