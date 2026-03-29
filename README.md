# TeraFeedback Widget

어떤 라이브 사이트에든 `<script>` 한 줄로 피드백 수집 기능을 추가하는 독립 위젯입니다.

## 주요 기능

- **핀 드롭** — 화면 아무 곳이나 클릭하여 정확한 위치에 피드백 남기기
- **이미지 첨부** — 드래그 앤 드롭 / 클립보드 붙여넣기 / 파일 선택
- **사이드바** — 미처리 / 진행중 / 완료 탭으로 피드백 현황 확인
- **실시간 동기화** — Supabase Realtime으로 다른 사용자 피드백 즉시 반영
- **완전 격리** — Shadow DOM으로 호스트 사이트와 CSS/DOM 충돌 없음
- **ON/OFF** — script 태그 추가/제거만으로 완전한 토글

---

## 빠른 시작

### 1. 사이트에 script 추가

```html
<script src="https://teraflow-net.github.io/tera-feedback-widget/dist/feedback-widget.iife.js"
  data-project="my-project"
  data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co"
  data-supabase-key="YOUR_SUPABASE_ANON_KEY">
</script>
```

`</body>` 태그 바로 위에 넣으면 됩니다.

### 2. 사용하기

1. 우하단의 **"피드백 남기기"** 버튼 클릭
2. 처음 사용 시 **이름 입력** (한 번만, 이후 자동 적용)
3. 피드백을 남기고 싶은 **위치를 클릭**
4. **코멘트 입력** + 이미지 첨부 (선택)
5. **Ctrl+Enter** 또는 등록 버튼으로 제출
6. 상단바 **"피드백 목록"** 에서 전체 피드백 확인

### 3. 끄기

script 태그를 제거하면 위젯이 완전히 사라집니다. 데이터는 Supabase에 그대로 남아있어 다시 켜면 복원됩니다.

---

## 설정 옵션

| 속성 | 필수 | 설명 | 예시 |
|------|------|------|------|
| `data-project` | O | 프로젝트 식별자 (사이트마다 다르게) | `evermarine`, `client-a` |
| `data-supabase-url` | O | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `data-supabase-key` | O | Supabase Anon Key | `eyJ...` |

### 프로젝트별 분리

`data-project` 값을 사이트마다 다르게 설정하면 피드백이 자동 분리됩니다.

```html
<!-- 에버마린 사이트 -->
<script src=".../feedback-widget.iife.js" data-project="evermarine" ...></script>

<!-- 고객사 A 사이트 -->
<script src=".../feedback-widget.iife.js" data-project="client-a" ...></script>
```

---

## 워크플로우

```
[고객/담당자]                        [Supabase]
     |                                  |
     |-- 피드백 남기기 클릭 ------------>|
     |-- 이름 입력 (최초 1회) --------->|
     |-- 화면 클릭 → 핀 드롭 --------->|
     |-- 코멘트 + 이미지 첨부 -------->| → review_comments INSERT
     |                                  |
     |-- 사이드바에서 피드백 확인 <-----|
     |-- 수정 작업 후 "완료" 클릭 ---->| → status: resolved
     |                                  |
     |<-- 실시간 상태 업데이트 --------|
```

### 피드백 상태

| 상태 | 색상 | 설명 |
|------|------|------|
| **미처리** | 주황 | 새로 등록된 피드백 |
| **진행중** | 파랑 | 담당자가 작업 중 |
| **완료** | 초록 | 수정 완료 |

---

## Supabase 설정

### 최초 1회: 테이블 생성

Supabase SQL Editor에서 실행:

```sql
-- review_comments 테이블
CREATE TABLE IF NOT EXISTS review_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  x_percent NUMERIC(5,2) NOT NULL,
  y_percent NUMERIC(5,2) NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),
  author_name TEXT NOT NULL DEFAULT 'Guest',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_rc_project ON review_comments(project_id);
CREATE INDEX idx_rc_page ON review_comments(page_url);
CREATE INDEX idx_rc_status ON review_comments(status);

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
```

### 이미지 첨부 사용 시: Storage Bucket 생성

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true);

CREATE POLICY "Anyone can read review images"
  ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
CREATE POLICY "Anyone can upload review images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-images');
CREATE POLICY "Anyone can delete review images"
  ON storage.objects FOR DELETE USING (bucket_id = 'review-images');
```

---

## WordPress 사이트에 적용

### 방법 1: footer.php에 직접 추가

```php
<!-- wp-content/themes/your-theme/footer.php 의 </body> 앞에 추가 -->
<script src="https://teraflow-net.github.io/tera-feedback-widget/dist/feedback-widget.iife.js"
  data-project="<?php echo sanitize_title(get_bloginfo('name')); ?>"
  data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co"
  data-supabase-key="YOUR_ANON_KEY">
</script>
```

### 방법 2: functions.php에서 enqueue

```php
// functions.php
add_action('wp_footer', function() {
  echo '<script src="https://teraflow-net.github.io/tera-feedback-widget/dist/feedback-widget.iife.js"
    data-project="my-site"
    data-supabase-url="https://xxx.supabase.co"
    data-supabase-key="YOUR_KEY"></script>';
});
```

### 방법 3: JS 파일을 테마에 직접 복사

```bash
cp dist/feedback-widget.iife.js /var/www/html/wp-content/themes/your-theme/
```

```php
<script src="<?php echo get_template_directory_uri(); ?>/feedback-widget.iife.js"
  data-project="my-site" ...></script>
```

---

## JavaScript API

위젯 로드 후 `window.TeraFeedback` 객체로 제어할 수 있습니다.

```javascript
window.TeraFeedback.open()    // 피드백 모드 ON
window.TeraFeedback.close()   // 피드백 모드 OFF
window.TeraFeedback.toggle()  // 토글
window.TeraFeedback.destroy() // 위젯 완전 제거
```

---

## 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
# → dist/feedback-widget.iife.js 생성
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| UI | Vanilla JS + Shadow DOM (프레임워크 의존 없음) |
| 스타일 | 인라인 CSS (Shadow DOM 내부, 호스트 사이트 영향 없음) |
| DB | Supabase (Realtime + Storage) |
| 빌드 | Vite IIFE 번들 (~57KB gzipped) |
| 언어 | TypeScript |
