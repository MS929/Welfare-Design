/**
 * App.jsx
 * - 애플리케이션의 최상위 컴포넌트
 * - 전체 라우팅 구조(Routes)와 공통 레이아웃(Navbar/Footer)을 정의
 * - 페이지 단위 컴포넌트들을 URL 경로별로 연결하는 역할
 */


// =============================
// 라우팅 관련 의존성
// =============================
import { Routes, Route } from "react-router-dom";

// 페이지 전환 시 스크롤을 최상단으로 이동시키는 유틸 컴포넌트
import ScrollToTop from "./components/ScrollToTop";

// =============================
// 공통 레이아웃 컴포넌트 (모든 페이지에 공통 적용)
// =============================
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// 메인(Home) 페이지
import Home from "./pages/Home.jsx";

/* 소개 */
// 단체 소개 관련 정적 페이지들
import AboutWhat from "./pages/about/WhatIs.jsx";
import AboutHistory from "./pages/about/History.jsx";
import AboutPeople from "./pages/about/People.jsx";
import AboutEstablishment from "./pages/about/Establishment.jsx";

/* 소식 */
// 공지, 스토리, 뉴스레터 등 소식 관련 페이지
import NewsStories from "./pages/news/Stories.jsx";
import NewsNotices from "./pages/news/Notices.jsx";
import NewsNewsletter from "./pages/news/Newsletter.jsx";
import StoryDetail from "./pages/news/StoryDetail.jsx"; // 파일명/경로 꼭 확인!
import NoticeDetail from "./pages/news/NoticeDetail.jsx";
import NewsIndex from "./pages/news/index.jsx";

/* 사업 */
// 복지디자인에서 운영하는 주요 사업 페이지
import BizOverview from "./pages/business/Overview.jsx";
import BizRental from "./pages/business/Rental.jsx";
import BizApplyHelp from "./pages/business/ApplyHelp.jsx";
import BizDonation from "./pages/business/DonationCampaign.jsx";
import BizInsurance from "./pages/business/EWheelchairInsurance.jsx";
import BizSurvey from "./pages/business/NeedsSurvey.jsx";
import BizMemberSvc from "./pages/business/MemberServices.jsx";

/* 후원 */
// 후원 및 참여 안내 페이지
import SupGuide from "./pages/support/Guide.jsx";
import SupCorporate from "./pages/support/Corporate.jsx";
import SupFAQ from "./pages/support/FAQ.jsx";
import Combination from "./pages/support/Combination.jsx";


/**
 * NotFound (404)
 * -----------------------------------------------------------------------------
 * [역할]
 *  - 정의되지 않은 경로로 접근했을 때 표시되는 404 안내 컴포넌트
 *
 * [구성]
 *  - 상태 제목(h1) + 간단한 안내 문구(p)로 구성
 *
 * [사용 위치]
 *  - App.jsx 라우팅 하단의 와일드카드(*) 경로에서 사용
 */
// 존재하지 않는 경로 접근 시 표시되는 404 페이지
function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      {/* 404 안내 메시지를 화면 중앙에 정렬하는 컨테이너 */}
      {/* 상태 코드/메시지 제목 */}
      <h1 className="text-3xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
      {/* 사용자가 주소를 확인하도록 안내하는 문구 */}
      <p className="text-gray-600">주소를 다시 확인해 주세요.</p>
    </div>
  );
}


// 전체 페이지 레이아웃과 라우팅을 감싸는 루트 컴포넌트
export default function App() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-white">
      {/* 상단 네비게이션 바 */}
      <Navbar />
      {/* 라우트 변경 시 스크롤 위치 초기화 */}
      <ScrollToTop />
      {/* 실제 페이지 콘텐츠가 렌더링되는 영역 */}
      <main className="flex-1">
        <Routes>
          {/* 메인 */}
          <Route path="/" element={<Home />} />

          {/* 소개 */}
          <Route path="/about/what" element={<AboutWhat />} />
          <Route path="/about/history" element={<AboutHistory />} />
          <Route path="/about/people" element={<AboutPeople />} />
          <Route path="/about/establishment" element={<AboutEstablishment />} />

          {/* 소식 (중첩 라우팅으로 정리) */}
          {/* /news 하위 경로를 중첩 라우팅으로 관리 */}
          <Route path="/news">
            {/* /news 또는 /news/ 를 모두 매칭 */}
            <Route index element={<NewsIndex />} />
            <Route path="stories" element={<NewsStories />} />
            <Route path="stories/:slug" element={<StoryDetail />} />
            <Route path="notices" element={<NewsNotices />} />
            <Route path="notices/:slug" element={<NoticeDetail />} />
            <Route path="newsletter" element={<NewsNewsletter />} />
          </Route>
          {/* /news/* 도 안전망으로 처리 (직접 접근 케이스) */}
          {/* 잘못된 news 하위 경로 접근 시 기본 뉴스 페이지로 유도 */}
          <Route path="/news/*" element={<NewsIndex />} />


          {/* 사업 */}
          <Route path="/business/overview" element={<BizOverview />} />
          <Route path="/business/rental" element={<BizRental />} />
          <Route path="/business/apply-help" element={<BizApplyHelp />} />
          <Route path="/business/donation" element={<BizDonation />} />
          <Route path="/business/ewc-insurance" element={<BizInsurance />} />
          <Route path="/business/needs-survey" element={<BizSurvey />} />
          <Route path="/business/member-services" element={<BizMemberSvc />} />

          {/* 후원 */}
          <Route path="/support/guide" element={<SupGuide />} />
          <Route path="/support/corporate" element={<SupCorporate />} />
          <Route path="/support/faq" element={<SupFAQ />} />
          <Route path="/support/combination" element={<Combination />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* 하단 푸터 영역 */}
      <Footer />
    </div>
  );
}
