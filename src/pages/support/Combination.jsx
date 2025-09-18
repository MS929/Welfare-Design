import { useEffect } from 'react';

export default function Combination() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={styles.page}>
      {/* Hero (very simple) */}
      <header>
        <h1 style={styles.title}>조합 가입</h1>
        <p style={styles.lead}>
          복지디자인의 미션에 공감하신다면 지금 함께해요. 지역과 현장을 잇는 맞춤형 복지에
          조합원으로 참여할 수 있습니다.
        </p>
        <div style={styles.btnRow}>
          <a href="https://forms.gle/your-form" target="_blank" rel="noreferrer" style={styles.primaryBtn}>
            온라인 신청하기
          </a>
          <a href="/uploads/join_application.pdf" style={styles.secondaryBtn} download>
            신청서 다운로드
          </a>
          <a href="mailto:songkangbokji@songkang.or.kr" style={styles.secondaryBtn}>
            이메일 문의
          </a>
        </div>
      </header>

      {/* 자격 */}
      <section>
        <h2 style={styles.sectionTitle}>가입 자격</h2>
        <div style={styles.box}>
          <ul style={styles.list}>
            <li>조합의 목적과 규약에 동의하시는 분</li>
            <li>복지 실천·연구·연대 활동에 관심이 있는 개인/단체</li>
            <li>지역 사회 문제 해결과 상호협력에 참여하고자 하는 분</li>
          </ul>
        </div>
      </section>

      {/* 절차 */}
      <section>
        <h2 style={styles.sectionTitle}>절차</h2>
        <div style={styles.box}>
          <ol style={styles.list}>
            <li>조합 소개와 규약 확인</li>
            <li>온라인 신청 또는 신청서 작성</li>
            <li>필요 서류 제출(이메일)</li>
            <li>심사 및 승인 안내</li>
            <li>가입비·회비 납부로 최종 확정</li>
          </ol>
          <p style={styles.small}>보통 영업일 기준 3~7일 내 처리됩니다.</p>
        </div>
      </section>

      {/* 회비 */}
      <section>
        <h2 style={styles.sectionTitle}>회비 안내</h2>
        <div style={styles.box}>
          <ul style={styles.list}>
            <li><b>가입비(1회)</b>: ₩ 10,000</li>
            <li><b>월 회비</b>: ₩ 5,000 (자동이체/계좌이체 가능)</li>
          </ul>
        </div>
      </section>

      {/* 서류 */}
      <section>
        <h2 style={styles.sectionTitle}>필요 서류</h2>
        <div style={styles.box}>
          <ul style={styles.list}>
            <li>가입 신청서</li>
            <li>신분증 사본(개인) / 사업자등록증(단체)</li>
            <li>기타 조합이 요청하는 서류</li>
          </ul>
          <div style={styles.btnRow}>
            <a href="/uploads/join_application.pdf" style={styles.primaryBtn} download>
              신청서 다운로드
            </a>
            <a href="https://forms.gle/your-form" target="_blank" rel="noreferrer" style={styles.secondaryBtn}>
              온라인 신청하기
            </a>
          </div>
        </div>
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

  title: { fontSize: 36, fontWeight: 800, margin: '0 0 10px' },
  lead: { color: '#4b5563', margin: '0 0 20px' },

  btnRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 },
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
