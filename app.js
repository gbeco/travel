
"use strict";

const DEFAULT_TRIP = {
  start: "2026-11-16",
  end: "2026-12-22",
  flights: [
    { id:"flight-out", type:"출국", date:"2026-11-16", flight:"KE457", route:"인천공항 T2 → 다낭", time:"11:10 → 14:15" },
    { id:"flight-in", type:"귀국", date:"2026-12-21", flight:"KE460", route:"다낭 → 인천공항", time:"23:00 → 05:20(+1)" }
  ],
  stays: [
    { id:"stay-1", name:"실크 센스 호이안 리버 리조트", city:"호이안", in:"2026-11-16", out:"2026-11-20", mapQuery:"Silk Sense Hoi An River Resort" },
    { id:"stay-2", name:"Eco & Rustic Home Hoian", city:"호이안", in:"2026-11-20", out:"2026-11-27", mapQuery:"Eco & Rustic Home Hoian" },
    { id:"stay-3", name:"Angel Garden Villa", city:"다낭", in:"2026-11-27", out:"2026-11-30", mapQuery:"Angel Garden Villa Hoian" },
    { id:"stay-4", name:"Vernal Hotel & Apartment", city:"다낭", in:"2026-11-30", out:"2026-12-07", mapQuery:"Vernal Hotel & Apartment Da Nang" },
    { id:"stay-5", name:"TA Boutique Hotel", city:"다낭", in:"2026-12-07", out:"2026-12-14", mapQuery:"TA Boutique Hotel Da Nang" },
    { id:"stay-6", name:"땀 하우스 & 빌라 호텔", city:"다낭", in:"2026-12-14", out:"2026-12-21", mapQuery:"Tam House Villa Hotel Da Nang" }
  ],
  companions: [
    { id:"family-inlaws", label:"장인·장모님", stayId:"stay-4", in:"2026-11-29", out:"2026-12-03" }
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
"2026-11-20":{a:"실크 센스 체크아웃 → Eco & Rustic 체크인 · 숙소 적응",b:"숙소 이동 후 근처 식사",c:"체크인 후 휴식",selected:"A"},
"2026-11-21":{a:"올드타운 재방문 · 시장 · 저녁",b:"저녁 식사만 외출",c:"숙소 휴식",selected:"B"},
"2026-11-22":{a:"휴식 · 빨래 · 장보기",b:"동일",c:"동일",selected:"A"},
"2026-11-23":{a:"Eco & Rustic 생활일 · 장보기 · 카페",b:"점심 외출",c:"숙소 휴식",selected:"A"},
"2026-11-24":{a:"현지생활 · 마트 · 카페",b:"점심 외출",c:"완전 휴식",selected:"A"},
"2026-11-25":{a:"짜꾸에 채소마을",b:"논길 드라이브 · 점심",c:"카페 · 올드타운 실내",selected:"A"},
"2026-11-26":{a:"올드타운 카페 · 식사",b:"마사지",c:"완전 휴식",selected:"B"},
"2026-11-27":{a:"Eco & Rustic 체크아웃 → Angel Garden Villa 체크인",b:"숙소 이동 후 주변 산책",c:"체크인 후 휴식",selected:"A"},
"2026-11-28":{a:"안방비치 재방문",b:"호이안 시내",c:"카페",selected:"B"},
"2026-11-29":{a:"Angel Garden Villa 휴식 · 장인·장모님 Vernal 체크인",b:"장인·장모님과 저녁 합류",c:"각 숙소에서 휴식",selected:"A"},
"2026-11-30":{a:"Angel Garden Villa 체크아웃 → Vernal 체크인 · 장인·장모님 합류",b:"Vernal 체크인 · 함께 저녁",c:"체크인 후 휴식",selected:"A"},
"2026-12-01":{a:"미케비치 · 생활권 탐색",b:"카페",c:"완전 휴식",selected:"A"},
"2026-12-02":{a:"한시장 · 다낭 시내 · 한강",b:"시내 점심만",c:"쇼핑몰",selected:"A"},
"2026-12-03":{a:"장인·장모님 Vernal 체크아웃 · 참 조각 박물관 · 카페",b:"함께 점심 후 배웅 · 쇼핑",c:"배웅 후 휴식",selected:"A"},
"2026-12-04":{a:"손짜반도 · 영응사",b:"영응사까지만",c:"시내 일정으로 교체",selected:"A"},
"2026-12-05":{a:"오후 휴식 → 용다리 후보",b:"저녁 식사 + 용다리",c:"호텔",selected:"B"},
"2026-12-06":{a:"자유 · 마사지",b:"카페",c:"완전 휴식",selected:"A"},
"2026-12-07":{a:"Vernal 체크아웃 → TA Boutique Hotel 체크인",b:"체크인 후 주변 산책",c:"체크인 후 휴식",selected:"A"},
"2026-12-08":{a:"TA Boutique 주변 생활권 탐색 · 미케비치",b:"주변 카페",c:"객실 휴식",selected:"A"},
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
  {id:"p15",city:"다낭",cat:"카페",name:"Login Coffee",priority:"○ 시간되면",note:"다낭 카페 후보",map:"Login Coffee Nguyen Van Thoai Da Nang"}
];

const DEFAULT_PACKING = {
  groups: {
    checked: {
      common: [
        {id:"bag-common-toiletries",label:"세면도구"},
        {id:"bag-common-laundry",label:"세탁용품"},
        {id:"bag-common-packing",label:"여분 지퍼백 / 파우치"}
      ],
      parents: [
        {id:"bag-parents-clothes",label:"부모 의류 / 속옷"},
        {id:"bag-parents-swim",label:"수영복"},
        {id:"bag-parents-cosmetics",label:"화장품 / 스킨케어"}
      ],
      hajin: [
        {id:"bag-hajin-clothes",label:"하진 옷 / 잠옷"},
        {id:"bag-hajin-diapers",label:"여분 기저귀"},
        {id:"bag-hajin-toiletries",label:"아기 세면용품"},
        {id:"bag-hajin-food",label:"여분 이유식 / 간식"}
      ]
    },
    carry: {
      common: [
        {id:"carry-common-passport",label:"여권"},
        {id:"carry-common-insurance",label:"여행자보험"},
        {id:"carry-common-medicine",label:"상비약"},
        {id:"carry-common-charger",label:"휴대폰 충전기 / 케이블"}
      ],
      parents: [
        {id:"carry-parents-wallet",label:"지갑 / 카드 / 현금"},
        {id:"carry-parents-medicine",label:"개인 복용약"},
        {id:"carry-parents-earphones",label:"이어폰"}
      ],
      hajin: [
        {id:"carry-hajin-formula",label:"아기 분유"},
        {id:"carry-hajin-solids",label:"이유식"},
        {id:"carry-hajin-diaper",label:"기저귀"},
        {id:"carry-hajin-wipes",label:"물티슈"},
        {id:"carry-hajin-clothes",label:"여벌 옷"},
        {id:"carry-hajin-carrier",label:"유모차 / 아기띠"},
        {id:"carry-hajin-bottle",label:"젖병 / 물병"}
      ]
    }
  },
  checked: {}
};

const DEFAULT_STATE = {
  trip: DEFAULT_TRIP,
  dayPlans: DEFAULT_DAY_PLANS,
  dayNotes: {},
  baby: {},
  places: DEFAULT_PLACES,
  customBookings: [],
  expenses: [],
  budget: 75000000,
  krwRate: 0.0524,
  packing: DEFAULT_PACKING,
  checklist: ["여권","여행자보험","아기 분유","이유식","기저귀","물티슈","상비약","충전기","유모차/아기띠"],
  checked: {},
  weather: { fetchedAt:null, cities:{} },
  _meta: { updatedAt: 0, tripDataVersion: 0 }
};

const PACKING_DATA_VERSION = 2026111002;
const LEGACY_PACKING_MAP = {
  "여권":"carry-common-passport",
  "여행자보험":"carry-common-insurance",
  "아기 분유":"carry-hajin-formula",
  "이유식":"carry-hajin-solids",
  "기저귀":"carry-hajin-diaper",
  "물티슈":"carry-hajin-wipes",
  "상비약":"carry-common-medicine",
  "충전기":"carry-common-charger",
  "유모차/아기띠":"carry-hajin-carrier"
};

let state = loadState();
migratePackingData(state);
persistLocal();
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
  schedulePrivateWrite();
  schedulePublicWrite();
}
function savePrivateOnly(){
  state._meta = state._meta || {};
  state._meta.updatedAt = Date.now();
  persistLocal();
  schedulePrivateWrite();
}


const LATEST_TRIP_DATA_VERSION = 20261109;
const PUBLIC_SCHEMA_VERSION = 2;

function migrateTripData(target){
  target._meta = target._meta || {};
  const currentVersion = Number(target._meta.tripDataVersion || 0);
  if(currentVersion >= LATEST_TRIP_DATA_VERSION && target.trip) return false;

  // One-time migration from legacy hard-coded/public trip data to the latest
  // confirmed itinerary. After this version is stored, Firestore becomes the
  // source of truth and later admin edits are not overwritten by defaults.
  target.trip = clone(DEFAULT_TRIP);
  target._meta.tripDataVersion = LATEST_TRIP_DATA_VERSION;
  return true;
}

