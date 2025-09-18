import { useEffect } from 'react';

export default function Combination() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={styles.page}>
      {/* 문의 */}
      <section style={styles.contactSection}>
        <h2 style={styles.contactTitle}>문의</h2>
        <div style={styles.contactBox}>
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

  contactSection: {
    background: '#f9fafb',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  contactTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    color: '#111827',
  },
  contactBox: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 1.8,
    display: 'inline-block',
    textAlign: 'left',
  },
};
