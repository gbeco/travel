
"use strict";

const TRIP = {
  start: "2026-11-16",
  end: "2026-12-22",
  flights: [
    { id:"flight-out", type:"출국", date:"2026-11-16", flight:"KE457", route:"인천공항 T2 → 다낭", time:"11:10 → 14:15" },
    { id:"flight-in", type:"귀국", date:"2026-12-21", flight:"KE460", route:"다낭 → 인천공항", time:"23:00 → 05:20(+1)" }
  ],
  stays: [
    { id:"stay-1", name:"실크 센스 호이안 리버 리조트", city:"호이안", in:"2026-11-16", out:"2026-11-23", mapQuery:"Silk Sense Hoi An River Resort" },
    { id:"stay-2", name:"Eco & Rustic Home Hoian", city:"호이안", in:"2026-11-23", out:"2026-11-30", mapQuery:"Eco & Rustic Home Hoian" },
    { id:"stay-3", name:"Vernal Hotel & Apartment", city:"다낭", in:"2026-11-30", out:"2026-12-07", mapQuery:"Vernal Hotel & Apartment Da Nang" },
    { id:"stay-4", name:"Risemount Premier Resort Da Nang", city:"다낭", in:"2026-12-07", out:"2026-12-14", mapQuery:"Risemount Premier Resort Da Nang" },
    { id:"stay-5", name:"땀 하우스 & 빌라 호텔", city:"다낭", in:"2026-12-14", out:"2026-12-21", mapQuery:"Tam House Villa Hotel Da Nang" }
  ],
  cities: {
    "호이안": { lat:15.8801, lon:108.3380 },
    "다낭": { lat:16.0544, lon:108.2022 }
  }
};

const NAV = [
  ["home","🏠","홈"],
  ["calendar","📅","일정"],
  ["places","📍","장소"],
  ["bookings","🎫","예약"],
  ["money","💰","비용"],
  ["more","🧳","준비"]
];

const DEFAULT_DAY_PLANS = {
"2026-11-16":{a:"KE457 도착 → 호이안 이동 → 체크인",b:"호텔 저녁만 먹고 휴식",c:"완전 휴식",selected:"A"},
"2026-11-17":{a:"리조트 적응 · 수영 · 산책 · 장보기",b:"근처 카페만 가볍게",c:"객실 휴식",selected:"A"},
"2026-11-18":{a:"오후 호이안 올드타운 · 저녁 · 야경",b:"이른 저녁만 올드타운",c:"카페 또는 배달",selected:"A"},
"2026-11-19":{a:"리조트 + 카페",b:"짧은 산책",c:"완전 휴식",selected:"B"},
"2026-11-20":{a:"안방비치 · 점심 · 카페",b:"해변 카페만",c:"마사지 · 카페",selected:"A"},
"2026-11-21":{a:"올드타운 재방문 · 시장 · 저녁",b:"저녁 식사만 외출",c:"숙소 휴식",selected:"B"},
"2026-11-22":{a:"휴식 · 빨래 · 장보기",b:"동일",c:"동일",selected:"A"},
"2026-11-23":{a:"숙소 이동 · 장보기 · 휴식",b:"체크인 후 카페",c:"숙소 휴식",selected:"A"},
"2026-11-24":{a:"현지생활 · 마트 · 카페",b:"점심 외출",c:"완전 휴식",selected:"A"},
"2026-11-25":{a:"짜꾸에 채소마을",b:"논길 드라이브 · 점심",c:"카페 · 올드타운 실내",selected:"A"},
"2026-11-26":{a:"올드타운 카페 · 식사",b:"마사지",c:"완전 휴식",selected:"B"},
"2026-11-27":{a:"깜탄 코코넛마을",b:"짧은 보트 체험",c:"비 오면 취소",selected:"A"},
"2026-11-28":{a:"안방비치 재방문",b:"호이안 시내",c:"카페",selected:"B"},
"2026-11-29":{a:"호이안 마지막 휴식 · 선물 쇼핑",b:"숙소 주변만",c:"완전 휴식",selected:"A"},
"2026-11-30":{a:"호이안 → 다낭 이동 · 체크인",b:"체크인 · 장보기",c:"숙소 휴식",selected:"A"},
"2026-12-01":{a:"미케비치 · 생활권 탐색",b:"카페",c:"완전 휴식",selected:"A"},
"2026-12-02":{a:"한시장 · 다낭 시내 · 한강",b:"시내 점심만",c:"쇼핑몰",selected:"A"},
"2026-12-03":{a:"참 조각 박물관 · 카페",b:"쇼핑 · 카페",c:"완전 휴식",selected:"A"},
"2026-12-04":{a:"손짜반도 · 영응사",b:"영응사까지만",c:"시내 일정으로 교체",selected:"A"},
"2026-12-05":{a:"오후 휴식 → 용다리 후보",b:"저녁 식사 + 용다리",c:"호텔",selected:"B"},
"2026-12-06":{a:"자유 · 마사지",b:"카페",c:"완전 휴식",selected:"A"},
"2026-12-07":{a:"Risemount 이동 · 리조트 휴식",b:"체크인 후 주변 산책",c:"완전 휴식",selected:"A"},
"2026-12-08":{a:"리조트 · 수영 · 해변",b:"주변 카페",c:"객실 휴식",selected:"A"},
"2026-12-09":{a:"바나힐 — 날씨 좋을 때 실행",b:"미케비치 · 카페",c:"실내 · 카페 · 쇼핑",selected:"A"},
"2026-12-10":{a:"바나힐 다음날 완전 휴식",b:"근처 산책",c:"완전 휴식",selected:"A"},
"2026-12-11":{a:"오행산",b:"짧은 시내 외출",c:"박물관 · 쇼핑",selected:"A"},
"2026-12-12":{a:"미케비치 → 용다리 후보",b:"저녁만 외출",c:"배달 · 호텔",selected:"A"},
"2026-12-13":{a:"완전 자유일",b:"마사지",c:"완전 휴식",selected:"A"},
"2026-12-14":{a:"땀 하우스 이동 · 주변 탐색",b:"체크인 후 카페",c:"숙소 휴식",selected:"A"},
"2026-12-15":{a:"동네생활 · 카페",b:"점심 외출",c:"완전 휴식",selected:"A"},
"2026-12-16":{a:"미케비치 · 카페",b:"손짜반도 재도전",c:"호텔",selected:"A"},
"2026-12-17":{a:"다낭 시내 · 시장 · 쇼핑",b:"카페 · 마트",c:"완전 휴식",selected:"A"},
"2026-12-18":{a:"이번 여행에서 가장 좋았던 곳 재방문",b:"가장 좋았던 맛집 재방문",c:"숙소 휴식",selected:"A"},
"2026-12-19":{a:"마사지 · 카페 → 용다리 후보",b:"저녁 외출",c:"완전 휴식",selected:"A"},
"2026-12-20":{a:"귀국 쇼핑 · 빨래 · 짐 정리",b:"근처 식사",c:"완전 휴식",selected:"A"},
"2026-12-21":{a:"체크아웃 → 점심 · 카페 → 공항 → KE460",b:"호텔 주변에서만",c:"공항 일찍 이동",selected:"A"},
"2026-12-22":{a:"05:20 인천 도착",b:"-",c:"-",selected:"A"}
};