const ITINERARY_MIGRATION_20261020 = {
  "2026-11-20": { old:{a:"안방비치 · 점심 · 카페",b:"해변 카페만",c:"마사지 · 카페"}, next:{a:"실크 센스 체크아웃 → Eco & Rustic 체크인 · 숙소 적응",b:"숙소 이동 후 근처 식사",c:"체크인 후 휴식"} },
  "2026-11-23": { old:{a:"숙소 이동 · 장보기 · 휴식",b:"체크인 후 카페",c:"숙소 휴식"}, next:{a:"Eco & Rustic 생활일 · 장보기 · 카페",b:"점심 외출",c:"숙소 휴식"} },
  "2026-11-27": { old:{a:"깜탄 코코넛마을",b:"짧은 보트 체험",c:"비 오면 취소"}, next:{a:"Eco & Rustic 체크아웃 → Angel Garden Villa 체크인",b:"숙소 이동 후 주변 산책",c:"체크인 후 휴식"} },
  "2026-11-29": { old:{a:"호이안 마지막 휴식 · 선물 쇼핑",b:"숙소 주변만",c:"완전 휴식"}, next:{a:"Angel Garden Villa 휴식 · 장인·장모님 Vernal 체크인",b:"장인·장모님과 저녁 합류",c:"각 숙소에서 휴식"} },
  "2026-11-30": { old:{a:"호이안 → 다낭 이동 · 체크인",b:"체크인 · 장보기",c:"숙소 휴식"}, next:{a:"Angel Garden Villa 체크아웃 → Vernal 체크인 · 장인·장모님 합류",b:"Vernal 체크인 · 함께 저녁",c:"체크인 후 휴식"} },
  "2026-12-03": { old:{a:"참 조각 박물관 · 카페",b:"쇼핑 · 카페",c:"완전 휴식"}, next:{a:"장인·장모님 Vernal 체크아웃 · 참 조각 박물관 · 카페",b:"함께 점심 후 배웅 · 쇼핑",c:"배웅 후 휴식"} },
  "2026-12-07": { old:{a:"Risemount 이동 · 리조트 휴식",b:"체크인 후 주변 산책",c:"완전 휴식"}, next:{a:"Vernal 체크아웃 → TA Boutique Hotel 체크인",b:"체크인 후 주변 산책",c:"체크인 후 휴식"} },
  "2026-12-08": { old:{a:"리조트 · 수영 · 해변",b:"주변 카페",c:"객실 휴식"}, next:{a:"TA Boutique 주변 생활권 탐색 · 미케비치",b:"주변 카페",c:"객실 휴식"} }
};
function migrateCurrentItinerary(target){
  target._meta = target._meta || {};
  if(Number(target._meta.itineraryVersion||0) >= 20261020) return false;
  target.dayPlans = target.dayPlans || {};
  let changed=false;
  Object.entries(ITINERARY_MIGRATION_20261020).forEach(([date,m])=>{
    if(!target.dayPlans[date]){
      target.dayPlans[date]=clone(DEFAULT_DAY_PLANS[date]);
      changed=true;
      return;
    }
    ["a","b","c"].forEach(k=>{
      if(target.dayPlans[date][k]===m.old[k]){
        target.dayPlans[date][k]=m.next[k];
        changed=true;
      }
    });
  });
  target._meta.itineraryVersion=20261020;
  return changed;
}

function migratePackingData(target){
  target._meta = target._meta || {};
  if(Number(target._meta.packingVersion||0) >= PACKING_DATA_VERSION && target.packing) return false;

  if(!target.packing || !target.packing.groups){
    target.packing = clone(DEFAULT_PACKING);
  }else{
    target.packing = deepMerge(clone(DEFAULT_PACKING), target.packing);
  }
  target.packing.checked = target.packing.checked || {};

  const legacy = Array.isArray(target.checklist) ? target.checklist : [];
  const legacyChecked = target.checked || {};
  legacy.forEach((label,index)=>{
    let id=LEGACY_PACKING_MAP[label];
    if(!id){
      id=`legacy-packing-${index}`;
      const exists=target.packing.groups.checked.common.some(x=>x.id===id || x.label===label);
      if(!exists) target.packing.groups.checked.common.push({id,label,qty:1});
    }
    if(legacyChecked[index]) target.packing.checked[id]=true;
  });

  // v19: every packing item carries an editable quantity.
  ["checked","carry"].forEach(section=>{
    ["common","parents","hajin"].forEach(group=>{
      const items=target.packing?.groups?.[section]?.[group] || [];
      items.forEach(item=>{
        const qty=Number.parseInt(item.qty,10);
        item.qty=Number.isFinite(qty) ? Math.min(999,Math.max(1,qty)) : 1;
      });
    });
  });

  target._meta.packingVersion=PACKING_DATA_VERSION;
  return true;
}

const PUBLIC_TRIP_PATH = ["publicTrips", "main"];
const PUBLIC_KEYS = ["trip", "dayPlans", "dayNotes", "places"];

const cloud = {
  configured: false,
  loading: true,
  user: null,
  isAdmin: false,
  adminChecked: false,
  adminCheckError: null,
  auth: null,
  db: null,
  privateDocRef: null,
  publicDocRef: null,
  adminDocRef: null,
  sdk: null,
  privateUnsubscribe: null,
  publicUnsubscribe: null,
  privateWriteTimer: null,
  publicWriteTimer: null,
  status: "Firebase 확인 중",
  publicLoaded: false,
  publicExists: false,
  publicUpdatedAt: 0,
  lastSyncedAt: null,
  error: null
};

function isFirebaseConfigured(config){
  if(!config || typeof config !== "object") return false;
  const required = ["apiKey","authDomain","projectId","appId"];
  return required.every(k => config[k] && !String(config[k]).includes("YOUR_"));
}

function canEditShared(){
  return !!(cloud.configured && cloud.user && cloud.isAdmin);
}

function cloudStatusLabel(){
  if(cloud.loading) return "☁️ Firebase 확인 중";
  if(!cloud.configured) return "💾 로컬 일정";
  if(cloud.error && !cloud.publicLoaded) return "⚠️ 공용 일정 오류";
  if(cloud.status === "syncing" && canEditShared()) return "☁️ 관리자 동기화 중…";
  if(canEditShared()) return "☁️ 관리자 · 공용 일정 동기화됨";
  if(cloud.user && cloud.adminChecked && !cloud.isAdmin) return "⚠️ 관리자 권한 없음";
  if(cloud.publicLoaded && !cloud.publicExists) return "☁️ 공용 일정 준비 중";
  if(cloud.publicLoaded) return "☁️ 공용 일정 최신";
  return "☁️ 공용 일정 연결 중…";
}

function updateCloudHeader(){
  const statusBtn = document.getElementById("cloudStatusBtn");
  const authBtn = document.getElementById("authBtn");
  const homeStatusBtn = document.getElementById("homeCloudStatusBtn");
  const homeAuthBtn = document.getElementById("homeAuthBtn");
  const label=cloudStatusLabel();
  if(statusBtn) statusBtn.textContent = label;
  if(homeStatusBtn) homeStatusBtn.textContent = canEditShared() ? "↻ 동기화됨" : (cloud.publicLoaded ? "↻ 일정 최신" : "↻ 연결 중");
  const authText=!cloud.configured ? "Firebase 설정" : cloud.user ? (canEditShared()?"관리자":"계정") : "로그인";
  if(authBtn){
    if(!cloud.configured){
      authBtn.textContent = "Firebase 설정";
    }else if(cloud.user){
      authBtn.textContent = canEditShared() ? "관리자 로그아웃" : "다른 계정";
      authBtn.title = cloud.user.email || cloud.user.displayName || "";
    }else{
      authBtn.textContent = "관리자 로그인";
      authBtn.title = "일정 수정은 관리자 로그인 후 가능합니다.";
    }
  }
  if(homeAuthBtn){
    homeAuthBtn.textContent=authText;
    homeAuthBtn.title=cloud.user ? (cloud.user.email||cloud.user.displayName||"") : "관리자 로그인";
  }
  document.querySelectorAll("[data-action='export-data']").forEach(btn=>{
    if(btn.closest('.top-actions')) btn.style.display = canEditShared() ? "" : "none";
  });
  document.querySelectorAll("[data-home-export]").forEach(btn=>btn.style.display=canEditShared()?"":"none");
}

function publicPayload(){
  return {
    trip: clone(state.trip || DEFAULT_TRIP),
    dayPlans: clone(state.dayPlans || {}),
    dayNotes: clone(state.dayNotes || {}),
    places: clone(state.places || [])
  };
}

function applyPublicData(publicState, updatedAtClient=0, schemaVersion=1){
  if(!publicState || typeof publicState !== "object") return;
  PUBLIC_KEYS.forEach(key=>{
    if(publicState[key] !== undefined) state[key] = clone(publicState[key]);
  });
  state._meta = state._meta || {};

  // Legacy publicTrips/main documents (schemaVersion 1) may still contain
  // an old hotel schedule. Correct it locally for every viewer immediately.
  // When an admin is signed in, the corrected payload is written back once
  // as schemaVersion 2 so Firestore remains the source of truth afterwards.
  const needsPublicTripMigration = Number(schemaVersion || 1) < PUBLIC_SCHEMA_VERSION;
  let migrated = false;
  if(needsPublicTripMigration){
    migrated = migrateTripData(state) || migrated;
    migrated = migrateCurrentItinerary(state) || migrated;
  }

  state._meta.publicUpdatedAt = Number(updatedAtClient || 0);
  cloud.publicUpdatedAt = Number(updatedAtClient || 0);
  cloud.publicLoaded = true;
  cloud.publicExists = true;
  cloud.status = "synced";
  cloud.error = null;
  persistLocal();
  updateCloudHeader();
  render();

  if(migrated && canEditShared()){
    schedulePrivateWrite();
    schedulePublicWrite();
  }
}

function stripPrivateForViewer(){
  const publicCopy={};
  PUBLIC_KEYS.forEach(key=>publicCopy[key]=clone(state[key]));
  const weather=clone(state.weather||DEFAULT_STATE.weather);
  state=clone(DEFAULT_STATE);
  PUBLIC_KEYS.forEach(key=>state[key]=publicCopy[key]);
  state.weather=weather;
  state._meta=state._meta||{};
  state._meta.publicUpdatedAt=cloud.publicUpdatedAt||0;
  persistLocal();
}

function mergePrivateState(privateState){
  if(!privateState || typeof privateState !== "object") return;
  const preservedPublic = {};
  PUBLIC_KEYS.forEach(key=>preservedPublic[key]=clone(state[key]));
  const merged = deepMerge(clone(DEFAULT_STATE), privateState);
  PUBLIC_KEYS.forEach(key=>merged[key]=preservedPublic[key]);
  state = merged;
  migrateTripData(state);
  migrateCurrentItinerary(state);
  migratePackingData(state);
  persistLocal();
}

async function pushPrivateState(){
  if(!canEditShared() || !cloud.privateDocRef || !cloud.sdk) return;
  try{
    const updatedAtClient = Number(state._meta?.updatedAt || Date.now());
    await cloud.sdk.setDoc(cloud.privateDocRef, {
      schemaVersion: 7,
      state,
      updatedAtClient,
      updatedAt: cloud.sdk.serverTimestamp()
    });
  }catch(err){
    console.error("Firebase private sync write failed", err);
    cloud.error = err;
  }
}

async function pushPublicState(){
  if(!canEditShared() || !cloud.publicDocRef || !cloud.sdk) return;
  cloud.status = "syncing";
  cloud.error = null;
  updateCloudHeader();
  try{
    const updatedAtClient = Date.now();
    state._meta = state._meta || {};
    state._meta.publicUpdatedAt = updatedAtClient;
    await cloud.sdk.setDoc(cloud.publicDocRef, {
      schemaVersion: PUBLIC_SCHEMA_VERSION,
      publicState: publicPayload(),
      updatedAtClient,
      updatedAt: cloud.sdk.serverTimestamp()
    });
    cloud.publicExists = true;
    cloud.publicLoaded = true;
    cloud.publicUpdatedAt = updatedAtClient;
    cloud.status = "synced";
    cloud.lastSyncedAt = Date.now();
    persistLocal();
  }catch(err){
    console.error("Firebase public sync write failed", err);
    cloud.status = "error";
    cloud.error = err;
  }
  updateCloudHeader();
}

