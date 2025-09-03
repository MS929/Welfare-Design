// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

/* 소개 */
import AboutWhat from "./pages/about/WhatIs";
import AboutHistory from "./pages/about/History";
import AboutPeople from "./pages/about/People";
import AboutEstablishment from "./pages/about/Establishment";

/* 소식 */
import NewsStories from "./pages/news/Stories";
import NewsNotices from "./pages/news/Notices";
import NewsNewsletter from "./pages/news/Newsletter";
import StoryDetail from "./pages/news/StoryDetail"; // 파일명/경로 꼭 확인!
import NoticeDetail from "./pages/news/NoticeDetail";


/* 사업 */
import BizOverview from "./pages/business/Overview";
import BizRental from "./pages/business/Rental";
import BizApplyHelp from "./pages/business/ApplyHelp";
import BizDonation from "./pages/business/DonationCampaign";
import BizInsurance from "./pages/business/EWheelchairInsurance";
import BizSurvey from "./pages/business/NeedsSurvey";
import BizMemberSvc from "./pages/business/MemberServices";

/* 후원 */
import SupGuide from "./pages/support/Guide";
import SupCorporate from "./pages/support/Corporate";
import SupFAQ from "./pages/support/FAQ";

/* 404 */
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
          <Route path="/about/what" element={<AboutWhat />} />
          <Route path="/about/history" element={<AboutHistory />} />
          <Route path="/about/people" element={<AboutPeople />} />
          <Route path="/about/establishment" element={<AboutEstablishment />} />

          {/* 소식 */}
          <Route path="/news/stories" element={<NewsStories />} />
          <Route path="/news/stories/:slug" element={<StoryDetail />} />
          <Route path="/news/notices" element={<NewsNotices />} />
          <Route path="/news/notices/:slug" element={<NoticeDetail />} />
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
