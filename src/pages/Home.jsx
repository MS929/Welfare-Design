// src/pages/Home.jsx
import Slider from "../components/Slider";
import ShortcutButtons from "../components/ShortcutButtons";
import NewsSection from "../components/NewsSection";

export default function Home() {
  return (
    <>
      <Slider />
      <ShortcutButtons />
      <NewsSection />
    </>
  );
}
