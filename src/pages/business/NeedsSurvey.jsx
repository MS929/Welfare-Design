// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 취약계층(고령자·장애인 등)의 복지 욕구를 파악하기 위한 실태조사 안내 페이지
//
// [구성]
//  - 좌측: 대표 이미지(조사 안내 포스터)
//  - 우측: 조사 방식 요약 → 기대 효과 → 전화 문의 배너
//
// [이미지 최적화]
//  - 모바일: Cloudinary fetch로 AVIF/WEBP + srcset 제공(용량 절감)
//  - 태블릿/데스크탑: 로컬 정적 PNG 사용(화질/캐시 안정성)
//
// [레이아웃 포인트]
//  - 이미지/텍스트 높이 맞춤을 CSS Grid로 처리하여 불필요한 JS 동기화 제거
//  - 문의 배너는 md 기준으로 PC/모바일을 분리 렌더링해 줄바꿈/깨짐 방지
//
// [텍스트 깨짐 방지]
//  - 페이지 전용 style 주입으로 모바일 텍스트 확대/줄바꿈 이슈를 최소화
// -----------------------------------------------------------------------------
import BizLayout from "./_Layout";

export default function NeedsSurvey() {
  return (
    <>
      {/* 모바일/브라우저별 자동 텍스트 확대 등으로 생기는 레이아웃 흔들림을 방지하는 가드 CSS */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
/* 텍스트 크기 자동 보정 비활성화(모바일 확대/축소로 인한 레이아웃 흔들림 방지) */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* 전체 요소 박스 모델 통일 + 예상치 못한 줄바꿈/하이픈 처리 안정화 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }

/* 본문 타이포/줄바꿈 정책: 한글 단어 단위 유지 + 긴 문자열은 안전하게 줄바꿈 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈을 보기 좋게(지원 브라우저) */
h1, h2, .heading-balance { text-wrap: balance; }

/* text-wrap 미지원 브라우저용 폴백: 과도한 줄바꿈/행간 붕괴 방지 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

/* 하이라이트(마커) 영역이 줄바꿈될 때 모양이 깨지지 않게 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 유틸리티 클래스: 필요한 구간에서만 줄바꿈/말줄임 제어 */
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        `,
        }}
      />
      {/* BizLayout: 사업 페이지 공통 레이아웃(브레드크럼/제목) */}
      <BizLayout title="보조기기 기증 및 수리 ">
        <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
          {/* 이미지 + 우측 정보 박스(조사 안내) + 기대 효과(안내 박스 아래) */}
          <div className="flex justify-center">
            {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
            <div className="w-full max-w-[1050px] mx-auto">
              <img
                src="/images/business/donation.png?v=2"
                alt="보조기기 기증 및 수리"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1400"
                height="1000"
                className="w-full h-auto object-contain rounded-2xl"
                style={{
                  imageRendering: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </BizLayout>
    </>
  );
}
