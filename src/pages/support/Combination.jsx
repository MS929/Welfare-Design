import { useEffect } from 'react';

export default function Combination() {
  useEffect(() => {
    // 항상 상단에서 시작
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main style={styles.page}>
      {/* Header */}
      <section style={styles.headerWrap}>
        <div style={styles.header}> 
          <h1 style={styles.title}>조합 가입</h1>
          <p style={styles.subtitle}>복지디자인의 미션에 공감하신다면 지금 함께하세요. 조합원으로서 지역과 현장을 잇는 맞춤형 복지에 참여하실 수 있습니다.</p>
          <div style={styles.quickLinks}>
            <a href="#eligibility" style={styles.quickChip}>가입 자격</a>
            <a href="#steps" style={styles.quickChip}>절차</a>
            <a href="#dues" style={styles.quickChip}>회비 안내</a>
            <a href="#docs" style={styles.quickChip}>필요 서류</a>
            <a href="#faq" style={styles.quickChip}>FAQ</a>
          </div>
        </div>
        <div style={styles.headerArt}>
          {/* 아이콘/일러스트는 자유롭게 교체하세요 */}
          <img src="/images/icons/handshake.png" alt="조합 가입" style={styles.heroImg} />
        </div>
      </section>

      {/* Steps */}
      <section id="steps" style={styles.section}> 
        <h2 style={styles.h2}>가입 절차</h2>
        <ol style={styles.steps}> 
          {[
            { t: '조합 소개 확인', d: '조합의 미션·가치·규약을 확인합니다.' },
            { t: '온라인 신청', d: '간단한 정보 입력 후 가입 의사를 제출합니다.' },
            { t: '서류 제출', d: '신분증 사본 등 필수 서류를 이메일로 보내주세요.' },
            { t: '심사 및 승인', d: '이사회 검토 후 승인 안내를 드립니다.' },
            { t: '회비 납부', d: '초기 가입비 및 월 회비 납부 시 최종 확정됩니다.' },
          ].map((s, i) => (
            <li key={i} style={styles.stepItem}>
              <span style={styles.stepBadge}>{i + 1}</span>
              <div>
                <div style={styles.stepTitle}>{s.t}</div>
                <div style={styles.stepDesc}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Eligibility */}
      <section id="eligibility" style={styles.section}> 
        <h2 style={styles.h2}>가입 자격</h2>
        <ul style={styles.list}> 
          <li>조합의 목적과 규약에 동의하시는 분</li>
          <li>복지 실천·연구·연대 활동에 관심이 있는 개인/단체</li>
          <li>지역 사회 문제 해결과 상호협력에 참여하고자 하는 분</li>
        </ul>
      </section>

      {/* Dues */}
      <section id="dues" style={styles.section}> 
        <h2 style={styles.h2}>회비 안내</h2>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>구분</th>
                <th style={styles.th}>금액</th>
                <th style={styles.th}>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>가입비(1회)</td>
                <td style={styles.td}>₩ 10,000</td>
                <td style={styles.td}>승인 시 1회 납부</td>
              </tr>
              <tr>
                <td style={styles.td}>월 회비</td>
                <td style={styles.td}>₩ 5,000</td>
                <td style={styles.td}>자동이체/계좌이체 가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents */}
      <section id="docs" style={styles.section}> 
        <h2 style={styles.h2}>필요 서류</h2>
        <ul style={styles.list}> 
          <li>가입 신청서 (아래 양식 다운로드)</li>
          <li>신분증 사본(개인) / 사업자등록증(단체)</li>
          <li>기타 조합이 요청하는 서류</li>
        </ul>
        <div style={styles.buttonsRow}>
          <a href="/uploads/join_application.pdf" style={styles.primaryBtn} download>가입 신청서 다운로드</a>
          <a href="https://forms.gle/your-form" target="_blank" rel="noreferrer" style={styles.secondaryBtn}>온라인 신청하기</a>
          <a href="mailto:songkangbokji@songkang.or.kr" style={styles.secondaryBtn}>이메일로 문의</a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={styles.section}> 
        <h2 style={styles.h2}>자주 묻는 질문</h2>
        <div style={styles.faq}>
          <details style={styles.details}> 
            <summary style={styles.summary}>온라인 신청 후 처리 기간은 얼마나 걸리나요?</summary>
            <p style={styles.answer}>보통 영업일 기준 3~7일 내 심사·승인 안내를 드립니다. 상황에 따라 변동될 수 있습니다.</p>
          </details>
          <details style={styles.details}> 
            <summary style={styles.summary}>회비 납부 방법은?</summary>
            <p style={styles.answer}>자동이체 또는 계좌이체로 납부하실 수 있으며, 승인 안내 시 구체적인 정보를 함께 드립니다.</p>
          </details>
          <details style={styles.details}> 
            <summary style={styles.summary}>단체 명의로도 가입 가능한가요?</summary>
            <p style={styles.answer}>가능합니다. 사업자등록증 등 단체 확인 서류를 함께 제출해 주세요.</p>
          </details>
        </div>
      </section>

      {/* Contact */}
      <section style={styles.section}> 
        <h2 style={styles.h2}>문의</h2>
        <div style={styles.contactCard}>
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
  page: { paddingBottom: 48 },
  headerWrap: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'center', maxWidth: 1200, margin: '0 auto', padding: '40px 20px 8px' },
  header: { },
  headerArt: { display: 'flex', justifyContent: 'center' },
  heroImg: { width: '100%', maxWidth: 380, height: 'auto', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,.08)' },
  title: { fontSize: 40, lineHeight: 1.2, fontWeight: 800, margin: '0 0 8px' },
  subtitle: { fontSize: 16, color: '#556', margin: '0 0 16px' },
  quickLinks: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  quickChip: { padding: '8px 12px', background: '#F5F7F8', borderRadius: 999, fontSize: 14, color: '#333', textDecoration: 'none', border: '1px solid #ECEFF1' },

  section: { maxWidth: 1200, margin: '0 auto', padding: '32px 20px' },
  h2: { fontSize: 24, fontWeight: 800, margin: '0 0 16px' },

  steps: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  stepItem: { display: 'flex', gap: 12, padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #eef1f3', boxShadow: '0 6px 16px rgba(0,0,0,.04)' },
  stepBadge: { width: 30, height: 30, borderRadius: 999, background: '#3BA7A0', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 },
  stepTitle: { fontWeight: 700, marginBottom: 4 },
  stepDesc: { color: '#5b6472', fontSize: 14 },

  list: { margin: 0, paddingLeft: 18, color: '#2f3640' },

  tableWrap: { overflowX: 'auto', borderRadius: 12, border: '1px solid #eef1f3', boxShadow: '0 6px 16px rgba(0,0,0,.04)' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  th: { textAlign: 'left', padding: '12px 14px', background: '#F8FAFB', borderBottom: '1px solid #eef1f3', fontWeight: 700 },
  td: { padding: '12px 14px', borderBottom: '1px solid #f0f2f5' },

  buttonsRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 },
  primaryBtn: { padding: '12px 16px', background: '#ED6A32', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },
  secondaryBtn: { padding: '12px 16px', background: '#F4B731', color: '#222', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },

  faq: { display: 'grid', gap: 10 },
  details: { background: '#fff', border: '1px solid #eef1f3', borderRadius: 12, padding: '10px 14px', boxShadow: '0 6px 16px rgba(0,0,0,.04)' },
  summary: { cursor: 'pointer', fontWeight: 700 },
  answer: { color: '#5b6472', marginTop: 8 },

  contactCard: { background: '#fff', border: '1px solid #eef1f3', borderRadius: 12, padding: 16, boxShadow: '0 6px 16px rgba(0,0,0,.04)', lineHeight: 1.9 },
};