function schedulePrivateWrite(){
  if(!canEditShared() || !cloud.privateDocRef) return;
  clearTimeout(cloud.privateWriteTimer);
  cloud.privateWriteTimer = setTimeout(pushPrivateState, 700);
}

function schedulePublicWrite(){
  if(!canEditShared() || !cloud.publicDocRef) return;
  clearTimeout(cloud.publicWriteTimer);
  cloud.publicWriteTimer = setTimeout(pushPublicState, 700);
}

function subscribePublicTrip(){
  if(!cloud.publicDocRef || !cloud.sdk) return;
  if(cloud.publicUnsubscribe) cloud.publicUnsubscribe();
  cloud.publicUnsubscribe = cloud.sdk.onSnapshot(
    cloud.publicDocRef,
    { includeMetadataChanges: true },
    snap=>{
      if(!snap.exists()){
        cloud.publicLoaded = true;
        cloud.publicExists = false;
        updateCloudHeader();
        return;
      }
      if(snap.metadata.hasPendingWrites) return;
      const remote=snap.data();
      const remoteUpdatedAt=Number(remote.updatedAtClient||0);
      if(remoteUpdatedAt >= cloud.publicUpdatedAt){
        applyPublicData(remote.publicState, remoteUpdatedAt, Number(remote.schemaVersion||1));
      }
    },
    err=>{
      console.error("Public trip subscription failed",err);
      cloud.error=err;
      cloud.publicLoaded=false;
      updateCloudHeader();
    }
  );
}

async function checkAdminRole(user){
  cloud.adminChecked=false;
  cloud.isAdmin=false;
  cloud.adminCheckError=null;
  if(!user || !cloud.sdk || !cloud.db) return false;
  try{
    // Refresh the Firebase Auth token before checking Firestore.
    // This avoids a stale auth session being mistaken for a viewer session.
    if(typeof user.getIdToken === "function") await user.getIdToken(true);
    cloud.adminDocRef=cloud.sdk.doc(cloud.db,"admins",user.uid);
    const snap=await cloud.sdk.getDoc(cloud.adminDocRef);
    cloud.isAdmin=snap.exists();
  }catch(err){
    console.error("Admin role check failed",err);
    cloud.adminCheckError=err;
    cloud.isAdmin=false;
  }
  cloud.adminChecked=true;
  updateCloudHeader();
  return cloud.isAdmin;
}

async function recheckAdminRole(){
  if(!cloud.user) return toggleFirebaseAuth();
  const ok=await checkAdminRole(cloud.user);
  if(ok){
    await connectAdminUser(cloud.user);
    alert("관리자 권한을 확인했습니다. 수정 모드로 전환되었습니다.");
  }else{
    render();
  }
}

async function copyCurrentUid(){
  if(!cloud.user) return;
  try{
    await navigator.clipboard.writeText(cloud.user.uid);
    alert("현재 Firebase UID를 복사했습니다.");
  }catch(err){
    prompt("아래 UID를 복사하세요.",cloud.user.uid);
  }
}

async function connectAdminUser(user){
  cloud.user=user;
  cloud.error=null;
  updateCloudHeader();

  if(cloud.privateUnsubscribe){
    cloud.privateUnsubscribe();
    cloud.privateUnsubscribe=null;
  }

  const {doc,getDoc,onSnapshot}=cloud.sdk;
  cloud.privateDocRef=doc(cloud.db,"users",user.uid,"tripData","current");

  try{
    const [privateSnap, publicSnap] = await Promise.all([
      getDoc(cloud.privateDocRef),
      getDoc(cloud.publicDocRef)
    ]);

    if(publicSnap.exists()){
      const pub=publicSnap.data();
      applyPublicData(pub.publicState, Number(pub.updatedAtClient||0), Number(pub.schemaVersion||1));
      if(privateSnap.exists()) mergePrivateState(privateSnap.data().state);
    }else if(privateSnap.exists()){
      const remote=privateSnap.data();
      state=deepMerge(clone(DEFAULT_STATE),remote.state||{});
      migrateTripData(state);
      migrateCurrentItinerary(state);
      persistLocal();
      await pushPublicState();
    }else{
      migrateTripData(state);
      migrateCurrentItinerary(state);
      persistLocal();
      await Promise.all([pushPrivateState(),pushPublicState()]);
    }

    cloud.privateUnsubscribe=onSnapshot(
      cloud.privateDocRef,
      {includeMetadataChanges:true},
      snap2=>{
        if(!snap2.exists() || snap2.metadata.hasPendingWrites) return;
        const remoteDoc=snap2.data();
        const remoteUpdatedAt=Number(remoteDoc.updatedAtClient||0);
        const localUpdatedAt=Number(state._meta?.updatedAt||0);

        // Firestore sends a server acknowledgement after our own write.
        // Re-rendering for that acknowledgement resets the page scroll position.
        // Only re-render when a genuinely newer update arrived from another device.
        if(remoteUpdatedAt && remoteUpdatedAt <= localUpdatedAt){
          cloud.status="synced";
          cloud.lastSyncedAt=Date.now();
          updateCloudHeader();
          return;
        }

        const y=window.scrollY;
        mergePrivateState(remoteDoc.state);
        cloud.status="synced";
        cloud.lastSyncedAt=Date.now();
        updateCloudHeader();
        render();
        requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:"auto"}));
      },
      err=>{
        console.error("Private snapshot failed",err);
        cloud.error=err;
        updateCloudHeader();
      }
    );

    await pushPrivateState();
    cloud.status="synced";
    updateCloudHeader();
    render();
  }catch(err){
    console.error("Firebase admin sync failed",err);
    cloud.error=err;
    cloud.status="error";
    updateCloudHeader();
  }
}

