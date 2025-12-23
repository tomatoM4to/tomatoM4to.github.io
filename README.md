# Blog Project

React와 Vite를 사용하여 구축된 블로그 프로젝트입니다. SSR(Server-Side Rendering)과 SSG(Static Site Generation)를 모두 지원하며, 마크다운 기반의 콘텐츠 관리를 제공합니다.

## 기술 스택 (Tech Stack)

- **Core**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Server**: Express (SSR 및 개발 서버용)
- **Routing**: React Router 7
- **Markdown**: react-markdown, remark-gfm, gray-matter
- **Utilities**: tsx (TypeScript 실행)
- **Analysis**: rollup-plugin-visualizer (번들 사이즈 분석)

## 시작하기 (Getting Started)

### 설치 (Installation)

프로젝트 의존성을 설치합니다.

```bash
npm install
```

### 개발 서버 실행 (Development)

SSR 환경에서 개발 서버를 실행합니다. 변경 사항을 실시간으로 감지합니다.

```bash
npm run dev
```

### 빌드 (Build)

프로젝트를 배포용으로 빌드합니다. 이 명령어는 SSG 빌드와 API 리소스 생성을 순차적으로 수행합니다.

```bash
npm run build
```

#### 세부 빌드 명령어

필요에 따라 개별 빌드 명령어를 사용할 수 있습니다.

- `npm run build:client`: 클라이언트 사이드 리소스 빌드 (`dist/`)
- `npm run build:server`: 서버 사이드 렌더링용 리소스 빌드 (`dist/server/`)
- `npm run build:ssr`: 클라이언트와 서버 리소스를 모두 빌드
- `npm run build:ssg`: SSR 빌드 후 정적 HTML 파일 생성 (Static Site Generation)
- `npm run build:api`: 콘텐츠 기반 API 리소스 생성

### 번들 분석 (Bundle Analysis)

`rollup-plugin-visualizer`를 사용하여 번들 사이즈를 분석할 수 있습니다.

1. `vite.config.ts` 파일의 `plugins` 배열에서 `visualizer()`가 주석 처리되어 있지 않은지 확인합니다.
2. 클라이언트 번들을 분석하기 위해 다음 명령어를 실행합니다.
   ```bash
   npm run build:client
   ```
3. 빌드가 완료되면 프로젝트 루트에 `stats.html` 파일이 생성됩니다. 이 파일을 브라우저에서 열어 번들 구성을 시각적으로 확인할 수 있습니다.

### 실행 (Run)

**SSR (Server-Side Rendering) 모드로 실행:**
프로덕션 환경에서 Node.js 서버를 통해 SSR로 실행합니다.

```bash
npm run start:ssr
```

**SSG (Static Site Generation) 모드로 실행:**
생성된 정적 파일(`dist/`)을 서빙합니다.

```bash
npm run start:ssg
```

## 프로젝트 구조 (Project Structure)

```
├── content/            # 블로그 포스트 마크다운 파일 (카테고리별 분류)
├── public/             # 정적 에셋 (이미지, 파비콘 등)
├── server/             # 서버 사이드 로직 및 빌드 스크립트
│   ├── server.ts       # Express 서버 진입점
│   ├── gen-static.ts   # SSG 생성 스크립트
│   └── ...
├── src/                # React 클라이언트 소스 코드
│   ├── components/     # UI 컴포넌트
│   ├── pages/          # 라우트 페이지 컴포넌트
│   ├── hooks/          # 커스텀 React 훅
│   ├── context/        # React Context
│   ├── styles/         # CSS 스타일 파일
│   ├── entry-client.tsx # 클라이언트 진입점
│   └── entry-server.tsx # 서버 렌더링 진입점
└── ...
```
