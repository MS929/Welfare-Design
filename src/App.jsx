// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// 소개
import AboutWhat from "./pages/about/WhatIs";
import AboutHistory from "./pages/about/History";
import AboutPeople from "./pages/about/People";
import AboutEstablishment from "./pages/about/Establishment";

// 소식
import NewsStories from "./pages/news/Stories";
import NewsNotices from "./pages/news/Notices";
import NewsNewsletter from "./pages/news/Newsletter";
import StoryDetail from "./pages/news/StoryDetail"; // ✅ 파일명 정확히!

// 사업
import BizOverview from "./pages/business/Overview"; // 0. 사업영역
import BizRental from "./pages/business/Rental"; // 1. 휠체어 및 복지용구 무료 대여
import BizApplyHelp from "./pages/business/ApplyHelp"; // 2. 보조기기·복지용구 신청 안내 지원
import BizDonation from "./pages/business/DonationCampaign"; // 3. 보조기기 기증 캠페인
import BizInsurance from "./pages/business/EWheelchairInsurance"; // 4. 취약계층 전동 휠체어 보험금 지원
import BizSurvey from "./pages/business/NeedsSurvey"; // 5. 취약계층 복지욕구 실태조사
import BizMemberSvc from "./pages/business/MemberServices"; // 6. 조합원 지원 서비스

// 후원
import SupGuide from "./pages/support/Guide";
import SupCorporate from "./pages/support/Corporate";
import SupFAQ from "./pages/support/FAQ";

// 404
function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600">주소를 다시 확인해 주세요.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* 메인 */}
          <Route path="/" element={<Home />} />
          {/* 소개 */}
          <Route path="/about/establishment" element={<AboutEstablishment />} />
          <Route path="/about/what" element={<AboutWhat />} />
          <Route path="/about/history" element={<AboutHistory />} />
          <Route path="/about/people" element={<AboutPeople />} />
          {/* 소식 */}
          <Route path="/news/stories" element={<NewsStories />} />
          <Route path="/news/stories/:slug" element={<StoryDetail />} />{" "}
          {/* ✅ 상세 */}
          <Route path="/news/notices" element={<NewsNotices />} />
          <Route path="/news/newsletter" element={<NewsNewsletter />} />
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
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