async function initFirebaseSync(){
  try{
    const configModule=await import("./firebase-config.js");
    const config=configModule.firebaseConfig;
    cloud.configured=isFirebaseConfigured(config);
    cloud.loading=false;
    updateCloudHeader();
    if(!cloud.configured) return;

    const VERSION="12.19.0";
    const [appMod,authMod,firestoreMod]=await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-firestore.js`)
    ]);

    const firebaseApp=appMod.initializeApp(config);
    cloud.auth=authMod.getAuth(firebaseApp);
    cloud.db=firestoreMod.getFirestore(firebaseApp);
    try{ await authMod.setPersistence(cloud.auth,authMod.browserLocalPersistence); }catch(e){ console.warn("Auth persistence",e); }
    cloud.sdk={
      GoogleAuthProvider:authMod.GoogleAuthProvider,
      signInWithPopup:authMod.signInWithPopup,
      signOut:authMod.signOut,
      doc:firestoreMod.doc,
      getDoc:firestoreMod.getDoc,
      setDoc:firestoreMod.setDoc,
      onSnapshot:firestoreMod.onSnapshot,
      serverTimestamp:firestoreMod.serverTimestamp
    };

    cloud.publicDocRef=firestoreMod.doc(cloud.db,...PUBLIC_TRIP_PATH);
    subscribePublicTrip();

    authMod.onAuthStateChanged(cloud.auth,async user=>{
      cloud.user=user||null;
      cloud.adminChecked=false;
      cloud.isAdmin=false;
      if(cloud.privateUnsubscribe){
        cloud.privateUnsubscribe();
        cloud.privateUnsubscribe=null;
      }
      cloud.privateDocRef=null;

      if(user){
        const admin=await checkAdminRole(user);
        if(admin){
          await connectAdminUser(user);
        }else{
          stripPrivateForViewer();
          cloud.status="viewer";
          updateCloudHeader();
          render();
        }
      }else{
        stripPrivateForViewer();
        cloud.status=cloud.publicLoaded?"synced":"viewer";
        cloud.error=null;
        updateCloudHeader();
        render();
      }
    });
  }catch(err){
    console.error("Firebase initialization failed",err);
    cloud.loading=false;
    cloud.error=err;
    updateCloudHeader();
  }
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
    try{ await cloud.sdk.signOut(cloud.auth); }
    catch(err){ alert("로그아웃하지 못했습니다."); }
    return;
  }
  const provider=new cloud.sdk.GoogleAuthProvider();
  try{
    await cloud.sdk.signInWithPopup(cloud.auth,provider);
  }catch(err){
    console.error("Google sign-in failed",err);
    alert("관리자 Google 로그인에 실패했습니다. Firebase Authentication 설정을 확인해주세요.");
  }
}

function openFirebaseSetupModal(){
  showModal(`
    <div class="modal-head">
      <div><div class="eyebrow">FIREBASE</div><h2>공용 일정 동기화 설정</h2></div>
      <button class="btn small" data-close-modal>닫기</button>
    </div>
    <div class="stack">
      <div class="item"><div class="item-title">1. 공개 일정 문서</div><div class="item-meta">로그인하지 않은 사용자는 publicTrips/main 문서를 읽어 최신 일정을 봅니다.</div></div>
      <div class="item"><div class="item-title">2. 관리자 권한</div><div class="item-meta">Firestore에 admins/{관리자UID} 문서를 한 번 생성하면 그 Google 계정만 공용 일정을 수정할 수 있습니다.</div></div>
      <div class="item"><div class="item-title">3. Security Rules</div><div class="item-meta">firestore.rules를 Firebase Console의 Rules 탭에 적용해야 합니다.</div></div>
    </div>
    <div class="note" style="margin-top:14px">상세 과정은 FIREBASE_SETUP.md의 “공용 읽기 + 관리자 쓰기” 항목을 확인하세요.</div>
  `);
}

function showAdminGate(title="관리자 전용"){
  const signedIn=!!cloud.user;
  const denied=signedIn && cloud.adminChecked && !cloud.isAdmin;
  const error=cloud.adminCheckError;
  document.getElementById("view").innerHTML=`
    <div class="card">
      <div class="card-head">
        <h3>${escapeHtml(title)}</h3>
        <span class="badge ${denied?"warn":""}">${denied?"관리자 권한 없음":"로그인 필요"}</span>
      </div>
      ${signedIn?`
        <p class="muted">Google 로그인은 완료됐지만 현재 계정이 Firestore의 <code>admins/{UID}</code> 관리자 문서로 확인되지 않았습니다.</p>
        <div class="item">
          <div class="item-title">현재 로그인 계정</div>
          <div class="item-meta">${escapeHtml(cloud.user.email || cloud.user.displayName || "Google 계정")}</div>
          <div class="item-meta" style="word-break:break-all;margin-top:5px">UID: ${escapeHtml(cloud.user.uid)}</div>
          ${error?`<div class="item-meta" style="color:var(--danger);margin-top:6px">권한 확인 오류: ${escapeHtml(error.code || error.message || String(error))}</div>`:""}
        </div>
        <div class="note" style="margin-top:12px">Firebase Console → Firestore Database → Data에서 <strong>admins</strong> 컬렉션의 문서 ID가 위 UID와 정확히 같은지 확인하세요. 필드는 <code>role = admin</code> 정도면 충분합니다.</div>
        <div class="row wrap" style="margin-top:14px">
          <button class="btn primary" id="adminGateRecheckBtn">관리자 권한 다시 확인</button>
          <button class="btn" id="adminGateCopyUidBtn">UID 복사</button>
          <button class="btn" id="adminGateLogoutBtn">다른 계정으로 로그인</button>
        </div>
      `:`
        <p class="muted">이 화면의 개인 관리 정보는 공개하지 않습니다. 수정이 필요한 경우 관리자 Google 계정으로 로그인하세요.</p>
        <button class="btn primary" id="adminGateLoginBtn">관리자 로그인</button>
      `}
    </div>`;
  const login=document.getElementById("adminGateLoginBtn");
  if(login) login.onclick=toggleFirebaseAuth;
  const recheck=document.getElementById("adminGateRecheckBtn");
  if(recheck) recheck.onclick=recheckAdminRole;
  const copy=document.getElementById("adminGateCopyUidBtn");
  if(copy) copy.onclick=copyCurrentUid;
  const logout=document.getElementById("adminGateLogoutBtn");
  if(logout) logout.onclick=toggleFirebaseAuth;
}

function tripData(){
  if(!state.trip) state.trip = clone(DEFAULT_TRIP);
  state.trip.flights = state.trip.flights || [];
  state.trip.stays = state.trip.stays || [];
  state.trip.companions = state.trip.companions || [];
  state.trip.cities = state.trip.cities || clone(DEFAULT_TRIP.cities);
  return state.trip;
}
function parseDate(s){ return new Date(s+"T00:00:00"); }
function iso(d){ return new Date(d).toISOString().slice(0,10); }
function dateRange(a,b){
  const out=[], d=parseDate(a), e=parseDate(b);
  while(d<=e){ out.push(iso(d)); d.setDate(d.getDate()+1); }
  return out;
}
function allDates(){
  const t=tripData();
  return dateRange(t.start,t.end);
}
function tripDays(){
  const t=tripData();
  return Math.round((parseDate(t.end)-parseDate(t.start))/86400000)+1;
}
function fmtDate(s, long=false){
  return parseDate(s).toLocaleDateString("ko-KR", long
    ? {year:"numeric",month:"long",day:"numeric",weekday:"short"}
    : {month:"numeric",day:"numeric",weekday:"short"});
}
function currentStay(date){
  return tripData().stays.find(s=>date>=s.in && date<s.out) || null;
}
function cityForDate(date){
  const t=tripData();
  return currentStay(date)?.city || (date===t.end ? "한국" : "다낭");
}
function nightsBetween(start,end){
  return Math.round((parseDate(end)-parseDate(start))/86400000);
}
function cityStayStats(city){
  const stays=tripData().stays.filter(s=>s.city===city).slice().sort((a,b)=>a.in.localeCompare(b.in));
  return {
    nights:stays.reduce((sum,s)=>sum+nightsBetween(s.in,s.out),0),
    start:stays.length?stays[0].in:null,
    end:stays.length?stays[stays.length-1].out:null
  };
}
function companionStay(companion){
  return tripData().stays.find(s=>s.id===companion.stayId) || null;
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
  tripData().stays.forEach(stay=>{
    const safeName = escapeHtml(stay.name);
    html = html.split(safeName).join(stayLink(stay));
  });
  return html;
}
function lockedEvents(date){
  const t=tripData();
  const events=[];
  t.flights.filter(f=>f.date===date).forEach(f=>events.push(`✈ ${f.flight} · ${f.time}`));
  t.stays.forEach(stay=>{
    if(stay.in===date) events.push(`🔒 체크인 · ${stay.name}`);
    if(stay.out===date) events.push(`🔒 체크아웃 · ${stay.name}`);
  });
  (t.companions || []).forEach(c=>{
    const stay=companionStay(c);
    const stayName=stay?.name || "동행 숙소";
    if(c.in===date) events.push(`👪 ${c.label} 체크인 · ${stayName}`);
    else if(c.out===date) events.push(`👪 ${c.label} 체크아웃 · ${stayName}`);
    else if(date>c.in && date<c.out) events.push(`👪 ${c.label} 함께 · ${stayName}`);
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
  const t=tripData(), start=parseDate(t.start), end=parseDate(t.end);
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
    btn.onclick=()=>{ activeView=btn.dataset.view; render({preserveScroll:false}); window.scrollTo({top:0,behavior:"smooth"}); };
  });
}

function setHeader(title,subtitle){
  document.getElementById("tripStatus").textContent=tripStatusText();
  document.getElementById("pageTitle").textContent=title;
  document.getElementById("pageSubtitle").textContent=subtitle;
}

function restoreScrollPosition(y){
  const top=Math.max(0,Number(y)||0);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    window.scrollTo({top,left:0,behavior:"auto"});
  }));
}

function rerenderPreservingScroll(renderFn){
  const y=window.scrollY;
  renderFn();
  restoreScrollPosition(y);
}

function render(options={}){
  const preserveScroll=options.preserveScroll!==false;
  const y=preserveScroll?window.scrollY:0;
  document.body.classList.toggle("home-portal",activeView==="home");
  document.body.dataset.view=activeView;
  bindNavigation();
  const renders={home:renderHome,calendar:renderCalendar,places:renderPlaces,bookings:renderBookings,money:renderMoney,more:renderMore};
  renders[activeView]();
  if(preserveScroll) restoreScrollPosition(y);
}

function nearestTripDate(){
  const today=iso(new Date());
  if(today<tripData().start) return tripData().start;
  if(today>tripData().end) return tripData().end;
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

function tripProgressInfo(){
  const t=tripData(), today=new Date(); today.setHours(0,0,0,0);
  const start=parseDate(t.start), end=parseDate(t.end), total=tripDays();
  if(today<start) return {day:0,total,pct:0,label:tripStatusText()};
  if(today>end) return {day:total,total,pct:100,label:"여행 완료"};
  const day=Math.floor((today-start)/86400000)+1;
  return {day,total,pct:Math.max(0,Math.min(100,Math.round(day/total*100))),label:`여행 ${day}일차`};
}
function nextStayAfter(date){
  const stays=tripData().stays.slice().sort((a,b)=>a.in.localeCompare(b.in));
  return stays.find(s=>s.in>date) || null;
}
function stayNights(stay){ return Math.max(0,Math.round((parseDate(stay.out)-parseDate(stay.in))/86400000)); }
function homeNavItems(){
  return NAV.map(([id,icon,label])=>`<button class="home-tab ${id==="home"?"active":""}" data-home-view="${id}"><span>${icon}</span><b>${label}</b></button>`).join("");
}
function homeStayTimeline(activeDate){
  const stays=tripData().stays.slice().sort((a,b)=>a.in.localeCompare(b.in));
  return stays.map((s,i)=>{
    const active=activeDate>=s.in && activeDate<s.out;
    const done=activeDate>=s.out;
    const thumbEmoji=["🌿","🌴","🏡","🏙️","🌺","🌊"][i%6];
    return `<div class="stay-step ${active?"active":""} ${done?"done":""}">
      <div class="stay-step-node">${active?"●":done?"✓":"○"}</div>
      <a class="stay-step-card" href="${stayMapUrl(s)}" target="_blank" rel="noopener noreferrer">
        <div class="stay-step-thumb thumb-${(i%6)+1}"><span>${thumbEmoji}</span></div>
        <strong>${escapeHtml(s.name)}</strong>
        <span>${s.in.slice(5).replace("-",".")} ~ ${s.out.slice(5).replace("-",".")}</span>
        <small>${stayNights(s)}박 · ${escapeHtml(s.city)}</small>
      </a>
      ${(tripData().companions||[]).filter(c=>c.stayId===s.id).map(c=>`<div class="stay-companion-chip">👪 ${escapeHtml(c.label)} ${c.in.slice(5).replace("-",".")}~${c.out.slice(5).replace("-",".")}</div>`).join("")}
    </div>`;
  }).join("");
}
function renderHome(){
  setHeader("여행 홈","다낭·호이안 장기 여행을 한눈에 확인합니다.");
  const t=tripData();
  const d=nearestTripDate();
  const stay=currentStay(d) || t.stays.slice().sort((a,b)=>a.in.localeCompare(b.in))[0] || null;
  const nextStay=nextStayAfter(d);
  const p=state.dayPlans[d] || {a:"",b:"",c:"",selected:"A"};
  const progress=tripProgressInfo();
  const w=weatherFor(d);
  const city=cityForDate(d);
  const companions=t.companions||[];
  const nextEvents=nextLockedEvents().slice(0,4);
  const locked=lockedEvents(d);
  const note=state.dayNotes[d]||"";
  const selected=selectedPlan(d);
  const cityStatsHoi=cityStayStats("호이안"), cityStatsDanang=cityStayStats("다낭");
  const isBefore=parseDate(t.start)>new Date();
  const currentLabel=isBefore?"첫 숙소":"현재 숙소";
  const nextLabel=nextStay?"다음 숙소":"다음 일정";
  const nextTitle=nextStay?nextStay.name:(nextEvents[0]?.event||"여행 마무리");
  const nextMeta=nextStay?`${fmtDate(nextStay.in)} → ${escapeHtml(nextStay.city)}`:(nextEvents[0]?fmtDate(nextEvents[0].date,true):"");

  document.getElementById("view").innerHTML=`
    <div class="portal-home">
      <section class="portal-hero">
        <div class="portal-hero-shade"></div>
        <div class="portal-hero-actions">
          <button id="homeCloudStatusBtn" class="hero-action">↻ 일정 최신</button>
          <button id="homeWeatherBtnTop" class="hero-action">☀ 날씨</button>
          <button class="hero-action" data-home-export>⇧ 백업</button>
          <button id="homeAuthBtn" class="hero-user">로그인</button>
        </div>
        <div class="portal-hero-copy">
          <span class="hero-kicker">2026 베트남 장기여행</span>
          <h1>다낭 · 호이안</h1>
          <div class="hero-meta"><span>🗓 ${fmtDate(t.start)} ~ ${fmtDate(t.end)}</span><span>총 ${tripDays()-1}박 ${tripDays()}일</span></div>
        </div>
        <nav class="portal-tabs">${homeNavItems()}</nav>
      </section>

      <div class="portal-content">
        <section class="visual-feature-grid">
          <article class="feature-card current-feature" style="background-image:linear-gradient(180deg,rgba(3,25,40,.05),rgba(3,25,40,.72)),url('./assets/stay-resort.svg')">
            <span class="feature-badge navy">🛏 ${currentLabel}</span>
            <div class="feature-copy">
              <h2>${stay?stayLink(stay):"숙소 미정"}</h2>
              <div>${stay?`📍 ${escapeHtml(stay.city)} &nbsp; · &nbsp; 🗓 ${fmtDate(stay.in)} ~ ${fmtDate(stay.out)} · ${stayNights(stay)}박`:""}</div>
            </div>
          </article>
          <article class="feature-card next-feature" style="background-image:linear-gradient(180deg,rgba(47,17,13,.03),rgba(47,17,13,.72)),url('./assets/next-lanterns.svg')">
            <span class="feature-badge coral">🗓 ${nextLabel}</span>
            <div class="feature-copy">
              <h2>${nextStay?stayLink(nextStay):renderWithStayLinks(nextTitle)}</h2>
              <div>${nextMeta}</div>
            </div>
          </article>
        </section>

        <section class="portal-summary-row">
          <button class="summary-card" data-home-view="bookings"><span class="summary-icon blue">✈</span><div><b>항공편</b><strong>${t.flights.length}편</strong><small>${t.flights.map(f=>f.flight).join(' / ')}</small></div><i>›</i></button>
          <button class="summary-card" data-home-view="bookings"><span class="summary-icon peach">🛏</span><div><b>숙소</b><strong>${t.stays.length}곳 · ${tripDays()-2}박</strong><small>호이안 ${cityStatsHoi.nights}박 · 다낭 ${cityStatsDanang.nights}박</small></div><i>›</i></button>
          <button class="summary-card" data-home-view="bookings"><span class="summary-icon green">👥</span><div><b>동행</b><strong>${companions.length}건</strong><small>${companions.length?companions.map(c=>c.label).join(', '):'등록 없음'}</small></div><i>›</i></button>
          <div class="summary-card progress-summary"><span class="progress-ring" style="--p:${progress.pct}"><b>${progress.pct}%</b></span><div><b>여행 진행률</b><strong>${progress.day}일 / ${progress.total}일</strong><small>${progress.label}</small></div></div>
        </section>

        <section class="portal-panel stay-timeline-panel">
          <div class="panel-title-row"><div><span class="panel-icon">🛏</span><h2>숙소 일정 한눈에 보기</h2></div><button data-home-view="bookings">전체 일정 보기 ›</button></div>
          <div class="stay-timeline">${homeStayTimeline(d)}</div>
        </section>

        <section class="portal-bottom-grid">
          <article class="portal-panel today-panel">
            <div class="panel-title-row"><div><span class="panel-icon">🗓</span><h2>오늘의 일정</h2><small>${fmtDate(d,true)}</small></div>${canEditShared()?`<button data-edit-day="${d}">수정 ›</button>`:`<button data-home-view="calendar">일정 보기 ›</button>`}</div>
            <div class="today-list">
              ${locked.map((e,i)=>`<div class="today-list-row"><span class="check-box">${i===0?'✓':''}</span><span class="today-emoji">${e.startsWith('✈')?'✈️':e.includes('체크')?'🛏':'👪'}</span><div>${renderWithStayLinks(e)}</div></div>`).join('')}
              ${selected?`<div class="today-list-row accent"><span class="check-box"></span><span class="today-emoji">🚶</span><div>${escapeHtml(selected)}</div></div>`:''}
              ${note?`<div class="today-list-row"><span class="check-box"></span><span class="today-emoji">📝</span><div>${escapeHtml(note)}</div></div>`:''}
              ${!locked.length&&!selected&&!note?`<div class="today-empty">오늘 등록된 일정이 없습니다.</div>`:''}
            </div>
            <div class="plan-switch-row compact">
              ${['A','B','C'].map(label=>{const txt=p[label.toLowerCase()]||'미정';return `<button class="plan-mini ${p.selected===label?'active':''}" ${canEditShared()?`data-select-plan="${d}|${label}"`:'disabled'}><b>${label}</b><span>${escapeHtml(txt)}</span></button>`}).join('')}
            </div>
          </article>

          <article class="portal-panel weather-visual" style="background-image:linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.78) 45%,rgba(255,255,255,.12) 100%),url('./assets/weather-danang.svg')">
            <div class="panel-title-row"><div><span class="panel-icon">⛅</span><h2>${escapeHtml(city)} 날씨</h2><small class="weather-date-label">${fmtDate(d,true)} 예보</small></div><button id="homeWeatherBtn">새로고침 ›</button></div>
            ${w?`<div class="weather-big"><span>${weatherEmoji(w.code)}</span><strong>${w.max}°C</strong><div><b>최고 ${w.max}°C</b><b>최저 ${w.min}°C</b><small>강수확률 ${w.rain}%</small></div></div>`:`<div class="weather-big waiting"><span>🌤️</span><strong>예보 대기</strong><div><b>여행일이 가까워지면</b><small>최대 16일 예보가 표시됩니다.</small></div></div>`}
          </article>
        </section>

        <section class="portal-quick-actions">
          <button data-home-view="places"><span>📍</span><b>장소 보기</b></button>
          <button data-home-view="more"><span>✅</span><b>준비물 체크</b></button>
          <button data-home-view="bookings"><span>🎫</span><b>예약 정보</b></button>
          <button data-home-view="money"><span>🪙</span><b>여행 경비</b></button>
          <button data-home-view="calendar"><span>📅</span><b>전체 일정</b></button>
          <button id="homeWeatherQuick"><span>☀️</span><b>날씨 확인</b></button>
        </section>
      </div>
    </div>`;

  document.querySelectorAll('[data-home-view]').forEach(btn=>btn.onclick=()=>{activeView=btn.dataset.homeView;render({preserveScroll:false});window.scrollTo({top:0,behavior:'smooth'});});
  bindDayEditButtons();
  if(canEditShared()) document.querySelectorAll('[data-select-plan]').forEach(btn=>btn.onclick=()=>{const [date,sel]=btn.dataset.selectPlan.split('|');state.dayPlans[date].selected=sel;save();rerenderPreservingScroll(renderHome);});
  const weatherTop=document.getElementById('homeWeatherBtnTop'); if(weatherTop) weatherTop.onclick=refreshWeather;
  const weatherBtn=document.getElementById('homeWeatherBtn'); if(weatherBtn) weatherBtn.onclick=refreshWeather;
  const weatherQuick=document.getElementById('homeWeatherQuick'); if(weatherQuick) weatherQuick.onclick=refreshWeather;
  const auth=document.getElementById('homeAuthBtn'); if(auth) auth.onclick=toggleFirebaseAuth;
  const cloudBtn=document.getElementById('homeCloudStatusBtn'); if(cloudBtn) cloudBtn.onclick=()=>document.getElementById('cloudStatusBtn')?.click();
  document.querySelectorAll('[data-home-export]').forEach(b=>b.onclick=exportData);
  updateCloudHeader();
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
      ${canEditShared()?`<button class="btn small ${selected===label?"primary":""}" data-select-plan="${date}|${label}">${selected===label?"선택됨":"선택"}</button>`:`<span class="badge ${selected===label?"good":""}">${selected===label?"현재 일정":"대안"}</span>`}
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
  allDates().forEach(d=>lockedEvents(d).forEach(event=>arr.push({date:d,event})));
  return arr.filter(x=>x.date>=ref);
}

function renderCalendar(){
  setHeader("전체 일정",canEditShared()?"관리자는 A/B/C 일정을 수정·선택하고 날짜 간 이동할 수 있습니다.":"관리자가 등록한 최신 일정이 로그인 없이 자동 반영됩니다.");
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
  if(canEditShared()) bindDragDrop();
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
    if(d<tripData().start || d>tripData().end) {
      cells.push(`<div class="day empty"><div class="day-date">${day}</div></div>`);
      continue;
    }
    const plan=selectedPlan(d), stay=currentStay(d), w=weatherFor(d);
    cells.push(`<div class="day" data-drop-date="${d}">
      <div class="row between"><div class="day-date">${day}</div><span class="tiny">${fmtDate(d).split(" ").pop()}</span></div>
      <div class="day-city">${stay?`${escapeHtml(stay.city)} · ${stayLink(stay)}`:escapeHtml(cityForDate(d))}</div>
      ${lockedEvents(d).map(e=>`<div class="event locked">${renderWithStayLinks(e)}</div>`).join("")}
      ${w?`<div class="event weather">${weatherEmoji(w.code)} ${w.min}–${w.max}℃ · ${w.rain}%</div>`:""}
      ${plan?`<div class="event editable" ${canEditShared()?`draggable="true" data-drag-date="${d}"`:""}>${canEditShared()?"✎":"•"} ${escapeHtml(plan)}</div>`:""}
      <div class="day-actions"><button data-edit-day="${d}">${canEditShared()?(plan?"일정 수정":"+ 일정 추가"):"상세 보기"}</button></div>
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
      save();rerenderPreservingScroll(renderCalendar);
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
  if(!canEditShared()){
    const p=state.dayPlans[date] || {a:"",b:"",c:"",selected:"A"}, w=weatherFor(date), note=state.dayNotes?.[date]||"";
    showModal(`
      <div class="modal-head"><div><div class="eyebrow">${fmtDate(date,true)} · ${cityForDate(date)}</div><h2>일정 상세</h2></div><button class="btn small" data-close-modal>닫기</button></div>
      ${lockedEvents(date).length?`<div class="note">${lockedEvents(date).map(renderWithStayLinks).join(" · ")}</div>`:""}
      ${w?`<div class="item" style="margin-top:12px"><div class="item-title">${weatherEmoji(w.code)} 예상 ${w.min}–${w.max}℃</div><div class="item-meta">최대 강수확률 ${w.rain}%</div></div>`:""}
      <div class="stack" style="margin-top:14px">${planOptionHTML(date,"A",p.a,p.selected)}${planOptionHTML(date,"B",p.b,p.selected)}${planOptionHTML(date,"C",p.c,p.selected)}</div>
      ${note?`<div class="item" style="margin-top:12px"><div class="item-title">메모</div><div class="item-meta">${escapeHtml(note)}</div></div>`:""}
    `);
    return;
  }
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
    save();closeModal({restore:false});render();
  };
  document.getElementById("clearDayBtn").onclick=()=>{
    delete state.dayPlans[date]; delete state.dayNotes[date]; delete state.baby[date];
    save();closeModal({restore:false});render();
  };
}
function babyCheck(key,label,checked){
  return `<label><input type="checkbox" data-baby-key="${key}" ${checked?"checked":""}><span>${label}</span></label>`;
}

