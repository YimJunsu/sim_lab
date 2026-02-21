// ────────────────────────────────────────────────────
// TODO: 아래 MENU_ITEMS 배열의 영양 데이터는 추후 공공데이터포털
//       (식품의약품안전처 식품영양성분DB) API로 교체 예정입니다.
//       현재 수치는 일반적인 참고값 기준의 목데이터입니다.
// ────────────────────────────────────────────────────

export type MoodId =
  | "happy"
  | "angry"
  | "sad"
  | "hangover"
  | "rainy"
  | "soju"
  | "comfort"
  | "energetic";

export type CategoryId =
  | "korean"
  | "western"
  | "chinese"
  | "japanese"
  | "dessert"
  | "random";

export interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  category: Exclude<CategoryId, "random">;
  moods: MoodId[];
  description: string;
  tags: string[];
  nutrition: {
    calories: number; // kcal
    protein: number;  // g
    fat: number;      // g
    carbs: number;    // g
  };
}

export interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
  desc: string;
}

export interface CategoryOption {
  id: CategoryId;
  emoji: string;
  label: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "happy",     emoji: "😄", label: "기분 최고!",  desc: "뭐든 잘 될 것 같은 날" },
  { id: "angry",     emoji: "😤", label: "화남",        desc: "매운 게 당기는 날" },
  { id: "sad",       emoji: "😢", label: "우울해",      desc: "기운 없이 축 처지는 날" },
  { id: "hangover",  emoji: "🤢", label: "숙취",        desc: "어젯밤이 너무 길었어" },
  { id: "rainy",     emoji: "🌧️", label: "비 오는 날",  desc: "창밖에 빗소리가 들려" },
  { id: "soju",      emoji: "🍶", label: "소주 생각",   desc: "오늘은 한잔 걸쳐야지" },
  { id: "comfort",   emoji: "🤗", label: "위로 필요",   desc: "따뜻한 게 먹고 싶어" },
  { id: "energetic", emoji: "⚡", label: "에너지 충전", desc: "오늘은 든든하게!" },
];

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "korean",   emoji: "🍲", label: "한식" },
  { id: "western",  emoji: "🍝", label: "양식" },
  { id: "chinese",  emoji: "🥡", label: "중식" },
  { id: "japanese", emoji: "🍣", label: "일식" },
  { id: "dessert",  emoji: "🍰", label: "디저트" },
  { id: "random",   emoji: "🎲", label: "완전 랜덤" },
];

