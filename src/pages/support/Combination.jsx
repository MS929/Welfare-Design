import { useEffect } from 'react';

export default function Combination() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={styles.page}>
      {/* 조합 가입 */}
      <section style={styles.joinSection}>
        <h1 style={styles.title}>조합 가입</h1>
        <p style={styles.lead}>
          조합에 가입하시면 다양한 혜택과 함께 활동에 참여하실 수 있습니다.
          온라인으로 신청하거나 신청서를 다운로드하여 작성 후 제출해주세요.
        </p>
      </section>

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

  joinSection: {
    marginBottom: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
    color: '#111827',
  },
  lead: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 1.6,
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
    transition: 'background-color 0.3s ease',
  },
  secondaryBtn: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '12px 24px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },

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
