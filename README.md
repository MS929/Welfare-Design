# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# 복지디자인 홈페이지

복지디자인 홈페이지는 지역사회의 복지 활동과 지원사업을 알리고,
회원·후원자·이용자 간의 소통을 돕기 위해 제작된 웹사이트입니다.
CMS를 통해 관리자가 직접 콘텐츠를 등록/수정할 수 있으며,
Netlify·Cloudinary·Sentry 기반으로 운영 안정성과 편의성을 강화했습니다.

- **Production URL**: https://welfaredesign.netlify.app  

---

## 주요 기술 스택
- **프론트엔드**: React + Vite
- **배포**: Netlify (main 브랜치 푸시 시 자동 배포)
- **콘텐츠 관리**: Netlify CMS (직접 글 등록/수정 가능)
- **이미지 관리**: Cloudinary (저장/최적화/배포)
- **에러 모니터링**: Sentry (프론트엔드 오류 자동 수집)

---

## 기능 요약
### CMS 관리
- 컬렉션: 복지디자인 이야기, 공지사항, FAQ
- 글 등록 시 제목/작성일/본문/대표이미지 입력 → 저장/발행 시 홈페이지 자동 반영

### 이미지 관리 (Cloudinary)
- Cloudinary 미디어 라이브러리에 업로드
- CMS에서 바로 선택 가능
- **무료 요금제 기준(2025)**  
  - 저장공간: 25GB  
  - 월 대역폭: 25GB (방문자가 이미지 조회/새로고침할 때마다 소모)  
  - 트랜스포메이션: 25,000/월

### 배포 (Netlify)
- main 브랜치와 연동
- 커밋/푸시 후 자동 빌드 및 배포
- 배포 상태/로그는 Netlify 대시보드에서 확인

### 에러 모니터링 (Sentry)
- 프론트엔드 오류 자동 수집
- Netlify 환경변수로 DSN/프로젝트 정보 관리

---

## 개발 방법
```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

## 레포 구조 (발췌)
```
src/
  components/   # UI 컴포넌트
  pages/        # 페이지 단위 컴포넌트
public/
  images/       # 정적 이미지
README.md       # 프로젝트 설명
```

---