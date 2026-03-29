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

> **중요: 아래 코드는 반드시 한 줄로 붙여넣어야 합니다. 줄바꿈이나 공백이 들어가면 동작하지 않습니다.**

```html
<script src="https://teraflow-net.github.io/tera-feedback-widget/feedback-widget.iife.js" data-project="사이트이름" data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co" data-supabase-key="YOUR_SUPABASE_ANON_KEY" defer></script>
```

### 2. `data-project` 설정 (사이트별 필수)

**`data-project`에는 사이트를 구분할 수 있는 고유 이름을 넣습니다.**

| 사이트 주소 | `data-project` 값 | 설명 |
|------------|-------------------|------|
| `https://teraflow.net` | `teraflow-net` | 도메인 기반 |
| `https://evermarine.co.kr` | `evermarine` | 프로젝트명 |
| `https://client-a.com` | `client-a` | 고객사명 |

예시 — `https://teraflow.net` 사이트:

```html
<script src="https://teraflow-net.github.io/tera-feedback-widget/feedback-widget.iife.js" data-project="teraflow-net" data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co" data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpeHhsaHJvc3hiY3dkZW9mbWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTI1NDksImV4cCI6MjA5MDEyODU0OX0._XkejZIIt_6XtNMkIo9SjtsLw6ikq5TDTuQd0-YbjxQ" defer></script>
```

예시 — `https://evermarine.co.kr` 사이트:

```html
<script src="https://teraflow-net.github.io/tera-feedback-widget/feedback-widget.iife.js" data-project="evermarine" data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co" data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpeHhsaHJvc3hiY3dkZW9mbWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTI1NDksImV4cCI6MjA5MDEyODU0OX0._XkejZIIt_6XtNMkIo9SjtsLw6ikq5TDTuQd0-YbjxQ" defer></script>
```

### 3. 사용하기

1. 우하단의 **"피드백 남기기"** 버튼 클릭
2. 처음 사용 시 **이름 입력** (한 번만, 이후 자동 적용)
3. 피드백을 남기고 싶은 **위치를 클릭**
4. **코멘트 입력** + 이미지 첨부 (선택)
5. **Ctrl+Enter** 또는 등록 버튼으로 제출
6. 상단바 **"피드백 목록"** 에서 전체 피드백 확인

### 4. 끄기

script 태그를 제거하면 위젯이 완전히 사라집니다. 데이터는 Supabase에 그대로 남아있어 다시 켜면 복원됩니다.

---

## WordPress 사이트에 적용 (권장)

### Header Footer Code Manager 플러그인 사용 (권장)

functions.php를 수정하지 않아도 되고, 플러그인에서 ON/OFF 토글이 가능합니다.

1. **플러그인 설치**: wp-admin → 플러그인 → 새로 추가 → "Header Footer Code Manager" 검색 → 설치 → 활성화
2. **Snippet 추가**: wp-admin → HFCM → Add New Snippet
3. **설정**:
   - Snippet Type: **Script**
   - Site Display: **Site Wide**
   - Location: **Footer**
   - Status: **ON**
4. **코드 붙여넣기** (아래 코드를 **메모장에 먼저 붙여넣고** 한 줄인지 확인 후 복사):

```html
<script src="https://teraflow-net.github.io/tera-feedback-widget/feedback-widget.iife.js" data-project="내사이트이름" data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co" data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpeHhsaHJvc3hiY3dkZW9mbWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTI1NDksImV4cCI6MjA5MDEyODU0OX0._XkejZIIt_6XtNMkIo9SjtsLw6ikq5TDTuQd0-YbjxQ" defer></script>
```

> `내사이트이름` 부분을 사이트에 맞게 변경하세요. 예: `teraflow-net`, `evermarine`

### functions.php에 추가하는 경우

```php
add_action( 'wp_head', function () {
    echo '<script src="https://teraflow-net.github.io/tera-feedback-widget/feedback-widget.iife.js" data-project="내사이트이름" data-supabase-url="https://kixxlhrosxbcwdeofmgg.supabase.co" data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpeHhsaHJvc3hiY3dkZW9mbWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTI1NDksImV4cCI6MjA5MDEyODU0OX0._XkejZIIt_6XtNMkIo9SjtsLw6ikq5TDTuQd0-YbjxQ" defer></script>';
}, 999 );
```

> `<?php` 태그 안에 넣어야 합니다. HTML을 직접 넣으면 PHP syntax error가 발생합니다.

---

## 주의사항

### script 태그 붙여넣기

> **`data-supabase-key` 값에 줄바꿈이나 공백이 들어가면 위젯이 동작하지 않습니다.**

- 코드를 복사할 때 에디터나 플러그인이 자동 줄바꿈하는 경우가 있습니다
- **반드시 메모장(Notepad)에 먼저 붙여넣고** 한 줄인지 확인 후 사용하세요
- 줄바꿈이 들어가면: WebSocket 연결 실패, 이미지 업로드 실패, 코멘트 저장 실패

**정상:**
```
data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6...YbjxQ"
```

**비정상 (줄바꿈 포함):**
```
data-supabase-key="eyJhbGciOiJIUzI1NiIsInR5cCI6
  ...YbjxQ"
```

### Nginx/서버 캐시

- Nginx fastcgi 캐시가 활성화된 서버에서는 script 추가 후 캐시를 삭제해야 반영됩니다
- 또는 URL에 `?v=1` 등 query string을 붙여 캐시를 우회하여 확인할 수 있습니다

### 브라우저/시크릿 모드

- 이름은 localStorage에 저장되므로 시크릿 모드에서는 매번 다시 입력해야 합니다
- 피드백 데이터는 Supabase에 저장되므로 **모든 브라우저/기기에서 동일하게 보입니다**
- "피드백 남기기" 버튼을 눌러 피드백 모드에 진입해야 기존 핀들이 표시됩니다

### data-project 이름 규칙

- 영문 소문자, 숫자, 하이픈(`-`)만 사용하세요
- 공백이나 특수문자는 피하세요
- 사이트별로 **반드시 다른 값**을 사용해야 피드백이 분리됩니다

---

## 설정 옵션

| 속성 | 필수 | 설명 | 예시 |
|------|------|------|------|
| `data-project` | O | 프로젝트 식별자 (사이트마다 다르게) | `teraflow-net`, `evermarine` |
| `data-supabase-url` | O | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `data-supabase-key` | O | Supabase Anon Key (한 줄, 공백 없이) | `eyJ...` |

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

## Supabase 설정 (최초 1회)

### 테이블 생성

Supabase SQL Editor에서 실행:

```sql
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

CREATE INDEX idx_rc_project ON review_comments(project_id);
CREATE INDEX idx_rc_page ON review_comments(page_url);
CREATE INDEX idx_rc_status ON review_comments(status);

ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON review_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments"
  ON review_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comments"
  ON review_comments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comments"
  ON review_comments FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE review_comments;
```

### 이미지 첨부용 Storage Bucket

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
npm install     # 설치
npm run dev     # 개발 서버
npm run build   # 빌드 → dist/feedback-widget.iife.js
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