function renderPlaces(){
  setHeader("장소 보관함",canEditShared()?"장소를 저장하고 지도에서 바로 검색하거나 특정 날짜 일정에 붙일 수 있습니다.":"관리자가 등록한 장소를 지도에서 바로 확인할 수 있습니다.");
  const cats=["전체","호이안","다낭","관광","식당","카페","마트","아기","의료","약국"];
  const items=state.places.filter(p=>placeFilter==="전체"||p.city===placeFilter||p.cat===placeFilter);
  document.getElementById("view").innerHTML=`
    <div class="row between wrap" style="margin-bottom:14px">
      <div class="filters">${cats.map(c=>`<button class="btn small ${placeFilter===c?"active":""}" data-place-filter="${c}">${c}</button>`).join("")}</div>
      ${canEditShared()?`<button class="btn primary" id="addPlaceBtn">+ 장소 추가</button>`:`<span class="badge good">👁️ 보기 전용</span>`}
    </div>
    <div class="place-grid">
      ${items.map(p=>`<div class="place-card">
        <div><div class="row between"><span class="badge">${escapeHtml(p.city)} · ${escapeHtml(p.cat)}</span><span class="small">${escapeHtml(p.priority||"")}</span></div>
        <div class="name" style="margin-top:10px">${escapeHtml(p.name)}</div>
        <div class="item-meta">${escapeHtml(p.note||"")}</div></div>
        <div class="row wrap">
          <a class="btn small" target="_blank" rel="noopener" href="${mapUrl(p)}">🗺 지도</a>
          ${canEditShared()?`<button class="btn small" data-place-to-day="${p.id}">일정에 추가</button><button class="btn small danger" data-delete-place="${p.id}">삭제</button>`:""}
        </div>
      </div>`).join("") || `<div class="card muted small">해당 조건의 장소가 없습니다.</div>`}
    </div>
  `;
  document.querySelectorAll("[data-place-filter]").forEach(b=>b.onclick=()=>{placeFilter=b.dataset.placeFilter;rerenderPreservingScroll(renderPlaces);});
  const addPlaceBtn=document.getElementById("addPlaceBtn");
  if(addPlaceBtn) addPlaceBtn.onclick=openAddPlaceModal;
  if(canEditShared()){
    document.querySelectorAll("[data-delete-place]").forEach(b=>b.onclick=()=>{
      state.places=state.places.filter(p=>p.id!==b.dataset.deletePlace);save();rerenderPreservingScroll(renderPlaces);
    });
    document.querySelectorAll("[data-place-to-day]").forEach(b=>b.onclick=()=>openPlaceToDayModal(b.dataset.placeToDay));
  }
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
    save();closeModal({restore:false});rerenderPreservingScroll(renderPlaces);
  };
}
function openPlaceToDayModal(id){
  const p=state.places.find(x=>x.id===id); if(!p)return;
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">일정에 장소 추가</div><h2>${escapeHtml(p.name)}</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <label class="field">날짜<select id="targetDate">${allDates().map(d=>`<option value="${d}">${fmtDate(d,true)} · ${cityForDate(d)}</option>`).join("")}</select></label>
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
  const t=tripData();
  setHeader("예약",canEditShared()?"항공·숙소·동행은 여기서 수정하면 공용 일정에 즉시 반영됩니다.":"항공·숙소·동행의 최신 정보를 로그인 없이 확인할 수 있습니다.");
  document.getElementById("view").innerHTML=`
    <div class="grid grid-2">
      <div class="card">
        <div class="card-head"><div><h3>✈ 항공</h3><div class="small muted">일정 화면에서는 고정</div></div>${canEditShared()?`<button class="btn primary small" id="addFlightBtn">+ 항공</button>`:`<span class="badge good">👁️ 보기 전용</span>`}</div>
        <div class="stack">${t.flights.length?t.flights.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(f=>`<div class="item">
          <div class="row between wrap"><div><div class="item-title">${escapeHtml(f.type||"")} · ${escapeHtml(f.flight)}</div><div class="item-meta">${fmtDate(f.date,true)}<br>${escapeHtml(f.route||"")}<br>${escapeHtml(f.time||"")}</div></div><span class="lock-badge">🔒 일정 고정</span></div>
          ${canEditShared()?`<div class="row wrap" style="margin-top:8px"><button class="btn small" data-edit-flight="${f.id}">수정</button><button class="btn small danger" data-delete-flight="${f.id}">삭제</button></div>`:""}
        </div>`).join(""):`<div class="muted small">등록된 항공편이 없습니다.</div>`}</div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>🏨 숙소</h3><div class="small muted">체크인·체크아웃은 일정 화면에서 고정</div></div>${canEditShared()?`<button class="btn primary small" id="addStayBtn">+ 숙소</button>`:`<span class="badge good">👁️ 보기 전용</span>`}</div>
        <div class="stack">${t.stays.length?t.stays.slice().sort((a,b)=>a.in.localeCompare(b.in)).map(stayBookingItem).join(""):`<div class="muted small">등록된 숙소가 없습니다.</div>`}</div>
        <hr>
        <div class="card-head"><div><h3>👪 동행</h3><div class="small muted">가족 등 별도 숙박 일정</div></div>${canEditShared()?`<button class="btn small" id="addCompanionBtn">+ 동행</button>`:""}</div>
        <div class="stack">${(t.companions||[]).length?t.companions.map(companionBookingItem).join(""):`<div class="muted small">등록된 동행 일정이 없습니다.</div>`}</div>
      </div>
    </div>
    ${canEditShared()?`<div class="section card">
      <div class="card-head"><div><h3>추가 예약</h3><div class="small muted">예약번호·결제정보는 관리자에게만 표시됩니다.</div></div><button class="btn primary" id="addBookingBtn">+ 예약 추가</button></div>
      <div class="stack">
        ${state.customBookings.length ? state.customBookings.map(b=>`<div class="item">
          <div class="row between wrap"><div><div class="item-title">${escapeHtml(b.name)}</div><div class="item-meta">${b.date||"날짜 미정"} · ${escapeHtml(b.type||"기타")} · ${escapeHtml(b.status||"예약")}</div></div><strong>${b.amount?money(b.amount):""}</strong></div>
          <div class="item-meta">예약번호 ${escapeHtml(b.confirmation||"-")} ${b.url?`· <a href="${attr(b.url)}" target="_blank" rel="noopener">예약 링크</a>`:""}</div>
          ${b.note?`<div class="small" style="margin-top:8px">${escapeHtml(b.note)}</div>`:""}
          <div style="margin-top:8px"><button class="btn small danger" data-delete-booking="${b.id}">삭제</button></div>
        </div>`).join("") : `<div class="muted small">추가 예약이 없습니다.</div>`}
      </div>
    </div>`:`<div class="section note">추가 예약의 예약번호·결제정보는 개인정보 보호를 위해 로그인 없는 화면에는 표시하지 않습니다.</div>`}
  `;
  const addFlightBtn=document.getElementById("addFlightBtn");
  if(canEditShared()){
    if(addFlightBtn) addFlightBtn.onclick=()=>openFlightModal();
    const addStayBtn=document.getElementById("addStayBtn"); if(addStayBtn) addStayBtn.onclick=()=>openStayModal();
    const addCompanionBtn=document.getElementById("addCompanionBtn"); if(addCompanionBtn) addCompanionBtn.onclick=()=>openCompanionModal();
    const addBookingBtn=document.getElementById("addBookingBtn"); if(addBookingBtn) addBookingBtn.onclick=openBookingModal;
    document.querySelectorAll("[data-edit-flight]").forEach(b=>b.onclick=()=>openFlightModal(b.dataset.editFlight));
    document.querySelectorAll("[data-delete-flight]").forEach(b=>b.onclick=()=>deleteFlight(b.dataset.deleteFlight));
    document.querySelectorAll("[data-edit-stay]").forEach(b=>b.onclick=()=>openStayModal(b.dataset.editStay));
    document.querySelectorAll("[data-delete-stay]").forEach(b=>b.onclick=()=>deleteStay(b.dataset.deleteStay));
    document.querySelectorAll("[data-edit-companion]").forEach(b=>b.onclick=()=>openCompanionModal(b.dataset.editCompanion));
    document.querySelectorAll("[data-delete-companion]").forEach(b=>b.onclick=()=>deleteCompanion(b.dataset.deleteCompanion));
    document.querySelectorAll("[data-delete-booking]").forEach(b=>b.onclick=()=>{
      state.customBookings=state.customBookings.filter(x=>x.id!==b.dataset.deleteBooking);save();rerenderPreservingScroll(renderBookings);
    });
  }
}
function stayBookingItem(s){
  return `<div class="item">
    <div class="row between wrap"><div><div class="item-title">${stayLink(s)}</div><div class="item-meta">${escapeHtml(s.city)} · ${s.in} → ${s.out} · ${nightsBetween(s.in,s.out)}박</div></div><span class="lock-badge">🔒 일정 고정</span></div>
    ${canEditShared()?`<div class="row wrap" style="margin-top:8px"><button class="btn small" data-edit-stay="${s.id}">수정</button><button class="btn small danger" data-delete-stay="${s.id}">삭제</button></div>`:""}
  </div>`;
}
function companionBookingItem(c){
  const s=companionStay(c);
  return `<div class="item"><div class="item-title">${escapeHtml(c.label)} · ${s?stayLink(s):"숙소 미지정"}</div><div class="item-meta">${c.in} → ${c.out}</div>
    ${canEditShared()?`<div class="row wrap" style="margin-top:8px"><button class="btn small" data-edit-companion="${c.id}">수정</button><button class="btn small danger" data-delete-companion="${c.id}">삭제</button></div>`:""}</div>`;
}
function makeId(prefix){ return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }
function openFlightModal(id=null){
  const t=tripData();
  const f=id?t.flights.find(x=>x.id===id):null;
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">FLIGHT</div><h2>${f?"항공편 수정":"항공편 추가"}</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">구분<input id="flightType" value="${attr(f?.type||"")}" placeholder="출국 / 귀국"></label>
      <label class="field">편명<input id="flightNumber" value="${attr(f?.flight||"")}" placeholder="KE457"></label>
      <label class="field">날짜<input id="flightDate" type="date" value="${attr(f?.date||t.start)}"></label>
      <label class="field">시간<input id="flightTime" value="${attr(f?.time||"")}" placeholder="11:10 → 14:15"></label>
    </div>
    <label class="field" style="margin-top:12px">구간<input id="flightRoute" value="${attr(f?.route||"")}" placeholder="인천공항 T2 → 다낭"></label>
    <div class="modal-footer"><button class="btn primary" id="saveFlightBtn">저장</button></div>
  `);
  document.getElementById("saveFlightBtn").onclick=()=>{
    const flight=document.getElementById("flightNumber").value.trim(), date=document.getElementById("flightDate").value;
    if(!flight||!date){alert("편명과 날짜를 입력해주세요.");return;}
    const item={id:f?.id||makeId("flight"),type:document.getElementById("flightType").value.trim(),flight,date,route:document.getElementById("flightRoute").value.trim(),time:document.getElementById("flightTime").value.trim()};
    if(f) Object.assign(f,item); else t.flights.push(item);
    t.flights.sort((a,b)=>a.date.localeCompare(b.date));
    save();closeModal({restore:false});rerenderPreservingScroll(renderBookings);
  };
}
function deleteFlight(id){
  if(!confirm("이 항공편을 삭제할까요?")) return;
  tripData().flights=tripData().flights.filter(x=>x.id!==id);save();rerenderPreservingScroll(renderBookings);
}
function openStayModal(id=null){
  const t=tripData();
  const s=id?t.stays.find(x=>x.id===id):null;
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">STAY</div><h2>${s?"숙소 수정":"숙소 추가"}</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">숙소명<input id="stayName" value="${attr(s?.name||"")}"></label>
      <label class="field">지역<input id="stayCity" value="${attr(s?.city||"다낭")}" placeholder="호이안 / 다낭"></label>
      <label class="field">체크인<input id="stayIn" type="date" value="${attr(s?.in||t.start)}"></label>
      <label class="field">체크아웃<input id="stayOut" type="date" value="${attr(s?.out||t.end)}"></label>
    </div>
    <label class="field" style="margin-top:12px">Google Maps 검색어<input id="stayMapQuery" value="${attr(s?.mapQuery||"")}" placeholder="호텔 영문명 + 도시"></label>
    <div class="note" style="margin-top:12px">저장하면 홈·캘린더·체크인/체크아웃 일정·Google Maps 링크가 모두 즉시 바뀝니다.</div>
    <div class="modal-footer"><button class="btn primary" id="saveStayBtn">저장</button></div>
  `);
  document.getElementById("saveStayBtn").onclick=()=>{
    const name=document.getElementById("stayName").value.trim(), city=document.getElementById("stayCity").value.trim();
    const inn=document.getElementById("stayIn").value, out=document.getElementById("stayOut").value;
    if(!name||!city||!inn||!out){alert("숙소명, 지역, 체크인/체크아웃을 입력해주세요.");return;}
    if(out<=inn){alert("체크아웃은 체크인 이후 날짜여야 합니다.");return;}
    const item={id:s?.id||makeId("stay"),name,city,in:inn,out,mapQuery:document.getElementById("stayMapQuery").value.trim()};
    if(s) Object.assign(s,item); else t.stays.push(item);
    t.stays.sort((a,b)=>a.in.localeCompare(b.in));
    save();closeModal({restore:false});rerenderPreservingScroll(renderBookings);
  };
}
function deleteStay(id){
  const linked=(tripData().companions||[]).filter(c=>c.stayId===id);
  if(linked.length){alert(`이 숙소를 사용하는 동행 일정(${linked.map(x=>x.label).join(", ")})이 있어 먼저 동행 일정을 수정하거나 삭제해야 합니다.`);return;}
  if(!confirm("이 숙소를 삭제할까요? 체크인/체크아웃 고정 일정에서도 제거됩니다.")) return;
  tripData().stays=tripData().stays.filter(x=>x.id!==id);save();rerenderPreservingScroll(renderBookings);
}
function openCompanionModal(id=null){
  const t=tripData();
  const c=id?(t.companions||[]).find(x=>x.id===id):null;
  if(!t.stays.length){alert("먼저 숙소를 등록해주세요.");return;}
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">COMPANION</div><h2>${c?"동행 일정 수정":"동행 일정 추가"}</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">동행 이름<input id="compLabel" value="${attr(c?.label||"")}" placeholder="장인·장모님"></label>
      <label class="field">숙소<select id="compStay">${t.stays.map(s=>`<option value="${attr(s.id)}" ${c?.stayId===s.id?"selected":""}>${escapeHtml(s.name)}</option>`).join("")}</select></label>
      <label class="field">시작일<input id="compIn" type="date" value="${attr(c?.in||t.start)}"></label>
      <label class="field">종료일<input id="compOut" type="date" value="${attr(c?.out||t.end)}"></label>
    </div>
    <div class="modal-footer"><button class="btn primary" id="saveCompBtn">저장</button></div>
  `);
  document.getElementById("saveCompBtn").onclick=()=>{
    const label=document.getElementById("compLabel").value.trim(), inn=document.getElementById("compIn").value, out=document.getElementById("compOut").value;
    if(!label||!inn||!out){alert("동행 이름과 날짜를 입력해주세요.");return;}
    if(out<=inn){alert("종료일은 시작일 이후여야 합니다.");return;}
    const item={id:c?.id||makeId("companion"),label,stayId:document.getElementById("compStay").value,in:inn,out};
    if(c) Object.assign(c,item); else t.companions.push(item);
    save();closeModal({restore:false});rerenderPreservingScroll(renderBookings);
  };
}
function deleteCompanion(id){
  if(!confirm("이 동행 일정을 삭제할까요?")) return;
  tripData().companions=tripData().companions.filter(x=>x.id!==id);save();rerenderPreservingScroll(renderBookings);
}
function openBookingModal(){
  const t=tripData();
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">BOOKING</div><h2>예약 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">이름<input id="bookName"></label>
      <label class="field">종류<select id="bookType"><option>식당</option><option>투어</option><option>마사지</option><option>픽업/교통</option><option>기타</option></select></label>
      <label class="field">날짜<input id="bookDate" type="date" min="${t.start}" max="${t.end}"></label>
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
    save();closeModal({restore:false});rerenderPreservingScroll(renderBookings);
  };
}

function renderMoney(){
  setHeader("비용",canEditShared()?"VND로 입력하면 설정된 환율로 원화 환산액을 함께 표시합니다.":"비용 정보는 관리자에게만 표시됩니다.");
  if(!canEditShared()){ showAdminGate("💰 비용 · 관리자 전용"); return; }
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
    state.expenses=state.expenses.filter(e=>e.id!==b.dataset.deleteExpense);save();rerenderPreservingScroll(renderMoney);
  });
}
function openExpenseModal(){
  showModal(`
    <div class="modal-head"><div><div class="eyebrow">EXPENSE</div><h2>지출 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="form-grid">
      <label class="field">날짜<input id="expDate" type="date" value="${nearestTripDate()}" min="${tripData().start}" max="${tripData().end}"></label>
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
    save();closeModal({restore:false});rerenderPreservingScroll(renderMoney);
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
    save();closeModal({restore:false});rerenderPreservingScroll(renderMoney);
  };
}