const DEFAULT_PLACES = [
  {id:"p1",city:"호이안",cat:"관광",name:"호이안 올드타운",priority:"❤️ 꼭 가기",note:"오후 늦게 가서 저녁·야경까지",map:"Hoi An Ancient Town"},
  {id:"p2",city:"호이안",cat:"관광",name:"안방비치",priority:"⭐ 가볼 만함",note:"수영보다는 산책·카페 중심",map:"An Bang Beach Hoi An"},
  {id:"p3",city:"호이안",cat:"관광",name:"짜꾸에 채소마을",priority:"⭐ 가볼 만함",note:"날씨 좋은 날 가볍게",map:"Tra Que Vegetable Village"},
  {id:"p4",city:"호이안",cat:"관광",name:"깜탄 코코넛마을",priority:"○ 시간되면",note:"우천·바람 시 취소",map:"Cam Thanh Coconut Village"},
  {id:"p5",city:"호이안",cat:"마트",name:"WinMart+",priority:"생활",note:"숙소별 가까운 지점 검색",map:"WinMart+ Hoi An"},
  {id:"p6",city:"호이안",cat:"아기",name:"Baby's World Hoi An",priority:"생활",note:"아기용품 비상 구매 후보",map:"Baby's World Hoi An"},
  {id:"p7",city:"다낭",cat:"관광",name:"바나힐",priority:"❤️ 꼭 가기",note:"12/8~12/12 중 날씨 좋은 날",map:"Sun World Ba Na Hills"},
  {id:"p8",city:"다낭",cat:"관광",name:"손짜반도 · 영응사",priority:"⭐ 가볼 만함",note:"건조하고 시야 좋은 날",map:"Linh Ung Pagoda Son Tra Da Nang"},
  {id:"p9",city:"다낭",cat:"관광",name:"오행산",priority:"⭐ 가볼 만함",note:"비 오는 날 피하기",map:"Marble Mountains Da Nang"},
  {id:"p10",city:"다낭",cat:"쇼핑",name:"한시장",priority:"⭐ 가볼 만함",note:"Vernal 체류 시 이용 편리",map:"Han Market Da Nang"},
  {id:"p11",city:"다낭",cat:"마트",name:"롯데마트 다낭",priority:"생활",note:"다낭 도착 후 대형 장보기",map:"Lotte Mart Da Nang"},
  {id:"p12",city:"다낭",cat:"아기",name:"Con Cung",priority:"생활",note:"분유·기저귀 등 재고는 방문 전 확인",map:"Con Cung 81 Nguyen Van Linh Da Nang"},
  {id:"p13",city:"다낭",cat:"의료",name:"Vinmec Da Nang Hospital",priority:"긴급",note:"소아 진료 후보",map:"Vinmec Da Nang Hospital"},
  {id:"p14",city:"다낭",cat:"약국",name:"FPT Long Châu",priority:"생활",note:"Nguyen Van Thoai 인근 지점 후보",map:"FPT Long Chau 65 Nguyen Van Thoai Da Nang"},
  {id:"p15",city:"다낭",cat:"카페",name:"Login Coffee",priority:"○ 시간되면",note:"Risemount 인근 후보",map:"Login Coffee Nguyen Van Thoai Da Nang"}
];

const DEFAULT_STATE = {
  dayPlans: DEFAULT_DAY_PLANS,
  dayNotes: {},
  baby: {},
  places: DEFAULT_PLACES,
  customBookings: [],
  expenses: [],
  budget: 75000000,
  krwRate: 0.0524,
  checklist: ["여권","여행자보험","아기 분유","이유식","기저귀","물티슈","상비약","충전기","유모차/아기띠"],
  checked: {},
  weather: { fetchedAt:null, cities:{} },
  _meta: { updatedAt: 0 }
};

let state = loadState();
let activeView = "home";
let placeFilter = "전체";

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem("vnTripPlannerV2"));
    return saved ? deepMerge(clone(DEFAULT_STATE), saved) : clone(DEFAULT_STATE);
  }catch(e){ return clone(DEFAULT_STATE); }
}
function deepMerge(base, saved){
  if(Array.isArray(base) || typeof base !== "object" || base === null) return saved ?? base;
  Object.keys(saved || {}).forEach(k=>{
    if(base[k] && typeof base[k]==="object" && !Array.isArray(base[k]) && typeof saved[k]==="object" && !Array.isArray(saved[k])){
      base[k]=deepMerge(base[k],saved[k]);
    }else base[k]=saved[k];
  });
  return base;
}
function persistLocal(){
  localStorage.setItem("vnTripPlannerV2", JSON.stringify(state));
}
function save(){
  state._meta = state._meta || {};
  state._meta.updatedAt = Date.now();
  persistLocal();
  scheduleCloudWrite();
}


const cloud = {
  configured: false,
  loading: true,
  user: null,
  auth: null,
  db: null,
  docRef: null,
  sdk: null,
  unsubscribe: null,
  writeTimer: null,
  status: "Firebase 확인 중",
  lastSyncedAt: null,
  error: null
};

function isFirebaseConfigured(config){
  if(!config || typeof config !== "object") return false;
  const required = ["apiKey","authDomain","projectId","appId"];
  return required.every(k => config[k] && !String(config[k]).includes("YOUR_"));
}

function cloudStatusLabel(){
  if(cloud.loading) return "☁️ Firebase 확인 중";
  if(!cloud.configured) return "💾 이 기기에 저장";
  if(cloud.error) return "⚠️ 동기화 오류";
  if(!cloud.user) return "💾 로그인 전 · 로컬";
  if(cloud.status === "syncing") return "☁️ 동기화 중…";
  if(cloud.status === "synced") return "☁️ Firebase 동기화됨";
  return "☁️ Firebase 연결됨";
}

function updateCloudHeader(){
  const statusBtn = document.getElementById("cloudStatusBtn");
  const authBtn = document.getElementById("authBtn");
  if(statusBtn) statusBtn.textContent = cloudStatusLabel();
  if(authBtn){
    if(!cloud.configured){
      authBtn.textContent = "Firebase 설정";
    }else if(cloud.user){
      authBtn.textContent = "로그아웃";
      authBtn.title = cloud.user.email || cloud.user.displayName || "";
    }else{
      authBtn.textContent = "Google 로그인";
      authBtn.title = "";
    }
  }
}

function applyRemoteState(remoteState, remoteUpdatedAt){
  if(!remoteState) return;
  state = deepMerge(clone(DEFAULT_STATE), remoteState);
  state._meta = state._meta || {};
  state._meta.updatedAt = Number(remoteUpdatedAt || state._meta.updatedAt || 0);
  persistLocal();
  cloud.status = "synced";
  cloud.lastSyncedAt = Date.now();
  cloud.error = null;
  updateCloudHeader();
  render();
}

async function pushCloudState(){
  if(!cloud.configured || !cloud.user || !cloud.docRef || !cloud.sdk) return;
  cloud.status = "syncing";
  cloud.error = null;
  updateCloudHeader();
  try{
    const updatedAtClient = Number(state._meta?.updatedAt || Date.now());
    await cloud.sdk.setDoc(cloud.docRef, {
      schemaVersion: 3,
      state: state,
      updatedAtClient,
      updatedAt: cloud.sdk.serverTimestamp()
    });
    cloud.status = "synced";
    cloud.lastSyncedAt = Date.now();
  }catch(err){
    console.error("Firebase sync write failed", err);
    cloud.status = "error";
    cloud.error = err;
  }
  updateCloudHeader();
}

