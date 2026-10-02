# 다낭·호이안 36박 37일 여행 플래너

2026-11-16 ~ 2026-12-22 여행을 관리하는 정적 웹앱입니다.

## 주요 기능

- 항공편·숙소 일정은 고정(LOCKED)
- 나머지 날짜는 A/B/C 일정으로 자유 편집
- 선택 일정 변경 및 데스크톱 드래그 이동
- 호이안/다낭 장소 보관함 + Google Maps 검색 링크
- 식당·투어·마사지 등 추가 예약 관리
- VND 예산/지출 기록 + KRW 자동 환산
- 날짜별 아기 루틴 체크
- Open-Meteo 16일 예보 조회
- 준비물 체크리스트
- JSON 데이터 백업/복원
- PWA/오프라인 앱 셸 캐시
- 모바일 UI 지원

## GitHub Pages에 올리는 가장 간단한 방법

1. GitHub에서 새 저장소를 만듭니다. 예: `danang-hoian-trip`
2. 이 폴더의 파일을 저장소 **루트**에 그대로 올립니다.
3. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
4. **Build and deployment → Source**에서 `Deploy from a branch`를 선택합니다.
5. Branch를 `main`, 폴더를 `/(root)`로 선택하고 Save 합니다.
6. 배포가 끝나면 보통 다음 형식으로 접속합니다.

   `https://<GitHub아이디>.github.io/danang-hoian-trip/`

이 앱은 별도 빌드 과정이 없는 HTML/CSS/JavaScript 정적 사이트이므로 위 방식으로 배포할 수 있습니다.

## 데이터 저장에 대한 중요한 점

사용자가 입력하는 일정, 지출, 예약, 체크리스트는 브라우저 `localStorage`에 저장됩니다.

따라서:
- GitHub에 코드가 있어도 여행 데이터가 GitHub에 자동 저장되는 것은 아닙니다.
- PC와 휴대폰의 데이터는 자동 동기화되지 않습니다.
- **준비 → 데이터 → JSON 백업/복원**을 이용하면 기기 간 데이터를 옮길 수 있습니다.
- 브라우저 데이터를 삭제하면 여행 데이터도 지워질 수 있으므로 주기적으로 백업하세요.

## 날씨

날씨 버튼은 Open-Meteo Forecast API를 사용합니다. API 키는 필요하지 않습니다.
예보는 최대 16일 범위이므로, 여행 날짜가 아직 멀면 정상적으로 조회해도 일정에 날씨가 표시되지 않습니다.

## 파일 구조

```text
.
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── sw.js
├── .nojekyll
└── README.md
```

## 로컬에서 테스트

보안 정책 때문에 서비스 워커는 `file://`로 직접 열 때보다 HTTP 서버에서 테스트하는 것이 좋습니다.

Python이 있다면:

```bash
python3 -m http.server 8000
```

그 뒤 브라우저에서:

```text
http://localhost:8000
```

로 접속하세요.

## 수정 포인트

고정 항공/숙소 데이터는 `app.js`의 `TRIP` 객체에 있습니다.
기본 A/B/C 일정은 `DEFAULT_DAY_PLANS`, 기본 장소는 `DEFAULT_PLACES`에서 수정할 수 있습니다.