function packingInputId(id){
  return `packing-check-${String(id).replace(/[^a-zA-Z0-9_-]/g,"-")}`;
}
function normalizePackingQty(value){
  const qty=Number.parseInt(value,10);
  return Number.isFinite(qty) ? Math.min(999,Math.max(1,qty)) : 1;
}
function packingGroupMeta(group){
  return group==="common" ? ["공통","👨‍👩‍👦"] : group==="parents" ? ["부모","👫"] : ["하진","👶"];
}
function packingSectionMeta(section){
  return section==="checked" ? ["수화물","🧳","캐리어에 넣을 짐"] : ["기내용","🎒","비행 중 바로 꺼내 쓸 짐"];
}
function packingProgress(section){
  const groups=state.packing?.groups?.[section]||{};
  const items=Object.values(groups).flat();
  const done=items.filter(item=>state.packing.checked?.[item.id]).length;
  return {done,total:items.length};
}
function packingGroupHTML(section,group){
  const [label,icon]=packingGroupMeta(group);
  const items=state.packing?.groups?.[section]?.[group]||[];
  const done=items.filter(item=>state.packing.checked?.[item.id]).length;
  return `<div class="packing-group packing-group-${group}" data-packing-group="${section}|${group}">
    <div class="packing-group-head">
      <div><span class="packing-group-icon">${icon}</span><strong>${label}</strong></div>
      <span class="packing-count" data-packing-count="${section}|${group}">${done}/${items.length}</span>
    </div>
    <div class="packing-items">
      ${items.length?items.map(item=>{const isChecked=!!state.packing.checked?.[item.id];const qty=normalizePackingQty(item.qty);return `<div class="packing-item ${isChecked?"is-checked":""}" data-packing-item="${attr(item.id)}">
        <button type="button" class="packing-check-toggle ${isChecked?"is-checked":""}" data-packing-check="${attr(item.id)}" data-packing-path="${section}|${group}" role="checkbox" aria-checked="${isChecked?"true":"false"}" aria-label="${escapeHtml(item.label)} 체크">
          <span aria-hidden="true">✓</span>
        </button>
        <button type="button" class="packing-item-label" data-packing-label="${attr(item.id)}" data-packing-path="${section}|${group}">${escapeHtml(item.label)}</button>
        <label class="packing-qty-wrap" title="수량"><span>수량</span><input type="number" min="1" max="999" step="1" inputmode="numeric" class="packing-qty-input" value="${qty}" data-packing-qty="${section}|${group}|${attr(item.id)}" aria-label="${escapeHtml(item.label)} 수량"></label>
        <button type="button" class="packing-edit" data-packing-edit="${section}|${group}|${attr(item.id)}" aria-label="${escapeHtml(item.label)} 수정">수정</button>
        <button type="button" class="packing-delete" data-packing-delete="${section}|${group}|${attr(item.id)}" aria-label="삭제">×</button>
      </div>`}).join(""):`<div class="packing-empty">아직 등록된 준비물이 없습니다.</div>`}
    </div>
    <button class="btn small packing-add" data-packing-add="${section}|${group}">+ ${label} 준비물 추가</button>
  </div>`;
}
function packingSectionHTML(section){
  const [title,icon,desc]=packingSectionMeta(section);
  const progress=packingProgress(section);
  const pct=progress.total?Math.round(progress.done/progress.total*100):0;
  return `<section class="card packing-section packing-section-${section}" data-packing-section="${section}">
    <div class="packing-section-head">
      <div>
        <div class="packing-title-row"><span class="packing-section-icon">${icon}</span><h2>${title}</h2></div>
        <p>${desc}</p>
      </div>
      <div class="packing-summary" data-packing-section-count="${section}"><strong>${progress.done}</strong><span>/ ${progress.total}</span></div>
    </div>
    <div class="packing-progress"><div data-packing-section-progress="${section}" style="width:${pct}%"></div></div>
    <div class="packing-groups">
      ${packingGroupHTML(section,"common")}
      ${packingGroupHTML(section,"parents")}
      ${packingGroupHTML(section,"hajin")}
    </div>
  </section>`;
}
function openPackingAddModal(section,group){
  const [sectionLabel]=packingSectionMeta(section);
  const [groupLabel]=packingGroupMeta(group);
  showModal(`<div class="modal-head"><div><div class="eyebrow">${sectionLabel} · ${groupLabel}</div><h2>준비물 추가</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="packing-modal-grid">
      <label class="field">항목<input id="newPackingItem" placeholder="예: 모자" autocomplete="off"></label>
      <label class="field">수량<input id="newPackingQty" type="number" min="1" max="999" step="1" inputmode="numeric" value="1"></label>
    </div>
    <div class="modal-footer"><button class="btn primary" id="savePackingItem">추가</button></div>`);
  const saveNewPackingItem=()=>{
    const label=document.getElementById("newPackingItem").value.trim();
    if(!label)return;
    const qty=normalizePackingQty(document.getElementById("newPackingQty").value);
    const id=`packing-${section}-${group}-${Date.now()}`;
    state.packing.groups[section][group].push({id,label,qty});
    savePrivateOnly();closeModal({restore:false});rerenderPreservingScroll(renderMore);
  };
  document.getElementById("savePackingItem").onclick=saveNewPackingItem;
  document.getElementById("newPackingItem").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();saveNewPackingItem();}};
}

