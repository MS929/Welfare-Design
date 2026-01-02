/****
 * NotFound.jsx
 * -----------------------------------------------------------------------------
 * [페이지 목적]
 *  - 존재하지 않는 경로로 접근했을 때 보여주는 404(페이지 없음) 화면
 *  - 사용자에게 "페이지를 찾을 수 없음" 상태를 명확히 안내
 *
 * [구성]
 *  - 404 큰 숫자 표시
 *  - 간단한 안내 문구 표시
 *
 * [레이아웃]
 *  - 화면 전체 높이(h-screen)에서 가운데 정렬하여 메시지 가독성 확보
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* 화면 전체를 중앙 정렬하여 404 안내를 명확히 표시 */}
      {/* 상태 코드(404) 표시 */}
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      {/* 사용자 안내 문구 */}
      <p className="text-lg text-gray-600">페이지를 찾을 수 없습니다.</p>
    </div>
  );
}