// TODO: 아래 배열의 데이터는 추후 공공데이터포털 영양 데이터로 교체 예정
export const MENU_ITEMS: MenuItem[] = [
  // ─── 한식 ───
  {
    id: "kimchi-jjigae",
    name: "김치찌개",
    emoji: "🍲",
    category: "korean",
    moods: ["sad", "hangover", "comfort", "rainy", "soju"],
    description: "깊고 얼큰한 국물이 마음까지 따뜻하게 채워주는 국민 찌개",
    tags: ["#얼큰", "#든든", "#국민찌개"],
    nutrition: { calories: 142, protein: 8.2, fat: 5.8, carbs: 12.4 },
  },
  {
    id: "samgyeopsal",
    name: "삼겹살",
    emoji: "🥩",
    category: "korean",
    moods: ["happy", "soju", "energetic"],
    description: "불판 위에서 지글지글, 쌈채소와 함께하는 최고의 한 끼",
    tags: ["#고기", "#소주안주", "#파티"],
    nutrition: { calories: 331, protein: 15.3, fat: 29.4, carbs: 0.2 },
  },
  {
    id: "bibimbap",
    name: "비빔밥",
    emoji: "🥗",
    category: "korean",
    moods: ["happy", "energetic"],
    description: "알록달록 나물과 고추장을 쓱쓱 비벼 먹는 영양 만점 한 그릇",
    tags: ["#건강식", "#컬러풀", "#비벼먹기"],
    nutrition: { calories: 485, protein: 16.8, fat: 12.3, carbs: 74.2 },
  },
  {
    id: "budae-jjigae",
    name: "부대찌개",
    emoji: "🫕",
    category: "korean",
    moods: ["hangover", "rainy", "comfort", "soju"],
    description: "햄, 소시지, 라면이 한데 어우러진 든든한 혼합찌개",
    tags: ["#얼큰", "#해장", "#라면추가"],
    nutrition: { calories: 210, protein: 11.4, fat: 8.9, carbs: 21.6 },
  },
  {
    id: "tteokbokki",
    name: "떡볶이",
    emoji: "🌶️",
    category: "korean",
    moods: ["angry", "rainy", "sad"],
    description: "매콤달콤 고추장 양념에 쫄깃한 떡, 스트레스가 싹 날아가는 맛",
    tags: ["#매콤", "#길거리음식", "#분식"],
    nutrition: { calories: 248, protein: 5.2, fat: 2.8, carbs: 51.6 },
  },
  {
    id: "sundubu",
    name: "순두부찌개",
    emoji: "🥘",
    category: "korean",
    moods: ["hangover", "sad", "comfort", "rainy"],
    description: "부드러운 순두부와 얼큰한 국물이 속을 편안하게 달래주는 찌개",
    tags: ["#해장", "#부드러운", "#얼큰"],
    nutrition: { calories: 124, protein: 9.8, fat: 5.2, carbs: 8.6 },
  },
  {
    id: "galbitang",
    name: "갈비탕",
    emoji: "🍖",
    category: "korean",
    moods: ["happy", "energetic", "comfort"],
    description: "뽀얀 국물에 뼈에서 떨어지는 갈비, 특별한 날에 딱 맞는 보양식",
    tags: ["#보양식", "#특별한날", "#든든"],
    nutrition: { calories: 285, protein: 24.1, fat: 15.8, carbs: 9.2 },
  },
  {
    id: "doenjang-jjigae",
    name: "된장찌개",
    emoji: "🍲",
    category: "korean",
    moods: ["comfort", "sad", "hangover"],
    description: "구수한 된장 향이 코끝에 스미는, 엄마의 손맛이 담긴 찌개",
    tags: ["#구수한", "#집밥", "#한국인"],
    nutrition: { calories: 98, protein: 7.4, fat: 3.6, carbs: 9.1 },
  },
  {
    id: "japchae",
    name: "잡채",
    emoji: "🍜",
    category: "korean",
    moods: ["happy", "comfort", "energetic"],
    description: "당면과 색색의 채소, 고기가 어우러진 명절의 맛",
    tags: ["#당면", "#명절", "#달콤짭조름"],
    nutrition: { calories: 208, protein: 5.4, fat: 6.2, carbs: 32.8 },
  },
  // ─── 양식 ───
  {
    id: "pizza",
    name: "피자",
    emoji: "🍕",
    category: "western",
    moods: ["happy", "sad", "energetic"],
    description: "모두가 좋아하는 치즈 듬뿍 피자, 오늘의 행복을 한 조각씩",
    tags: ["#치즈", "#파티", "#배달"],
    nutrition: { calories: 266, protein: 11.4, fat: 10.4, carbs: 33.8 },
  },
  {
    id: "pasta",
    name: "파스타",
    emoji: "🍝",
    category: "western",
    moods: ["happy", "rainy", "sad"],
    description: "비 오는 날 촛불 켜놓고 먹으면 더 맛있는 와인 어울림 요리",
    tags: ["#분위기", "#이탈리안", "#홈파티"],
    nutrition: { calories: 368, protein: 12.8, fat: 11.2, carbs: 54.6 },
  },
  {
    id: "burger",
    name: "햄버거",
    emoji: "🍔",
    category: "western",
    moods: ["energetic", "angry", "happy"],
    description: "손에서 즙이 뚝뚝, 두 손으로 꽉 잡고 한 입에 먹는 묵직한 버거",
    tags: ["#든든", "#패스트푸드", "#육즙"],
    nutrition: { calories: 547, protein: 23.6, fat: 27.4, carbs: 49.8 },
  },
  {
    id: "cream-risotto",
    name: "크림 리소토",
    emoji: "🫕",
    category: "western",
    moods: ["comfort", "sad", "rainy"],
    description: "진하고 크리미한 리소토, 포근하게 감싸주는 따뜻한 위로 한 그릇",
    tags: ["#크리미", "#위로음식", "#이탈리안"],
    nutrition: { calories: 412, protein: 9.8, fat: 18.6, carbs: 52.4 },
  },
  {
    id: "steak",
    name: "스테이크",
    emoji: "🥩",
    category: "western",
    moods: ["happy", "energetic"],
    description: "미디엄 레어로 구운 육즙 가득한 스테이크, 오늘만큼은 특별하게",
    tags: ["#고급", "#육즙", "#특별한날"],
    nutrition: { calories: 634, protein: 46.2, fat: 46.8, carbs: 1.2 },
  },
  // ─── 중식 ───
  {
    id: "jjajangmyeon",
    name: "짜장면",
    emoji: "🍜",
    category: "chinese",
    moods: ["sad", "rainy", "comfort"],
    description: "검은 양복의 남자처럼 강렬한 블랙빈 소스가 감싼 면 요리",
    tags: ["#비오는날", "#중화", "#배달"],
    nutrition: { calories: 480, protein: 14.2, fat: 6.8, carbs: 88.4 },
  },
  {
    id: "jjamppong",
    name: "짬뽕",
    emoji: "🌊",
    category: "chinese",
    moods: ["angry", "hangover", "rainy"],
    description: "매콤한 홍탕에 해산물이 가득, 속이 뻥 뚫리는 시원한 국물",
    tags: ["#얼큰", "#해장", "#해산물"],
    nutrition: { calories: 430, protein: 18.6, fat: 8.4, carbs: 68.2 },
  },
  {
    id: "tangsuyuk",
    name: "탕수육",
    emoji: "🍤",
    category: "chinese",
    moods: ["happy", "soju"],
    description: "바삭한 튀김옷에 새콤달콤 소스, 부먹파? 찍먹파?",
    tags: ["#부먹찍먹", "#중화", "#안주"],
    nutrition: { calories: 280, protein: 12.4, fat: 11.6, carbs: 32.8 },
  },
  {
    id: "malatang",
    name: "마라탕",
    emoji: "🫕",
    category: "chinese",
    moods: ["angry", "energetic", "happy"],
    description: "마비되는 듯한 마라 향신료의 중독적인 맛, 한 번 맛보면 못 멈춰",
    tags: ["#마라", "#중독", "#얼얼"],
    nutrition: { calories: 310, protein: 15.2, fat: 14.8, carbs: 28.6 },
  },
  {
    id: "kung-pao",
    name: "궁보계정",
    emoji: "🍗",
    category: "chinese",
    moods: ["angry", "happy", "energetic"],
    description: "땅콩과 고추, 닭고기의 완벽한 균형 — 중화요리의 클래식",
    tags: ["#매콤", "#중화", "#닭고기"],
    nutrition: { calories: 298, protein: 18.4, fat: 16.2, carbs: 18.8 },
  },
  // ─── 일식 ───
  {
    id: "sushi",
    name: "초밥",
    emoji: "🍣",
    category: "japanese",
    moods: ["happy", "energetic"],
    description: "신선한 해산물과 초밥 위 한 점, 오늘의 사치를 허락하자",
    tags: ["#고급", "#신선", "#오마카세"],
    nutrition: { calories: 301, protein: 16.4, fat: 4.8, carbs: 48.6 },
  },
  {
    id: "ramen",
    name: "라멘",
    emoji: "🍜",
    category: "japanese",
    moods: ["rainy", "sad", "comfort", "hangover"],
    description: "진한 돈코츠 육수에 쫄깃한 면발, 비 오는 날 영혼을 따뜻하게",
    tags: ["#돈코츠", "#비오는날", "#위로"],
    nutrition: { calories: 436, protein: 18.2, fat: 14.6, carbs: 56.4 },
  },
  {
    id: "katsu",
    name: "돈카츠",
    emoji: "🍱",
    category: "japanese",
    moods: ["energetic", "happy", "comfort"],
    description: "바삭바삭 튀긴 돼지고기에 달콤한 소스, 간단하지만 완벽한 한 끼",
    tags: ["#바삭", "#든든", "#도시락"],
    nutrition: { calories: 498, protein: 24.6, fat: 22.8, carbs: 46.2 },
  },
  {
    id: "udon",
    name: "우동",
    emoji: "🍜",
    category: "japanese",
    moods: ["comfort", "hangover", "rainy", "sad"],
    description: "굵고 탱글탱글한 면발, 맑은 국물의 부드러운 위로",
    tags: ["#쫄깃", "#따뜻한", "#해장"],
    nutrition: { calories: 268, protein: 9.8, fat: 2.4, carbs: 52.6 },
  },
  {
    id: "yakitori",
    name: "야키토리",
    emoji: "🍢",
    category: "japanese",
    moods: ["happy", "soju", "energetic"],
    description: "꼬치에 꿴 닭고기를 달콤 짭조름한 소스에 구운 선술집의 맛",
    tags: ["#꼬치", "#일식", "#안주"],
    nutrition: { calories: 182, protein: 16.8, fat: 8.2, carbs: 8.4 },
  },
  // ─── 디저트 ───
  {
    id: "bingsu",
    name: "빙수",
    emoji: "🍧",
    category: "dessert",
    moods: ["happy"],
    description: "눈처럼 부드러운 얼음 위 달콤한 팥과 과일, 여름의 행복",
    tags: ["#여름", "#달콤", "#시원"],
    nutrition: { calories: 198, protein: 3.8, fat: 2.4, carbs: 42.6 },
  },
  {
    id: "cake",
    name: "케이크",
    emoji: "🎂",
    category: "dessert",
    moods: ["happy", "sad", "comfort"],
    description: "달콤한 크림과 스폰지 케이크, 오늘만큼은 나를 위한 선물",
    tags: ["#달콤", "#선물", "#특별한날"],
    nutrition: { calories: 326, protein: 4.8, fat: 15.2, carbs: 44.6 },
  },
  {
    id: "waffle",
    name: "와플",
    emoji: "🧇",
    category: "dessert",
    moods: ["happy", "rainy", "comfort"],
    description: "바삭하고 폭신한 와플에 버터와 시럽, 카페 감성 가득",
    tags: ["#카페감성", "#아침", "#달콤"],
    nutrition: { calories: 291, protein: 7.2, fat: 11.8, carbs: 41.4 },
  },
  {
    id: "tiramisu",
    name: "티라미수",
    emoji: "🍰",
    category: "dessert",
    moods: ["sad", "happy", "comfort"],
    description: "커피향이 진한 이탈리안 디저트, 하루의 끝에 작은 사치",
    tags: ["#커피향", "#이탈리안", "#달콤"],
    nutrition: { calories: 310, protein: 5.6, fat: 18.4, carbs: 32.2 },
  },
  {
    id: "macaron",
    name: "마카롱",
    emoji: "🍪",
    category: "dessert",
    moods: ["sad", "comfort", "happy"],
    description: "한입에 쏙 들어오는 달콤한 크림 샌드, 기분 전환에 딱",
    tags: ["#달콤", "#프렌치", "#선물"],
    nutrition: { calories: 168, protein: 2.8, fat: 7.6, carbs: 24.2 },
  },
];

/** 기분에 해당하는 메뉴 목록 반환 */
export function getMenusByMood(moodId: MoodId): MenuItem[] {
  return MENU_ITEMS.filter((m) => m.moods.includes(moodId));
}

/** 카테고리에 해당하는 메뉴 목록 반환 */
export function getMenusByCategory(
  categoryId: Exclude<CategoryId, "random">
): MenuItem[] {
  return MENU_ITEMS.filter((m) => m.category === categoryId);
}

/** 배열에서 랜덤 메뉴 1개 선택 */
export function pickRandomMenu(items: MenuItem[]): MenuItem {
  return items[Math.floor(Math.random() * items.length)];
}

/** ID로 메뉴 아이템 검색 */
export function findMenuById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((m) => m.id === id);
}