function openPackingEditModal(section,group,id){
  const items=state.packing?.groups?.[section]?.[group]||[];
  const item=items.find(x=>x.id===id);
  if(!item)return;
  const [sectionLabel]=packingSectionMeta(section);
  const [groupLabel]=packingGroupMeta(group);
  showModal(`<div class="modal-head"><div><div class="eyebrow">${sectionLabel} · ${groupLabel}</div><h2>준비물 수정</h2></div><button class="btn small" data-close-modal>닫기</button></div>
    <div class="packing-modal-grid">
      <label class="field">항목<input id="editPackingItem" value="${attr(item.label)}" autocomplete="off"></label>
      <label class="field">수량<input id="editPackingQty" type="number" min="1" max="999" step="1" inputmode="numeric" value="${normalizePackingQty(item.qty)}"></label>
    </div>
    <div class="modal-footer"><button class="btn primary" id="savePackingEdit">저장</button></div>`);
  const savePackingEdit=()=>{
    const label=document.getElementById("editPackingItem").value.trim();
    if(!label)return;
    item.label=label;
    item.qty=normalizePackingQty(document.getElementById("editPackingQty").value);
    savePrivateOnly();closeModal({restore:false});rerenderPreservingScroll(renderMore);
  };
  document.getElementById("savePackingEdit").onclick=savePackingEdit;
  document.getElementById("editPackingItem").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();savePackingEdit();}};
}

