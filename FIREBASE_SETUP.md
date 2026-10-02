# Firebase 연결 가이드

이 프로젝트는 **Firebase Authentication(Google 로그인) + Cloud Firestore**를 사용해
같은 Google 계정으로 로그인한 Mac/iPhone/PC 사이에서 여행 데이터를 자동 동기화할 수 있습니다.

## 동작 방식

- 로그인하지 않으면 기존처럼 브라우저 `localStorage`에 저장됩니다.
- Google 로그인 후에는 다음 문서에 여행 데이터가 저장됩니다.

```text
users/{Firebase Auth UID}/tripData/current
```

- Firestore 실시간 리스너를 사용해 다른 기기의 수정사항을 받아옵니다.
- 로컬과 클라우드가 모두 있을 때는 `updatedAtClient`가 더 최신인 데이터를 사용합니다.
- Firebase가 일시적으로 실패해도 로컬 저장 기능은 계속 동작합니다.
- JSON 백업/복원 기능도 그대로 유지됩니다.

---

## 1. Firebase 프로젝트 만들기

1. Firebase Console에 접속합니다.
2. **Create a project / 프로젝트 추가**를 선택합니다.
3. 예: `danang-hoian-trip` 프로젝트를 만듭니다.
4. Analytics는 이 여행 플래너에는 필수가 아닙니다.

## 2. Web App 등록

Firebase 프로젝트 홈에서 Web 아이콘 `</>`을 선택합니다.

앱 이름 예:

```text
danang-hoian-trip-web
```

Firebase Hosting은 사용하지 않아도 됩니다. 이 프로젝트는 GitHub Pages에서 배포합니다.

등록 후 다음과 비슷한 설정값이 표시됩니다.

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};
```

프로젝트의 `firebase-config.js`를 열어서:

```js
export const firebaseConfig = null;
```

부분을 받은 설정값으로 교체합니다.

예:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};
```

Firebase Web config 값은 클라이언트 앱에 포함되는 프로젝트 식별값입니다.
실제 Firestore 데이터 접근 통제는 아래의 Authentication과 Security Rules로 합니다.

---

## 3. Google 로그인 활성화

Firebase Console에서:

```text
Build
→ Authentication
→ Get started
→ Sign-in method
→ Google
→ Enable
```

프로젝트 지원 이메일을 선택하고 저장합니다.

### GitHub Pages 도메인 추가

Authentication 설정의 **Authorized domains**에 GitHub Pages 도메인을 추가합니다.

예:

```text
seungmocho.github.io
```

저장소 주소 전체가 아니라 `사용자명.github.io` 도메인을 넣습니다.

이 프로젝트는 GitHub Pages에서 호스팅하므로 데스크톱과 모바일 모두 **Google 로그인 팝업 방식**을 사용합니다.
Firebase 공식 문서에 따르면 Firebase Hosting이 아닌 환경에서 `signInWithRedirect()`는 Safari 등
제3자 스토리지 접근을 차단하는 브라우저에서 추가 구성이 필요하므로, 이 프로젝트에서는
`signInWithPopup()`을 사용해 구성을 단순화했습니다.

---

## 4. Cloud Firestore 만들기

Firebase Console:

```text
Build
→ Firestore Database
→ Create database
```

리전을 선택해 데이터베이스를 생성합니다.

여행 플래너는 테스트용 `allow read, write: if true` 규칙을 사용하지 않습니다.

---

## 5. Security Rules 적용

이 프로젝트의 `firestore.rules` 파일을 열고 내용을 복사합니다.

Firebase Console:

```text
Firestore Database
→ Rules
```

에 붙여넣고 **Publish** 합니다.

현재 규칙:

```text
로그인한 사용자는 오직 자신의 UID 아래
users/{uid}/tripData/* 데이터만 읽고 쓸 수 있음
```

따라서 다른 Firebase 사용자는 다른 사람의 여행 문서를 읽거나 수정할 수 없습니다.

---

## 6. GitHub에 push

다음 파일도 반드시 저장소에 포함합니다.

```text
firebase-config.js
firestore.rules
```

`firebase-config.js`의 Firebase Web 설정값은 앱에서 사용하기 위해 공개 저장소에 포함될 수 있습니다.
보안은 설정값을 숨기는 방식이 아니라 Firestore Rules로 적용합니다.

그 뒤 GitHub Pages를 다시 배포합니다.

---

## 7. 실제 사용

### Mac

1. GitHub Pages 여행 플래너 접속
2. 우측 상단 **Google 로그인**
3. Google 계정 선택
4. 상단 상태가 **Firebase 동기화됨**인지 확인
5. 일정 하나를 수정

### iPhone

1. Safari에서 같은 GitHub Pages 주소 접속
2. **Google 로그인**
3. Mac에서 사용한 **같은 Google 계정** 선택
4. Mac에서 수정한 일정이 자동으로 나타나는지 확인
5. Safari 공유 버튼 → **홈 화면에 추가**를 사용하면 앱처럼 이용 가능

---

## 주의

### 같은 Google 계정 기준

현재 버전은 보안을 단순하고 강하게 유지하기 위해
**한 Google 계정 = 하나의 개인 여행 데이터** 구조입니다.

배우자/가족이 서로 다른 Google 계정으로 같은 여행을 공동 편집하는 기능은
별도의 `trips/{tripId}/members/{uid}` 구조와 초대 기능을 추가하는 방식으로 확장할 수 있습니다.

### 데이터 백업

Firebase를 사용하더라도 여행 전에는 **준비 → JSON 백업**으로 한 번 파일을 보관하는 것을 권장합니다.

### 비용

이 앱은 데이터 규모가 매우 작습니다.
다만 Firebase 요금제 및 무료 사용량 정책은 Firebase Console의 현재 정책을 기준으로 확인하세요.