function scheduleCloudWrite(){
  if(!cloud.configured || !cloud.user || !cloud.docRef) return;
  clearTimeout(cloud.writeTimer);
  cloud.writeTimer = setTimeout(pushCloudState, 700);
}

async function connectSignedInUser(user){
  cloud.user = user;
  cloud.error = null;
  updateCloudHeader();

  if(cloud.unsubscribe){
    cloud.unsubscribe();
    cloud.unsubscribe = null;
  }

  const { doc, getDoc, onSnapshot } = cloud.sdk;
  cloud.docRef = doc(cloud.db, "users", user.uid, "tripData", "current");

  try{
    const snap = await getDoc(cloud.docRef);
    const localUpdatedAt = Number(state._meta?.updatedAt || 0);

    if(snap.exists()){
      const remote = snap.data();
      const remoteUpdatedAt = Number(remote.updatedAtClient || 0);
      if(remoteUpdatedAt > localUpdatedAt){
        applyRemoteState(remote.state, remoteUpdatedAt);
      }else{
        await pushCloudState();
      }
    }else{
      await pushCloudState();
    }

    cloud.unsubscribe = onSnapshot(
      cloud.docRef,
      { includeMetadataChanges: true },
      snap2 => {
        if(!snap2.exists() || snap2.metadata.hasPendingWrites) return;
        const remote = snap2.data();
        const remoteUpdatedAt = Number(remote.updatedAtClient || 0);
        const localUpdatedAt = Number(state._meta?.updatedAt || 0);
        if(remoteUpdatedAt > localUpdatedAt){
          applyRemoteState(remote.state, remoteUpdatedAt);
        }else{
          cloud.status = "synced";
          cloud.lastSyncedAt = Date.now();
          updateCloudHeader();
        }
      },
      err => {
        console.error("Firebase snapshot failed", err);
        cloud.error = err;
        cloud.status = "error";
        updateCloudHeader();
      }
    );
  }catch(err){
    console.error("Firebase initial sync failed", err);
    cloud.error = err;
    cloud.status = "error";
    updateCloudHeader();
  }
}

