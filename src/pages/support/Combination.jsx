import { useEffect } from 'react';

export default function Combination() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={styles.page}>
      {/* Hero (very simple) */}
      <section style={styles.hero}>
          <nav style={styles.breadcrumb}>
            <span>사업</span>
            <span style={styles.breadcrumbSep}> &gt; </span>
            <span>조합 가입</span>
          </nav>
        <h1 style={styles.heroTitle}>조합 가입</h1>
        <p style={styles.lead}>
          복지디자인의 미션에 공감하신다면 지금 함께해요. 지역과 현장을 잇는 맞춤형 복지에
          조합원으로 참여할 수 있습니다.
        </p>
      </section>

      {/* 문의 */}
      <section>
        <h2 style={styles.sectionTitle}>문의</h2>
        <div style={styles.box}>
          <div>전화: 042-934-6338</div>
          <div>팩스: 042-934-1858</div>
          <div>이메일: songkangbokji@songkang.or.kr</div>
          <div>주소: 대전광역시 유성구 봉산로 45</div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: { maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' },

  hero: { marginTop: 24, marginBottom: 24 },
  heroTitle: { fontSize: 36, fontWeight: 800, margin: '8px 0 16px', textAlign: 'left' },
  title: { fontSize: 36, fontWeight: 800, margin: '0 0 10px' },
  lead: { color: '#4b5563', margin: '0 0 18px', textAlign: 'left', lineHeight: 1.8, maxWidth: 760 },

  breadcrumb: { color: '#9CA3AF', fontSize: 12, marginBottom: 10 },
  breadcrumbSep: { color: '#9CA3AF', margin: '0 6px' },

  btnRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4, marginBottom: 20 },
  primaryBtn: {
    padding: '12px 16px',
    background: '#ED6A32',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 700,
  },
  secondaryBtn: {
    padding: '12px 16px',
    background: '#F4B731',
    color: '#111827',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 700,
  },

  sectionTitle: { fontSize: 20, fontWeight: 800, margin: '28px 0 12px' },
  box: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  list: { margin: 0, paddingLeft: 18, lineHeight: 1.8 },
  small: { color: '#6b7280', fontSize: 13, marginTop: 8 },
};
