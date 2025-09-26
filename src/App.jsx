// src/App.jsx
import * as Sentry from "@sentry/react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

/* 소개 */
import AboutWhat from "./pages/about/WhatIs.jsx";
import AboutHistory from "./pages/about/History.jsx";
import AboutPeople from "./pages/about/People.jsx";
import AboutEstablishment from "./pages/about/Establishment.jsx";

/* 소식 */
import NewsStories from "./pages/news/Stories.jsx";
import NewsNotices from "./pages/news/Notices.jsx";
import NewsNewsletter from "./pages/news/Newsletter.jsx";
import StoryDetail from "./pages/news/StoryDetail.jsx"; // 파일명/경로 꼭 확인!
import NoticeDetail from "./pages/news/NoticeDetail.jsx";
import NewsIndex from "./pages/news/index.jsx";


/* 사업 */
import BizOverview from "./pages/business/Overview.jsx";
import BizRental from "./pages/business/Rental.jsx";
import BizApplyHelp from "./pages/business/ApplyHelp.jsx";
import BizDonation from "./pages/business/DonationCampaign.jsx";
import BizInsurance from "./pages/business/EWheelchairInsurance.jsx";
import BizSurvey from "./pages/business/NeedsSurvey.jsx";
import BizMemberSvc from "./pages/business/MemberServices.jsx";

/* 후원 */
import SupGuide from "./pages/support/Guide.jsx";
import SupCorporate from "./pages/support/Corporate.jsx";
import SupFAQ from "./pages/support/FAQ.jsx";
import Combination from "./pages/support/Combination.jsx";


/* 404 */
function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600">주소를 다시 확인해 주세요.</p>
    </div>
  );
}

/** Sentry init (safe for builds without __SENTRY_RELEASE__) */
if (import.meta.env.VITE_SENTRY_DSN) {
  const safeRelease =
    // injected by Sentry bundler plugin if present
    (typeof __SENTRY_RELEASE__ !== "undefined" ? __SENTRY_RELEASE__ : undefined) ||
    // or you can set VITE_SENTRY_RELEASE from Netlify envs
    import.meta.env.VITE_SENTRY_RELEASE;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENV,
    // only pass release when it exists
    ...(safeRelease ? { release: safeRelease } : {}),
    tracesSampleRate: 1.0,
  });
}

export default function App() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-white">
      <Navbar />
      <button
        onClick={() => {
          throw new Error("테스트용 Sentry 에러 발생!");
        }}
        style={{
          backgroundColor: "#ef4444",
          color: "white",
          padding: "8px 16px",
          margin: "10px",
          borderRadius: "4px",
        }}
      >
        Sentry Test Error
      </button>
      <ScrollToTop />
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
      <Footer />
    </div>
  );
}