function updatePackingProgressUI(section,group){
  const items=state.packing?.groups?.[section]?.[group]||[];
  const groupDone=items.filter(item=>state.packing.checked?.[item.id]).length;
  const groupCount=document.querySelector(`[data-packing-count="${section}|${group}"]`);
  if(groupCount) groupCount.textContent=`${groupDone}/${items.length}`;

  const sectionProgress=packingProgress(section);
  const sectionCount=document.querySelector(`[data-packing-section-count="${section}"]`);
  if(sectionCount) sectionCount.innerHTML=`<strong>${sectionProgress.done}</strong><span>/ ${sectionProgress.total}</span>`;
  const sectionBar=document.querySelector(`[data-packing-section-progress="${section}"]`);
  if(sectionBar) sectionBar.style.width=`${sectionProgress.total?Math.round(sectionProgress.done/sectionProgress.total*100):0}%`;

  const checked=packingProgress("checked");
  const carry=packingProgress("carry");
  const total=document.querySelector("[data-packing-total]");
  if(total) total.innerHTML=`<strong>${checked.done+carry.done}</strong><span>/ ${checked.total+carry.total} 완료</span>`;
}

function renderMore(){
  setHeader("준비 · 생활",canEditShared()?"짐 종류와 가족별로 나눠 준비물을 관리합니다.":"개인 준비 정보는 관리자에게만 표시됩니다.");
  if(!canEditShared()){ showAdminGate("🧳 준비 · 관리자 전용"); return; }
  migratePackingData(state);
  document.getElementById("view").innerHTML=`
    <div class="packing-page-intro">
      <div><span class="badge good">36박 37일</span><h2>여행 준비 체크리스트</h2><p>수화물과 기내용을 나누고, 공통·부모·하진 준비물을 각각 체크하세요.</p></div>
      <div class="packing-total" data-packing-total>${(()=>{const a=packingProgress("checked"),b=packingProgress("carry");return `<strong>${a.done+b.done}</strong><span>/ ${a.total+b.total} 완료</span>`})()}</div>
    </div>
    <div class="packing-layout">
      ${packingSectionHTML("checked")}
      ${packingSectionHTML("carry")}
    </div>
    <div class="section grid grid-2 packing-support">
      <div class="card emergency-card">
        <div class="card-head"><h3>🚨 긴급 정보</h3></div>
        <div class="stack">
          <div class="item"><div class="item-title">베트남 긴급전화</div><div class="item-meta">구급 115 · 경찰 113 · 소방 114</div></div>
          <div class="item"><div class="item-title">Vinmec Da Nang Hospital</div><div class="item-meta">다낭 소아 진료 후보 · 여행 중 최신 운영정보 확인</div></div>
        </div>
      </div>
      <div class="card packing-tip-card">
        <div class="card-head"><h3>✈️ 출발 전 마지막 확인</h3></div>
        <div class="stack small">
          <div class="item">여권 · 항공권 · 숙소 예약 확인</div>
          <div class="item">기내용 아기 물품은 도착 지연에 대비해 여유분 준비</div>
          <div class="item">보조배터리·액체류는 이용 항공사 기내 반입 규정 최종 확인</div>
        </div>
      </div>
    </div>
  `;
  function togglePackingItem(id,path){
    const [section,group]=path.split("|");
    const next=!state.packing.checked?.[id];
    if(next) state.packing.checked[id]=true;
    else delete state.packing.checked[id];

    document.querySelectorAll("[data-packing-check]").forEach(btn=>{
      if(btn.dataset.packingCheck!==id) return;
      btn.classList.toggle("is-checked",next);
      btn.setAttribute("aria-checked",next?"true":"false");
    });
    document.querySelectorAll("[data-packing-item]").forEach(row=>{
      if(row.dataset.packingItem===id) row.classList.toggle("is-checked",next);
    });

    savePrivateOnly();
    updatePackingProgressUI(section,group);
  }
  document.querySelectorAll("[data-packing-check]").forEach(btn=>btn.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    togglePackingItem(btn.dataset.packingCheck,btn.dataset.packingPath);
  });
  document.querySelectorAll("[data-packing-label]").forEach(btn=>btn.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    togglePackingItem(btn.dataset.packingLabel,btn.dataset.packingPath);
  });
  document.querySelectorAll("[data-packing-add]").forEach(b=>b.onclick=()=>{
    const [section,group]=b.dataset.packingAdd.split("|");
    openPackingAddModal(section,group);
  });
  document.querySelectorAll("[data-packing-qty]").forEach(input=>{
    input.onclick=e=>e.stopPropagation();
    input.onchange=e=>{
      e.preventDefault();e.stopPropagation();
      const [section,group,id]=input.dataset.packingQty.split("|");
      const item=(state.packing?.groups?.[section]?.[group]||[]).find(x=>x.id===id);
      if(!item)return;
      item.qty=normalizePackingQty(input.value);
      input.value=String(item.qty);
      savePrivateOnly();
    };
  });
  document.querySelectorAll("[data-packing-edit]").forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const [section,group,id]=b.dataset.packingEdit.split("|");
    openPackingEditModal(section,group,id);
  });
  document.querySelectorAll("[data-packing-delete]").forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const [section,group,id]=b.dataset.packingDelete.split("|");
    state.packing.groups[section][group]=state.packing.groups[section][group].filter(item=>item.id!==id);
    delete state.packing.checked[id];
    savePrivateOnly();rerenderPreservingScroll(renderMore);
  });
}

let modalScrollY=0;
function showModal(html){
  modalScrollY=window.scrollY;
  document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  document.querySelectorAll("[data-close-modal]").forEach(b=>b.onclick=()=>closeModal());
  document.querySelector(".modal-backdrop").onclick=e=>{if(e.target.classList.contains("modal-backdrop"))closeModal();};
}
function closeModal(options={}){
  document.getElementById("modalRoot").innerHTML="";
  if(options.restore!==false) restoreScrollPosition(modalScrollY);
}

async function refreshWeather(){
  const btn=document.getElementById("weatherRefreshBtn");
  if(btn){btn.disabled=true;btn.textContent="날씨 조회 중…";}
  try{
    const results={};
    for(const city of ["호이안","다낭"]){
      const {lat,lon}=tripData().cities[city];
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
    const dates=allDates().filter(d=>weatherFor(d));
    if(!dates.length) alert("조회는 성공했지만 여행 날짜가 아직 16일 예보 범위 밖입니다. 출발이 가까워지면 일정표에 날씨가 표시됩니다.");
  }catch(e){
    alert("날씨를 불러오지 못했습니다. 인터넷 연결 후 다시 시도해주세요.");
  }finally{
    const b=document.getElementById("weatherRefreshBtn");
    if(b){b.disabled=false;b.textContent="☁️ 날씨 새로고침";}
  }
}

function exportData(){
  const payload={version:4,exportedAt:new Date().toISOString(),trip:tripData(),state};
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
    if(data.trip && !data.state.trip) data.state.trip=data.trip;
    state=deepMerge(clone(DEFAULT_STATE),data.state);save();render();alert("데이터를 복원했습니다.");
  }catch(err){alert("올바른 백업 파일이 아닙니다.");}
  e.target.value="";
});

function escapeHtml(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function attr(v){ return escapeHtml(v); }


if("scrollRestoration" in history){
  history.scrollRestoration="manual";
}

document.getElementById("weatherRefreshBtn").onclick=refreshWeather;
document.getElementById("authBtn").onclick=toggleFirebaseAuth;
document.getElementById("cloudStatusBtn").onclick=()=>{
  if(cloud.error){
    alert("Firebase 동기화 오류가 있습니다. 인터넷 연결, Authentication, Firestore Rules 설정을 확인해주세요.");
  }else if(!cloud.configured){
    openFirebaseSetupModal();
  }else if(cloud.user){
    const who=cloud.user.email || cloud.user.displayName || "Google 계정";
    if(canEditShared()){
      alert(`${who}\n관리자 권한이 확인되었습니다. 공용 일정 수정 및 개인 관리 기능을 사용할 수 있습니다.`);
    }else{
      alert(`${who}\n로그인은 되었지만 관리자 권한이 확인되지 않았습니다.\nUID: ${cloud.user.uid}\nFirestore의 admins/{UID} 문서를 확인해주세요.`);
    }
  }else{
    alert("Firebase는 설정되어 있지만 아직 Google 로그인 전입니다.");
  }
};
document.querySelectorAll("[data-action='export-data']").forEach(b=>b.onclick=exportData);

const didTripMigration = migrateTripData(state);
const didItineraryMigration = migrateCurrentItinerary(state);
if(didTripMigration || didItineraryMigration){
  persistLocal();
}
render();
updateCloudHeader();
initFirebaseSync();

if("serviceWorker" in navigator){
  window.addEventListener("load",async()=>{
    try{
      const reg=await navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"});
      await reg.update();
    }catch(err){
      console.warn("Service worker registration failed",err);
    }
  });
}