async function initFirebaseSync(){
  try{
    const configModule = await import("./firebase-config.js");
    const config = configModule.firebaseConfig;
    cloud.configured = isFirebaseConfigured(config);
    cloud.loading = false;
    updateCloudHeader();

    if(!cloud.configured) return;

    const VERSION = "12.19.0";
    const [appMod, authMod, firestoreMod] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-firestore.js`)
    ]);

    const firebaseApp = appMod.initializeApp(config);
    cloud.auth = authMod.getAuth(firebaseApp);
    cloud.db = firestoreMod.getFirestore(firebaseApp);
    cloud.sdk = {
      GoogleAuthProvider: authMod.GoogleAuthProvider,
      signInWithPopup: authMod.signInWithPopup,
      signOut: authMod.signOut,
      doc: firestoreMod.doc,
      getDoc: firestoreMod.getDoc,
      setDoc: firestoreMod.setDoc,
      onSnapshot: firestoreMod.onSnapshot,
      serverTimestamp: firestoreMod.serverTimestamp
    };

    authMod.onAuthStateChanged(cloud.auth, user => {
      if(user){
        connectSignedInUser(user);
      }else{
        if(cloud.unsubscribe){
          cloud.unsubscribe();
          cloud.unsubscribe = null;
        }
        cloud.user = null;
        cloud.docRef = null;
        cloud.status = "local";
        cloud.error = null;
        updateCloudHeader();
        if(activeView === "more") renderMore();
      }
    });
  }catch(err){
    console.error("Firebase initialization failed", err);
    cloud.loading = false;
    cloud.error = err;
    updateCloudHeader();
  }
}

function isMobileBrowser(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function toggleFirebaseAuth(){
  if(!cloud.configured){
    openFirebaseSetupModal();
    return;
  }
  if(!cloud.auth || !cloud.sdk){
    alert("Firebase SDK를 불러오지 못했습니다. 인터넷 연결을 확인해주세요.");
    return;
  }

  if(cloud.user){
    try{
      await cloud.sdk.signOut(cloud.auth);
    }catch(err){
      alert("로그아웃하지 못했습니다.");
    }
    return;
  }

  const provider = new cloud.sdk.GoogleAuthProvider();
  try{
    // GitHub Pages is not Firebase Hosting. Popup avoids redirect auth problems
    // caused by third-party storage restrictions in modern Safari/Firefox/Chrome.
    await cloud.sdk.signInWithPopup(cloud.auth, provider);
  }catch(err){
    console.error("Google sign-in failed", err);
    alert("Google 로그인에 실패했습니다. Firebase Authentication의 Google 제공자와 GitHub Pages 도메인 등록을 확인해주세요.");
  }
}

function openFirebaseSetupModal(){
  showModal(`
    <div class="modal-head">
      <div><div class="eyebrow">FIREBASE</div><h2>클라우드 동기화 설정</h2></div>
      <button class="btn small" data-close-modal>닫기</button>
    </div>
    <div class="stack">
      <div class="item"><div class="item-title">1. Firebase 프로젝트와 Web App 생성</div><div class="item-meta">Firebase Console에서 Web App을 등록하고 firebaseConfig 값을 복사합니다.</div></div>
      <div class="item"><div class="item-title">2. firebase-config.js 수정</div><div class="item-meta">프로젝트 루트의 firebase-config.js에 받은 설정값을 넣습니다.</div></div>
      <div class="item"><div class="item-title">3. Google 로그인 활성화</div><div class="item-meta">Authentication → Sign-in method에서 Google을 켜고, Authorized domains에 GitHub Pages 도메인을 추가합니다.</div></div>
      <div class="item"><div class="item-title">4. Firestore와 보안 규칙 설정</div><div class="item-meta">Firestore Database를 만든 뒤 이 프로젝트의 firestore.rules 내용을 Rules 탭에 적용합니다.</div></div>
    </div>
    <div class="note" style="margin-top:14px">상세 과정은 FIREBASE_SETUP.md에 정리해 두었습니다.</div>
  `);
}

function parseDate(s){ return new Date(s+"T00:00:00"); }
function iso(d){ return new Date(d).toISOString().slice(0,10); }
function dateRange(a,b){
  const out=[], d=parseDate(a), e=parseDate(b);
  while(d<=e){ out.push(iso(d)); d.setDate(d.getDate()+1); }
  return out;
}
const ALL_DATES = dateRange(TRIP.start,TRIP.end);

function fmtDate(s, long=false){
  return parseDate(s).toLocaleDateString("ko-KR", long
    ? {year:"numeric",month:"long",day:"numeric",weekday:"short"}
    : {month:"numeric",day:"numeric",weekday:"short"});
}
function currentStay(date){
  return TRIP.stays.find(s=>date>=s.in && date<s.out) || null;
}
function cityForDate(date){
  return currentStay(date)?.city || (date==="2026-12-22" ? "한국" : "다낭");
}
function stayMapUrl(stay){
  const q = stay.mapQuery || `${stay.name} ${stay.city} Vietnam`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
function stayLink(stay, extraClass=""){
  return `<a class="stay-map-link ${extraClass}" href="${stayMapUrl(stay)}" target="_blank" rel="noopener noreferrer" title="Google Maps에서 ${attr(stay.name)} 열기">${escapeHtml(stay.name)}</a>`;
}
function renderWithStayLinks(text){
  let html = escapeHtml(text);
  TRIP.stays.forEach(stay=>{
    const safeName = escapeHtml(stay.name);
    html = html.split(safeName).join(stayLink(stay));
  });
  return html;
}
function lockedEvents(date){
  const events=[];
  TRIP.flights.filter(f=>f.date===date).forEach(f=>events.push(`✈ ${f.flight} · ${f.time}`));
  TRIP.stays.forEach(s=>{
    if(s.in===date) events.push(`🔒 체크인 · ${s.name}`);
    if(s.out===date) events.push(`🔒 체크아웃 · ${s.name}`);
  });
  return events;
}
function selectedPlan(date){
  const p=state.dayPlans[date];
  if(!p) return "";
  return p[(p.selected || "A").toLowerCase()] || "";
}
function money(v){ return `${Number(v||0).toLocaleString()}₫`; }
function krw(v){ return `약 ${(Math.round(Number(v||0)*state.krwRate/1000)*1000).toLocaleString()}원`; }

function tripStatusText(){
  const today = new Date();
  today.setHours(0,0,0,0);
  const start=parseDate(TRIP.start), end=parseDate(TRIP.end);
  if(today<start){
    const d=Math.ceil((start-today)/86400000);
    return `출발 D-${d}`;
  }
  if(today<=end){
    const d=Math.floor((today-start)/86400000)+1;
    return `여행 ${d}일차`;
  }
  return "여행 완료";
}

function navHTML(mobile=false){
  return NAV.map(([id,icon,label])=>
    `<button class="${activeView===id?"active":""}" data-view="${id}">${icon}${mobile?"<br>":" "}${label}</button>`
  ).join("");
}
function bindNavigation(){
  document.getElementById("desktopNav").innerHTML=navHTML(false);
  document.getElementById("mobileNav").innerHTML=navHTML(true);
  document.querySelectorAll("[data-view]").forEach(btn=>{
    btn.onclick=()=>{ activeView=btn.dataset.view; render(); window.scrollTo({top:0,behavior:"smooth"}); };
  });
}

function setHeader(title,subtitle){
  document.getElementById("tripStatus").textContent=tripStatusText();
  document.getElementById("pageTitle").textContent=title;
  document.getElementById("pageSubtitle").textContent=subtitle;
}

function render(){
  bindNavigation();
  const renders={home:renderHome,calendar:renderCalendar,places:renderPlaces,bookings:renderBookings,money:renderMoney,more:renderMore};
  renders[activeView]();
}

function nearestTripDate(){
  const today=iso(new Date());
  if(today<TRIP.start) return TRIP.start;
  if(today>TRIP.end) return TRIP.end;
  return today;
}

function weatherFor(date){
  const city=cityForDate(date);
  return state.weather.cities?.[city]?.[date] || null;
}
function weatherEmoji(code){
  if(code===0) return "☀️";
  if([1,2,3].includes(code)) return "⛅";
  if([45,48].includes(code)) return "🌫️";
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if([95,96,99].includes(code)) return "⛈️";
  return "☁️";
}

function renderHome(){
  setHeader("여행 홈","오늘의 운영 판단과 다음 고정 일정을 빠르게 확인합니다.");
  const d=nearestTripDate(), stay=currentStay(d), p=state.dayPlans[d] || {a:"",b:"",c:"",selected:"A"};
  const spent=state.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const w=weatherFor(d);
  const weatherText=w ? `${weatherEmoji(w.code)} ${w.min}–${w.max}℃ · 강수확률 ${w.rain}%` : "예보 범위에 들어오면 조회 가능합니다.";
  document.getElementById("view").innerHTML=`
    <div class="grid grid-4">
      ${statCard("여행 기간","37일","11/16 → 12/22")}
      ${statCard("호이안","14박","11/16 → 11/30")}
      ${statCard("다낭","21박","11/30 → 12/21")}
      ${statCard("기록 지출",money(spent),`${krw(spent)} · 예산 ${money(state.budget)}`)}
    </div>

    <div class="quick-today">
      <div class="card">
        <div class="card-head">
          <div><div class="eyebrow">${fmtDate(d,true)}</div><h2>${cityForDate(d)} · 오늘 운영안</h2></div>
          <button class="btn small" data-edit-day="${d}">수정</button>
        </div>
        <div class="stack">
          ${planOptionHTML(d,"A",p.a,p.selected)}
          ${planOptionHTML(d,"B",p.b,p.selected)}
          ${planOptionHTML(d,"C",p.c,p.selected)}
        </div>
        <div class="row wrap" style="margin-top:14px">
          ${stay ? `<span class="badge good">🏨 ${stayLink(stay)}</span>`:""}
          ${lockedEvents(d).map(e=>`<span class="badge good">${renderWithStayLinks(e)}</span>`).join("")}
        </div>
      </div>

      <div class="card weather-box">
        <div class="card-head"><h3>☁️ ${cityForDate(d)} 날씨</h3><span class="badge">${d}</span></div>
        <div class="weather-main">${weatherText}</div>
        <p class="small muted">Open-Meteo 예보는 최대 16일 범위라 여행 날짜가 가까워지면 자동으로 활용할 수 있습니다.</p>
        <button class="btn primary small" id="homeWeatherBtn">날씨 가져오기</button>
      </div>
    </div>

    <div class="section grid grid-2">
      <div class="card">
        <div class="card-head"><h3>🔒 확정 숙소</h3><span class="badge">수정 불가</span></div>
        <div class="stack">${TRIP.stays.map(stayRow).join("")}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>다음 고정 일정</h3></div>
        <div class="stack">
          ${nextLockedEvents().slice(0,5).map(x=>`<div class="item"><div class="item-title">${renderWithStayLinks(x.event)}</div><div class="item-meta">${fmtDate(x.date,true)}</div></div>`).join("") || `<div class="muted small">남은 고정 일정이 없습니다.</div>`}
        </div>
      </div>
    </div>
  `;
  bindDayEditButtons();
  document.querySelectorAll("[data-select-plan]").forEach(btn=>btn.onclick=()=>{
    const [date,sel]=btn.dataset.selectPlan.split("|");
    state.dayPlans[date].selected=sel; save(); renderHome();
  });
  document.getElementById("homeWeatherBtn").onclick=refreshWeather;
}

function statCard(label,value,sub){
  return `<div class="card"><div class="stat-label">${label}</div><div class="stat">${value}</div><div class="stat-sub">${sub}</div></div>`;
}
function planOptionHTML(date,label,text,selected){
  return `<div class="plan-card ${selected===label?"selected":""}">
    <div class="row between">
      <div>
        <div class="plan-label">${label==="A"?"☀️ A PLAN":label==="B"?"🌤️ B PLAN":"🌧️ C PLAN"}</div>
        <div class="plan-title">${escapeHtml(text || "미정")}</div>
      </div>
      <button class="btn small ${selected===label?"primary":""}" data-select-plan="${date}|${label}">${selected===label?"선택됨":"선택"}</button>
    </div>
  </div>`;
}
function stayRow(s){
  return `<div class="locked-row">
    <div><strong>${fmtDate(s.in)}–${fmtDate(s.out)}</strong><div class="small muted">${s.city}</div></div>
    <div><strong>${stayLink(s)}</strong></div>
    <span class="lock-badge">🔒 LOCKED</span>
  </div>`;
}
function nextLockedEvents(){
  const ref=nearestTripDate();
  const arr=[];
  ALL_DATES.forEach(d=>lockedEvents(d).forEach(event=>arr.push({date:d,event})));
  return arr.filter(x=>x.date>=ref);
}

function renderCalendar(){
  setHeader("전체 일정","A/B/C 일정은 수정·선택할 수 있고, 선택된 일정은 다른 날짜로 드래그 이동할 수 있습니다.");
  const months=[["2026-11","2026년 11월"],["2026-12","2026년 12월"]];
  document.getElementById("view").innerHTML=`
    <div class="row between wrap" style="margin-bottom:14px">
      <div class="row wrap">
        <span class="badge good">🔒 항공·숙소</span><span class="badge warn">✎ 자유 일정</span>
      </div>
      <button class="btn" id="openAgendaBtn">오늘/기준일 상세</button>
    </div>
    ${months.map(([m,title])=>monthCalendar(m,title)).join("")}
  `;
  bindDayEditButtons();
  bindDragDrop();
  document.getElementById("openAgendaBtn").onclick=()=>openDayModal(nearestTripDate());
}
function monthCalendar(month,title){
  const [y,m]=month.split("-").map(Number);
  const first=new Date(y,m-1,1);
  const last=new Date(y,m,0);
  const blanks=first.getDay();
  let cells=Array(blanks).fill(`<div class="day empty"></div>`);
  for(let day=1;day<=last.getDate();day++){
    const d=`${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if(d<TRIP.start || d>TRIP.end) {
      cells.push(`<div class="day empty"><div class="day-date">${day}</div></div>`);
      continue;
    }
    const plan=selectedPlan(d), stay=currentStay(d), w=weatherFor(d);
    cells.push(`<div class="day" data-drop-date="${d}">
      <div class="row between"><div class="day-date">${day}</div><span class="tiny">${fmtDate(d).split(" ").pop()}</span></div>
      <div class="day-city">${stay?`${escapeHtml(stay.city)} · ${stayLink(stay)}`:escapeHtml(cityForDate(d))}</div>
      ${lockedEvents(d).map(e=>`<div class="event locked">${renderWithStayLinks(e)}</div>`).join("")}
      ${w?`<div class="event weather">${weatherEmoji(w.code)} ${w.min}–${w.max}℃ · ${w.rain}%</div>`:""}
      ${plan?`<div class="event editable" draggable="true" data-drag-date="${d}">✎ ${escapeHtml(plan)}</div>`:""}
      <div class="day-actions"><button data-edit-day="${d}">${plan?"일정 수정":"+ 일정 추가"}</button></div>
    </div>`);
  }
  return `<div class="calendar-month"><div class="month-title">${title}</div>
    <div class="calendar">
      ${["일","월","화","수","목","금","토"].map(x=>`<div class="dow">${x}</div>`).join("")}
      ${cells.join("")}
    </div></div>`;
}
function bindDragDrop(){
  let source=null;
  document.querySelectorAll("[data-drag-date]").forEach(el=>{
    el.ondragstart=()=>{source=el.dataset.dragDate;};
  });
  document.querySelectorAll("[data-drop-date]").forEach(el=>{
    el.ondragover=e=>{e.preventDefault();el.classList.add("drag-over");};
    el.ondragleave=()=>el.classList.remove("drag-over");
    el.ondrop=e=>{
      e.preventDefault();el.classList.remove("drag-over");
      const target=el.dataset.dropDate;
      if(!source || source===target) return;
      const tmp=state.dayPlans[target];
      state.dayPlans[target]=state.dayPlans[source];
      if(tmp) state.dayPlans[source]=tmp; else delete state.dayPlans[source];
      save();renderCalendar();
    };
  });
}

function bindDayEditButtons(){
  document.querySelectorAll("[data-edit-day]").forEach(btn=>btn.onclick=()=>openDayModal(btn.dataset.editDay));
}
function babyState(date){
  return state.baby[date] || {formula:false,solids:false,nap:false,diaper:false,clothes:false,carrier:false};
}
function openDayModal(date){
  if(!state.dayPlans[date]) state.dayPlans[date]={a:"",b:"",c:"",selected:"A"};
  const p=state.dayPlans[date], b=babyState(date), w=weatherFor(date);
  showModal(`
    <div class="modal-head">
      <div><div class="eyebrow">${fmtDate(date,true)} · ${cityForDate(date)}</div><h2>하루 일정 편집</h2></div>
      <button class="btn small" data-close-modal>닫기</button>
    </div>
    ${lockedEvents(date).length?`<div class="note">🔒 ${lockedEvents(date).map(renderWithStayLinks).join(" · ")} — 고정 일정은 변경되지 않습니다.</div>`:""}
    ${w?`<div class="item" style="margin-top:12px"><div class="item-title">${weatherEmoji(w.code)} 예상 ${w.min}–${w.max}℃</div><div class="item-meta">최대 강수확률 ${w.rain}% · 최근 조회 예보</div></div>`:""}
    <div class="form-grid" style="margin-top:14px">
      <label class="field">선택할 운영안
        <select id="daySelected"><option ${p.selected==="A"?"selected":""}>A</option><option ${p.selected==="B"?"selected":""}>B</option><option ${p.selected==="C"?"selected":""}>C</option></select>
      </label>
      <label class="field">메모
        <input id="dayNote" value="${attr(state.dayNotes[date]||"")}" placeholder="예약시간, 이동 메모 등" />
      </label>
    </div>
    <label class="field" style="margin-top:12px">☀️ A PLAN<textarea id="planA">${escapeHtml(p.a||"")}</textarea></label>
    <label class="field" style="margin-top:12px">🌤️ B PLAN<textarea id="planB">${escapeHtml(p.b||"")}</textarea></label>
    <label class="field" style="margin-top:12px">🌧️ C PLAN<textarea id="planC">${escapeHtml(p.c||"")}</textarea></label>
    <hr>
    <h3>👶 아기 루틴</h3>
    <div class="grid grid-3 checklist" style="margin-top:10px">
      ${babyCheck("formula","분유",b.formula)}
      ${babyCheck("solids","이유식",b.solids)}
      ${babyCheck("nap","낮잠",b.nap)}
      ${babyCheck("diaper","기저귀",b.diaper)}
      ${babyCheck("clothes","여벌 옷",b.clothes)}
      ${babyCheck("carrier","유모차/아기띠",b.carrier)}
    </div>
    <div class="modal-footer">
      <button class="btn danger" id="clearDayBtn">자유 일정 비우기</button>
      <button class="btn primary" id="saveDayBtn">저장</button>
    </div>
  `);
  document.getElementById("saveDayBtn").onclick=()=>{
    state.dayPlans[date]={
      a:document.getElementById("planA").value.trim(),
      b:document.getElementById("planB").value.trim(),
      c:document.getElementById("planC").value.trim(),
      selected:document.getElementById("daySelected").value
    };
    state.dayNotes[date]=document.getElementById("dayNote").value.trim();
    state.baby[date]={};
    document.querySelectorAll("[data-baby-key]").forEach(x=>state.baby[date][x.dataset.babyKey]=x.checked);
    save();closeModal();render();
  };
  document.getElementById("clearDayBtn").onclick=()=>{
    delete state.dayPlans[date]; delete state.dayNotes[date]; delete state.baby[date];
    save();closeModal();render();
  };
}
function babyCheck(key,label,checked){
  return `<label><input type="checkbox" data-baby-key="${key}" ${checked?"checked":""}><span>${label}</span></label>`;
}

function renderPlaces(){
  setHeader("장소 보관함","장소를 저장하고 지도에서 바로 검색하거나 특정 날짜 일정에 붙일 수 있습니다.");
  const cats=["전체","호이안","다낭","관광","식당","카페","마트","아기","의료","약국"];
  const items=state.places.filter(p=>placeFilter==="전체"||p.city===placeFilter||p.cat===placeFilter);
  document.getElementById("view").innerHTML=`
    <div class="row between wrap" style="margin-bottom:14px">
      <div class="filters">${cats.map(c=>`<button class="btn small ${placeFilter===c?"active":""}" data-place-filter="${c}">${c}</button>`).join("")}</div>
      <button class="btn primary" id="addPlaceBtn">+ 장소 추가</button>
    </div>
    <div class="place-grid">
      ${items.map(p=>`<div class="place-card">
        <div><div class="row between"><span class="badge">${escapeHtml(p.city)} · ${escapeHtml(p.cat)}</span><span class="small">${escapeHtml(p.priority||"")}</span></div>
        <div class="name" style="margin-top:10px">${escapeHtml(p.name)}</div>
        <div class="item-meta">${escapeHtml(p.note||"")}</div></div>
        <div class="row wrap">
          <a class="btn small" target="_blank" rel="noopener" href="${mapUrl(p)}">🗺 지도</a>
          <button class="btn small" data-place-to-day="${p.id}">일정에 추가</button>
          <button class="btn small danger" data-delete-place="${p.id}">삭제</button>
        </div>
      </div>`).join("") || `<div class="card muted small">해당 조건의 장소가 없습니다.</div>`}
    </div>
  `;
  document.querySelectorAll("[data-place-filter]").forEach(b=>b.onclick=()=>{placeFilter=b.dataset.placeFilter;renderPlaces();});
  document.getElementById("addPlaceBtn").onclick=openAddPlaceModal;
  document.querySelectorAll("[data-delete-place]").forEach(b=>b.onclick=()=>{
    state.places=state.places.filter(p=>p.id!==b.dataset.deletePlace);save();renderPlaces();
  });
  document.querySelectorAll("[data-place-to-day]").forEach(b=>b.onclick=()=>openPlaceToDayModal(b.dataset.placeToDay));
}
function mapUrl(p){
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.map||`${p.name} ${p.city}`)}`;
}
function openAddPlaceModal(){
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">PLACES</div><h2>장소 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">장소명<input id="placeName"></label>
      <label class="field">지역<select id="placeCity"><option>호이안</option><option>다낭</option></select></label>
      <label class="field">분류<select id="placeCat"><option>관광</option><option>식당</option><option>카페</option><option>마사지</option><option>마트</option><option>아기</option><option>의료</option><option>약국</option><option>기타</option></select></label>
      <label class="field">우선순위<input id="placePriority" value="⭐ 가볼 만함"></label>
    </div>
    <label class="field" style="margin-top:12px">메모<textarea id="placeNote"></textarea></label>
    <label class="field" style="margin-top:12px">지도 검색어<input id="placeMap" placeholder="비워두면 장소명 + 지역으로 검색"></label>
    <div class="modal-footer"><button class="btn primary" id="savePlaceBtn">저장</button></div>
  `);
  document.getElementById("savePlaceBtn").onclick=()=>{
    const name=document.getElementById("placeName").value.trim(); if(!name)return;
    state.places.push({
      id:"p-"+Date.now(),name,
      city:document.getElementById("placeCity").value,
      cat:document.getElementById("placeCat").value,
      priority:document.getElementById("placePriority").value.trim(),
      note:document.getElementById("placeNote").value.trim(),
      map:document.getElementById("placeMap").value.trim()
    });
    save();closeModal();renderPlaces();
  };
}
function openPlaceToDayModal(id){
  const p=state.places.find(x=>x.id===id); if(!p)return;
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">일정에 장소 추가</div><h2>${escapeHtml(p.name)}</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <label class="field">날짜<select id="targetDate">${ALL_DATES.map(d=>`<option value="${d}">${fmtDate(d,true)} · ${cityForDate(d)}</option>`).join("")}</select></label>
    <label class="field" style="margin-top:12px">추가할 운영안<select id="targetPlan"><option>A</option><option>B</option><option>C</option></select></label>
    <div class="modal-footer"><button class="btn primary" id="addPlaceToDayBtn">추가</button></div>
  `);
  document.getElementById("addPlaceToDayBtn").onclick=()=>{
    const d=document.getElementById("targetDate").value;
    const sel=document.getElementById("targetPlan").value.toLowerCase();
    if(!state.dayPlans[d])state.dayPlans[d]={a:"",b:"",c:"",selected:"A"};
    const old=state.dayPlans[d][sel]||"";
    state.dayPlans[d][sel]=old ? `${old} · ${p.name}` : p.name;
    save();closeModal();
  };
}

function renderBookings(){
  setHeader("예약","항공·숙소는 고정하고 식당·투어·마사지 등의 추가 예약만 관리합니다.");
  document.getElementById("view").innerHTML=`
    <div class="grid grid-2">
      <div class="card">
        <div class="card-head"><h3>✈ 항공</h3><span class="lock-badge">🔒 고정</span></div>
        <div class="stack">${TRIP.flights.map(f=>`<div class="item"><div class="item-title">${f.type} · ${f.flight}</div><div class="item-meta">${fmtDate(f.date,true)}<br>${f.route}<br>${f.time}</div></div>`).join("")}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>🏨 숙소</h3><span class="lock-badge">🔒 고정</span></div>
        <div class="stack">${TRIP.stays.map(s=>`<div class="item"><div class="item-title">${stayLink(s)}</div><div class="item-meta">${escapeHtml(s.city)} · ${s.in} → ${s.out}</div></div>`).join("")}</div>
      </div>
    </div>
    <div class="section card">
      <div class="card-head"><div><h3>추가 예약</h3><div class="small muted">식당, 픽업, 투어, 마사지 등</div></div><button class="btn primary" id="addBookingBtn">+ 예약 추가</button></div>
      <div class="stack">
        ${state.customBookings.length ? state.customBookings.map(b=>`<div class="item">
          <div class="row between wrap"><div><div class="item-title">${escapeHtml(b.name)}</div><div class="item-meta">${b.date||"날짜 미정"} · ${escapeHtml(b.type||"기타")} · ${escapeHtml(b.status||"예약")}</div></div><strong>${b.amount?money(b.amount):""}</strong></div>
          <div class="item-meta">예약번호 ${escapeHtml(b.confirmation||"-")} ${b.url?`· <a href="${attr(b.url)}" target="_blank" rel="noopener">예약 링크</a>`:""}</div>
          ${b.note?`<div class="small" style="margin-top:8px">${escapeHtml(b.note)}</div>`:""}
          <div style="margin-top:8px"><button class="btn small danger" data-delete-booking="${b.id}">삭제</button></div>
        </div>`).join("") : `<div class="muted small">추가 예약이 없습니다.</div>`}
      </div>
    </div>
  `;
  document.getElementById("addBookingBtn").onclick=openBookingModal;
  document.querySelectorAll("[data-delete-booking]").forEach(b=>b.onclick=()=>{
    state.customBookings=state.customBookings.filter(x=>x.id!==b.dataset.deleteBooking);save();renderBookings();
  });
}
function openBookingModal(){
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">BOOKING</div><h2>예약 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">이름<input id="bookName"></label>
      <label class="field">종류<select id="bookType"><option>식당</option><option>투어</option><option>마사지</option><option>픽업/교통</option><option>기타</option></select></label>
      <label class="field">날짜<input id="bookDate" type="date" min="${TRIP.start}" max="${TRIP.end}"></label>
      <label class="field">상태<select id="bookStatus"><option>예약 완료</option><option>예약 예정</option><option>결제 완료</option><option>현장 결제</option></select></label>
      <label class="field">예약번호<input id="bookConfirmation"></label>
      <label class="field">금액(VND)<input id="bookAmount" type="number" min="0"></label>
    </div>
    <label class="field" style="margin-top:12px">예약 URL<input id="bookUrl" type="url" placeholder="https://"></label>
    <label class="field" style="margin-top:12px">메모<textarea id="bookNote"></textarea></label>
    <div class="modal-footer"><button class="btn primary" id="saveBookingBtn">저장</button></div>
  `);
  document.getElementById("saveBookingBtn").onclick=()=>{
    const name=document.getElementById("bookName").value.trim(); if(!name)return;
    state.customBookings.push({
      id:"b-"+Date.now(),name,
      type:document.getElementById("bookType").value,
      date:document.getElementById("bookDate").value,
      status:document.getElementById("bookStatus").value,
      confirmation:document.getElementById("bookConfirmation").value.trim(),
      amount:Number(document.getElementById("bookAmount").value||0),
      url:document.getElementById("bookUrl").value.trim(),
      note:document.getElementById("bookNote").value.trim()
    });
    save();closeModal();renderBookings();
  };
}

function renderMoney(){
  setHeader("비용","VND로 입력하면 설정된 환율로 원화 환산액을 함께 표시합니다.");
  const spent=state.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const pct=Math.min(100,Math.round(spent/state.budget*100));
  const byCat={};
  state.expenses.forEach(e=>byCat[e.cat]=(byCat[e.cat]||0)+Number(e.amount||0));
  document.getElementById("view").innerHTML=`
    <div class="grid grid-4">
      ${statCard("전체 예산",money(state.budget),krw(state.budget))}
      ${statCard("사용",money(spent),krw(spent))}
      ${statCard("남음",money(Math.max(0,state.budget-spent)),krw(Math.max(0,state.budget-spent)))}
      ${statCard("환율",`1 VND = ${state.krwRate}원`,`100만 VND ≈ ${Math.round(1000000*state.krwRate).toLocaleString()}원`)}
    </div>
    <div class="section card">
      <div class="row between wrap"><div style="min-width:200px;flex:1"><div class="progress"><div style="width:${pct}%"></div></div><div class="small muted" style="margin-top:6px">${pct}% 사용</div></div>
      <div class="row wrap"><button class="btn" id="budgetBtn">예산/환율 설정</button><button class="btn primary" id="expenseBtn">+ 지출 추가</button></div></div>
    </div>
    <div class="section grid grid-2">
      <div class="card"><div class="card-head"><h3>카테고리</h3></div>
        <div class="stack">${Object.keys(byCat).length?Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row between"><span>${escapeHtml(k)}</span><span><strong>${money(v)}</strong> <span class="small muted">${krw(v)}</span></span></div>`).join(""):`<div class="muted small">지출 기록이 없습니다.</div>`}</div>
      </div>
      <div class="card"><div class="card-head"><h3>지출 내역</h3></div>
        <div class="stack">${state.expenses.length?state.expenses.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(e=>`<div class="item"><div class="row between"><div><div class="item-title">${escapeHtml(e.name)}</div><div class="item-meta">${e.date} · ${escapeHtml(e.cat)}</div></div><div style="text-align:right"><strong>${money(e.amount)}</strong><div class="small muted">${krw(e.amount)}</div></div></div><button class="btn small danger" data-delete-expense="${e.id}" style="margin-top:7px">삭제</button></div>`).join(""):`<div class="muted small">아직 기록이 없습니다.</div>`}</div>
      </div>
    </div>
  `;
  document.getElementById("expenseBtn").onclick=openExpenseModal;
  document.getElementById("budgetBtn").onclick=openBudgetModal;
  document.querySelectorAll("[data-delete-expense]").forEach(b=>b.onclick=()=>{
    state.expenses=state.expenses.filter(e=>e.id!==b.dataset.deleteExpense);save();renderMoney();
  });
}
function openExpenseModal(){
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">EXPENSE</div><h2>지출 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">날짜<input id="expDate" type="date" value="${nearestTripDate()}" min="${TRIP.start}" max="${TRIP.end}"></label>
      <label class="field">분류<select id="expCat"><option>식사</option><option>교통</option><option>카페</option><option>관광</option><option>마사지</option><option>아기</option><option>쇼핑</option><option>기타</option></select></label>
      <label class="field">내용<input id="expName"></label>
      <label class="field">금액(VND)<input id="expAmount" type="number" min="0" step="1000"></label>
    </div>
    <div class="modal-footer"><button class="btn primary" id="saveExpBtn">저장</button></div>
  `);
  document.getElementById("saveExpBtn").onclick=()=>{
    const name=document.getElementById("expName").value.trim(), amount=Number(document.getElementById("expAmount").value||0);
    if(!name||!amount)return;
    state.expenses.push({id:"e-"+Date.now(),date:document.getElementById("expDate").value,cat:document.getElementById("expCat").value,name,amount});
    save();closeModal();renderMoney();
  };
}
function openBudgetModal(){
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">BUDGET</div><h2>예산 · 환율 설정</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">전체 예산(VND)<input id="budgetValue" type="number" value="${state.budget}"></label>
      <label class="field">1 VND당 KRW<input id="rateValue" type="number" step="0.0001" value="${state.krwRate}"></label>
    </div>
    <div class="note" style="margin-top:12px">환율은 자동 계산에 사용되는 기준값입니다. 필요할 때 최신 환율로 직접 수정하세요.</div>
    <div class="modal-footer"><button class="btn primary" id="saveBudgetBtn">저장</button></div>
  `);
  document.getElementById("saveBudgetBtn").onclick=()=>{
    state.budget=Number(document.getElementById("budgetValue").value||state.budget);
    state.krwRate=Number(document.getElementById("rateValue").value||state.krwRate);
    save();closeModal();renderMoney();
  };
}

function renderMore(){
  setHeader("준비 · 생활","준비물, 아기 루틴, 긴급정보와 데이터 백업을 관리합니다.");
  document.getElementById("view").innerHTML=`
    <div class="grid grid-2">
      <div class="card">
        <div class="card-head"><h3>🧳 준비물</h3><button class="btn small" id="addCheckBtn">+ 추가</button></div>
        <div class="stack checklist">${state.checklist.map((x,i)=>`<label><input type="checkbox" data-check-index="${i}" ${state.checked[i]?"checked":""}><span>${escapeHtml(x)}</span></label>`).join("")}</div>
      </div>
      <div class="stack">
        <div class="card">
          <div class="card-head"><h3>🚨 긴급 정보</h3></div>
          <div class="stack">
            <div class="item"><div class="item-title">베트남 긴급전화</div><div class="item-meta">구급 115 · 경찰 113 · 소방 114</div></div>
            <div class="item"><div class="item-title">Vinmec Da Nang Hospital</div><div class="item-meta">다낭 소아 진료 후보 · 여행 중 최신 운영정보 확인</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>☁️ Firebase 동기화</h3><span class="badge ${cloud.user?"good":""}">${escapeHtml(cloudStatusLabel())}</span></div>
          <p class="small muted">${
            cloud.user
              ? `${escapeHtml(cloud.user.email || cloud.user.displayName || "Google 계정")}으로 로그인되어 있습니다. Mac과 iPhone에서 같은 Google 계정으로 로그인하면 가장 최근 수정본이 자동 동기화됩니다.`
              : cloud.configured
                ? "Firebase 설정은 완료되었습니다. Google 로그인 후 클라우드 동기화를 시작할 수 있습니다."
                : "현재는 이 기기의 localStorage에 저장됩니다. firebase-config.js를 설정하면 Google 계정 기반 자동 동기화를 사용할 수 있습니다."
          }</p>
          <div class="row wrap">
            <button class="btn primary" id="moreAuthBtn">${cloud.user?"Google 로그아웃":cloud.configured?"Google 로그인":"Firebase 설정 방법"}</button>
            <button class="btn" data-action="export-data">JSON 백업</button>
            <button class="btn" data-action="import-data">JSON 복원</button>
            <button class="btn danger" id="resetBtn">초기화</button>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>📱 설치형 웹앱</h3></div>
          <p class="small muted">GitHub Pages에 올린 뒤 브라우저의 “홈 화면에 추가” 기능을 사용하면 앱처럼 열 수 있습니다. 기본 화면은 오프라인 캐시됩니다.</p>
        </div>
      </div>
    </div>
  `;
  document.querySelectorAll("[data-check-index]").forEach(c=>c.onchange=()=>{state.checked[c.dataset.checkIndex]=c.checked;save();});
  document.getElementById("addCheckBtn").onclick=()=>{
    showModal(`<div class="modal-head"><h2>준비물 추가</h2><button class="btn small" data-close-modal>닫기</button></div><label class="field">항목<input id="newCheck"></label><div class="modal-footer"><button class="btn primary" id="saveCheck">추가</button></div>`);
    document.getElementById("saveCheck").onclick=()=>{const v=document.getElementById("newCheck").value.trim();if(v){state.checklist.push(v);save();closeModal();renderMore();}};
  };
  document.getElementById("moreAuthBtn").onclick=toggleFirebaseAuth;
  document.getElementById("resetBtn").onclick=()=>{if(confirm("사용자 데이터를 모두 초기화할까요?")){state=clone(DEFAULT_STATE);save();render();}};
  bindDataActions();
}

function showModal(html){
  document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  document.querySelectorAll("[data-close-modal]").forEach(b=>b.onclick=closeModal);
  document.querySelector(".modal-backdrop").onclick=e=>{if(e.target.classList.contains("modal-backdrop"))closeModal();};
}
function closeModal(){ document.getElementById("modalRoot").innerHTML=""; }

async function refreshWeather(){
  const btn=document.getElementById("weatherRefreshBtn");
  if(btn){btn.disabled=true;btn.textContent="날씨 조회 중…";}
  try{
    const results={};
    for(const city of ["호이안","다낭"]){
      const {lat,lon}=TRIP.cities[city];
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=16&timezone=Asia%2FBangkok`;
      const r=await fetch(url);
      if(!r.ok) throw new Error("weather fetch failed");
      const j=await r.json();
      const map={};
      (j.daily?.time||[]).forEach((d,i)=>{
        map[d]={
          code:j.daily.weather_code[i],
          max:Math.round(j.daily.temperature_2m_max[i]),
          min:Math.round(j.daily.temperature_2m_min[i]),
          rain:j.daily.precipitation_probability_max[i] ?? 0
        };
      });
      results[city]=map;
    }
    state.weather={fetchedAt:new Date().toISOString(),cities:results};save();render();
    const dates=ALL_DATES.filter(d=>weatherFor(d));
    if(!dates.length) alert("조회는 성공했지만 여행 날짜가 아직 16일 예보 범위 밖입니다. 출발이 가까워지면 일정표에 날씨가 표시됩니다.");
  }catch(e){
    alert("날씨를 불러오지 못했습니다. 인터넷 연결 후 다시 시도해주세요.");
  }finally{
    const b=document.getElementById("weatherRefreshBtn");
    if(b){b.disabled=false;b.textContent="☁️ 날씨 새로고침";}
  }
}

function exportData(){
  const payload={version:3,exportedAt:new Date().toISOString(),trip:TRIP,state};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`danang-hoian-trip-backup-${iso(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function bindDataActions(){
  document.querySelectorAll("[data-action='export-data']").forEach(b=>b.onclick=exportData);
  document.querySelectorAll("[data-action='import-data']").forEach(b=>b.onclick=()=>document.getElementById("importFile").click());
}
document.getElementById("importFile").addEventListener("change", async e=>{
  const file=e.target.files[0]; if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(!data.state)throw new Error();
    state=deepMerge(clone(DEFAULT_STATE),data.state);save();render();alert("데이터를 복원했습니다.");
  }catch(err){alert("올바른 백업 파일이 아닙니다.");}
  e.target.value="";
});

function escapeHtml(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function attr(v){ return escapeHtml(v); }

document.getElementById("weatherRefreshBtn").onclick=refreshWeather;
document.getElementById("authBtn").onclick=toggleFirebaseAuth;
document.getElementById("cloudStatusBtn").onclick=()=>{
  if(cloud.error){
    alert("Firebase 동기화 오류가 있습니다. 인터넷 연결, Authentication, Firestore Rules 설정을 확인해주세요.");
  }else if(!cloud.configured){
    openFirebaseSetupModal();
  }else if(cloud.user){
    const who=cloud.user.email || cloud.user.displayName || "Google 계정";
    alert(`${who}\nFirebase 자동 동기화가 활성화되어 있습니다.`);
  }else{
    alert("Firebase는 설정되어 있지만 아직 Google 로그인 전입니다.");
  }
};
document.querySelectorAll("[data-action='export-data']").forEach(b=>b.onclick=exportData);

render();
updateCloudHeader();
initFirebaseSync();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
