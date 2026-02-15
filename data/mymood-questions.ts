/**
 * 감정 점수화 - 40개 질문 데이터
 * 감정당 8개씩: joy(기쁨), fatigue(피로), stress(스트레스), calm(평온), excitement(설렘)
 * 각 옵션은 5개 감정에 대한 점수를 직접 포함
 */

import type { EmotionScores } from "@/lib/mymood-questions";

export interface MoodQuestion {
  id: number;
  mood: keyof EmotionScores;
  content: string;
  options: { label: string; scores: EmotionScores }[];
}

export const ALL_QUESTIONS: MoodQuestion[] = [
  // ━━━ JOY (기쁨) 1~8 ━━━
  {
    id: 1,
    mood: "joy",
    content: "배달 음식이 예상보다 10분 일찍 도착했다. 지금 기분은?",
    options: [
      { label: "이게 행복이지... 인생 살맛난다", scores: { joy: 4, fatigue: 0, stress: 0, calm: 1, excitement: 0 } },
      { label: "일어나서 문 열 기력이 없다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "혹시 다른 사람 거 아닌가 불안", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "음식 받고 이불 속으로 복귀", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 2,
    mood: "joy",
    content: "퇴근길에 신호등이 5개 연속 초록불이다.",
    options: [
      { label: "오늘 로또 사야 하나?! 개행복", scores: { joy: 4, fatigue: 0, stress: 0, calm: 0, excitement: 1 } },
      { label: "초록불이든 빨간불이든 다 똑같다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "다음 신호에서 분명 걸릴 거야", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "흠, 나쁘지 않은 하루였군", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },
  {
    id: 3,
    mood: "joy",
    content: "자판기에서 음료 하나 뽑았는데 두 개가 나왔다.",
    options: [
      { label: "개꿀 (슬쩍)", scores: { joy: 4, fatigue: 0, stress: 0, calm: 0, excitement: 1 } },
      { label: "하나는 내일 먹어야지... (기력 없음)", scores: { joy: 0, fatigue: 3, stress: 0, calm: 2, excitement: 0 } },
      { label: "CCTV에 찍히면 도둑으로 오해받나", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "뒷 사람한테 하나 준다", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },
  {
    id: 4,
    mood: "joy",
    content: "좋아하는 사람이 내 인스타 스토리에 하트 반응을 눌렀다.",
    options: [
      { label: "폰 들고 이불킥 중", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "봤는데 반응할 에너지가 없다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "실수로 누른 거 아닌가 과분석 시작", scores: { joy: 0, fatigue: 0, stress: 3, calm: 0, excitement: 2 } },
      { label: "미소 짓고 폰 내려놓기", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },
  {
    id: 5,
    mood: "joy",
    content: "월급날이다. 통장을 확인하는 이 순간.",
    options: [
      { label: "들어왔다!! 세상에서 제일 행복해", scores: { joy: 4, fatigue: 0, stress: 0, calm: 0, excitement: 1 } },
      { label: "들어오자마자 나갈 생각에 현타", scores: { joy: 0, fatigue: 3, stress: 2, calm: 0, excitement: 0 } },
      { label: "카드값 자동이체 생각에 숨막힘", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "묵묵히 저축 앱 확인", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 6,
    mood: "joy",
    content: "회사에서 칭찬을 받았다. 근데 다들 보는 앞에서.",
    options: [
      { label: "인정받는 기분 미쳤다 ㅎㅎ", scores: { joy: 4, fatigue: 0, stress: 0, calm: 0, excitement: 1 } },
      { label: "기쁜데 리액션할 힘이 없어서 쿨한 척", scores: { joy: 1, fatigue: 4, stress: 0, calm: 0, excitement: 0 } },
      { label: "관심 받는 게 부담스럽다", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "속으로 뿌듯, 겉으론 담담", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },
  {
    id: 7,
    mood: "joy",
    content: "금요일 오후 5시 59분. 1분 뒤면 퇴근이다.",
    options: [
      { label: "이미 머릿속은 치맥 파티", scores: { joy: 4, fatigue: 0, stress: 0, calm: 0, excitement: 1 } },
      { label: "퇴근해도 집에서 뻗을 예정", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "6시에 갑자기 일 들어올까 봐 불안", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "주말 계획 조용히 세우는 중", scores: { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 } },
    ],
  },
  {
    id: 8,
    mood: "joy",
    content: "오랜만에 엄마가 반찬 택배를 보내줬다.",
    options: [
      { label: "엄마 사랑해... 눈물 날 것 같아", scores: { joy: 4, fatigue: 0, stress: 0, calm: 1, excitement: 0 } },
      { label: "고맙지만 냉장고 정리할 기력이...", scores: { joy: 1, fatigue: 4, stress: 0, calm: 0, excitement: 0 } },
      { label: "전화해야 하는데 눈치 보인다", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "따뜻한 마음에 편안해진다", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },

  // ━━━ FATIGUE (피로) 9~16 ━━━
  {
    id: 9,
    mood: "fatigue",
    content: "알람을 끄고 '5분만'을 세 번째 외치는 중이다.",
    options: [
      { label: "그래도 일어나면 오늘도 좋은 하루!", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "5분이 아니라 50분이 필요하다", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "지각하면 어쩌지 불안 ON", scores: { joy: 0, fatigue: 1, stress: 4, calm: 0, excitement: 0 } },
      { label: "알람 끄고 스트레칭부터", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 10,
    mood: "fatigue",
    content: "점심 먹고 돌아왔는데 눈이 감긴다. 근데 회의가 있다.",
    options: [
      { label: "커피 원샷하고 회의 가즈아", scores: { joy: 2, fatigue: 0, stress: 1, calm: 0, excitement: 2 } },
      { label: "카메라 끄고 눈 감을까 진심 고민", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "졸다가 지목당할까 봐 긴장", scores: { joy: 0, fatigue: 1, stress: 4, calm: 0, excitement: 0 } },
      { label: "물 한 잔 마시고 마음 가다듬기", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 11,
    mood: "fatigue",
    content: "친구가 '우리 이번 주말에 등산 갈래?' 라고 물어봤다.",
    options: [
      { label: "산 좋지! 정상에서 사진 찍자", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "산이 왜 거기 있는 건데... 패스", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "거절하면 서운해하려나 고민", scores: { joy: 0, fatigue: 1, stress: 3, calm: 0, excitement: 1 } },
      { label: "가볍게 산책 코스로 타협", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 12,
    mood: "fatigue",
    content: "집에 왔는데 택배가 4개 와있다. 다 뜯어야 한다.",
    options: [
      { label: "언박싱 시작~ 두근두근", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "내일 뜯지 뭐... (소파에 드러눕기)", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "분리수거 생각에 벌써 피곤", scores: { joy: 0, fatigue: 2, stress: 3, calm: 0, excitement: 0 } },
      { label: "하나씩 정리하면서 여유롭게", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 13,
    mood: "fatigue",
    content: "샤워하러 가야 하는데 소파에서 못 일어나겠다.",
    options: [
      { label: "핫초코 한 잔 마시고 기운내자", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "오늘은 그냥 이대로 자도 되지 않나", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "내일 머리 기름지면 어쩌지...", scores: { joy: 0, fatigue: 1, stress: 3, calm: 1, excitement: 0 } },
      { label: "타이머 맞춰놓고 10분 뒤에 가기", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 14,
    mood: "fatigue",
    content: "월요일 아침, 출근 준비를 하는 중이다.",
    options: [
      { label: "새로운 한 주, 나쁘지 않아!", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "영혼 없이 옷 입는 중", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "이번 주 스케줄 생각만 해도 멘붕", scores: { joy: 0, fatigue: 1, stress: 4, calm: 0, excitement: 0 } },
      { label: "루틴대로 차분하게 준비", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 15,
    mood: "fatigue",
    content: "밤 11시에 유튜브 알고리즘이 맛집 브이로그를 띄웠다.",
    options: [
      { label: "배고프지만 행복한 ASMR... 최고", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "보다가 자는 게 국룰", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "야식 먹으면 살찌는데... 갈등", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "내일 점심에 가봐야지 메모", scores: { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 } },
    ],
  },
  {
    id: 16,
    mood: "fatigue",
    content: "운동 예약을 해놨는데 가기 30분 전이다.",
    options: [
      { label: "가면 개운할 거야, 가자!", scores: { joy: 2, fatigue: 0, stress: 0, calm: 1, excitement: 2 } },
      { label: "취소 버튼에 손이 간다", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "노쇼 벌금 생각에 억지로 준비", scores: { joy: 0, fatigue: 1, stress: 3, calm: 0, excitement: 1 } },
      { label: "가볍게 스트레칭이라도 하고 가자", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },

  // ━━━ STRESS (스트레스) 17~24 ━━━
  {
    id: 17,
    mood: "stress",
    content: "카톡 단체방에서 나만 빼고 약속을 잡고 있다.",
    options: [
      { label: "먼저 '나도!!' 외치기", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "읽씹하고 자기", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "은근 서운하고 뭔가 빡친다", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "뭐 그럴 수도 있지~ 신경 안 씀", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 18,
    mood: "stress",
    content: "상사가 '이거 오늘까지 가능하죠?'라고 웃으며 말했다.",
    options: [
      { label: "네! 해보겠습니다 (진심으로)", scores: { joy: 2, fatigue: 0, stress: 1, calm: 0, excitement: 2 } },
      { label: "네... (이미 체력 방전 상태)", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "미소 뒤에 숨겨진 분노 게이지 MAX", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "일단 수락하고 차분하게 계획 세우기", scores: { joy: 0, fatigue: 0, stress: 1, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 19,
    mood: "stress",
    content: "쿠팡에서 환불 신청했는데 '검토 중'이 3일째다.",
    options: [
      { label: "기다리면 되겠지~ 다른 거 구경 중", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "확인할 기력도 없다 알아서 해줘...", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "고객센터 전화 누르는 손이 떨린다", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "한 번 더 문의하고 기다리기", scores: { joy: 0, fatigue: 0, stress: 1, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 20,
    mood: "stress",
    content: "인스타에 전 남/여친이 새 연인과 찍은 사진을 올렸다.",
    options: [
      { label: "잘 살아라~ 나도 잘 산다", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "관심 없다 (폰 내려놓고 눕기)", scores: { joy: 0, fatigue: 3, stress: 0, calm: 2, excitement: 0 } },
      { label: "왜 기분이 이런 거지... 복잡하다", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "차단은 안 하지만 스토리 숨김", scores: { joy: 0, fatigue: 0, stress: 1, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 21,
    mood: "stress",
    content: "오늘 PT인데 트레이너가 '오늘 좀 세게 갑시다' 라고 했다.",
    options: [
      { label: "좋아요! 오늘 한계 돌파!", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "이미 여기 온 것만으로 충분하다고요", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "제가 뭔 잘못을 했길래...", scores: { joy: 0, fatigue: 1, stress: 4, calm: 0, excitement: 0 } },
      { label: "네~ (페이스 조절은 내가 한다)", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 22,
    mood: "stress",
    content: "핸드폰 액정이 깨졌다. 수리비가 30만원이란다.",
    options: [
      { label: "그래도 데이터 살았으니 다행!", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "아... 그냥 이대로 쓸래요", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "이번 달 카드값 어쩌냐 멘탈붕괴", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "보험 있나 확인하고 차근차근 해결", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
  {
    id: 23,
    mood: "stress",
    content: "부모님이 '요즘 뭐 하니? 결혼은?' 이라고 물어봤다.",
    options: [
      { label: "ㅋㅋㅋ 열심히 살고 있습니다~", scores: { joy: 3, fatigue: 0, stress: 1, calm: 1, excitement: 0 } },
      { label: "통화할 에너지가 부족합니다...", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "왜 맨날 그 얘기야 진짜...", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "네네~ 하고 화제 전환 스킬 발동", scores: { joy: 0, fatigue: 0, stress: 1, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 24,
    mood: "stress",
    content: "발표 자료 만들다가 저장 안 하고 프로그램이 꺼졌다.",
    options: [
      { label: "ㅋㅋㅋ 이럴 줄 알았어 (자동저장 있음)", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "... (멍하니 모니터 바라보기)", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "소리 지르고 싶다 진심으로", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "심호흡하고 다시 만들기 시작", scores: { joy: 0, fatigue: 0, stress: 1, calm: 4, excitement: 0 } },
    ],
  },

  // ━━━ CALM (평온) 25~32 ━━━
  {
    id: 25,
    mood: "calm",
    content: "비 오는 일요일, 이불 속에서 빗소리를 듣고 있다.",
    options: [
      { label: "비 오는 날 + 이불 = 세상 행복", scores: { joy: 3, fatigue: 0, stress: 0, calm: 2, excitement: 0 } },
      { label: "비 오니까 더 못 일어나겠다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "빨래 걸어놨는데... 망했다", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "빗소리 ASMR이 따로 없다", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 26,
    mood: "calm",
    content: "아무도 없는 한적한 카페에 혼자 앉아있다.",
    options: [
      { label: "나만의 아지트 발견! 기분 좋다", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "커피 마시다 졸 것 같다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "혼자라는 게 갑자기 외롭다", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "이 고요함이 진짜 좋다", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 27,
    mood: "calm",
    content: "고양이가 내 무릎 위에서 잠들었다.",
    options: [
      { label: "세상에서 제일 행복한 집사", scores: { joy: 4, fatigue: 0, stress: 0, calm: 1, excitement: 0 } },
      { label: "나도 같이 잠들 것 같다", scores: { joy: 0, fatigue: 3, stress: 0, calm: 2, excitement: 0 } },
      { label: "화장실 가고 싶은데 못 움직여...", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "이 평화를 영원히 간직하고 싶다", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 28,
    mood: "calm",
    content: "넷플릭스 뭐 볼지 30분째 고르는 중이다.",
    options: [
      { label: "고르는 것도 재미의 일부!", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "고르다가 잠들어버렸다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "왜 볼 게 없지 짜증난다", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "뭐든 틀어놓고 그냥 편하게", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 29,
    mood: "calm",
    content: "아침에 일어났는데 알람보다 10분 먼저 깼다.",
    options: [
      { label: "보너스 10분! 개이득 기분", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "10분이면 더 잘 수 있었는데", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "왜 깼지? 불안해서 폰 확인", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "여유롭게 기지개 펴는 아침", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 30,
    mood: "calm",
    content: "마트에서 장 보면서 천천히 걸어다니는 중이다.",
    options: [
      { label: "시식 코너 발견! 오늘의 하이라이트", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "카트 밀면서 졸리다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "예산 초과될 것 같아 계산 중", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "이것저것 구경하는 게 힐링", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 31,
    mood: "calm",
    content: "퇴근 후 한강 공원 벤치에 앉아있다.",
    options: [
      { label: "치킨 시켜서 여기서 먹어야지!", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "벤치에서 바로 잠들 자신 있다", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "벌레 나올까 봐 신경 쓰인다", scores: { joy: 0, fatigue: 0, stress: 3, calm: 1, excitement: 1 } },
      { label: "바람 맞으며 멍 때리기 최고", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 32,
    mood: "calm",
    content: "일요일 저녁, 내일은 월요일이다.",
    options: [
      { label: "이번 주도 화이팅! 긍정 마인드", scores: { joy: 3, fatigue: 0, stress: 0, calm: 1, excitement: 1 } },
      { label: "주말이 왜 이렇게 짧은 거야...", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "월요병 예약 완료... 벌써 싫다", scores: { joy: 0, fatigue: 1, stress: 4, calm: 0, excitement: 0 } },
      { label: "지금 이 순간에 집중하자", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },

  // ━━━ EXCITEMENT (설렘) 33~40 ━━━
  {
    id: 33,
    mood: "excitement",
    content: "소개팅 상대에게 첫 카톡이 왔다.",
    options: [
      { label: "심장 터질 것 같아 답장 뭐라 하지", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "답장은 내일... 지금은 에너지 부족", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "프로필 분석 들어간다 (스토킹 아님)", scores: { joy: 0, fatigue: 0, stress: 2, calm: 0, excitement: 3 } },
      { label: "쿨하게 인사하고 자연스럽게", scores: { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 } },
    ],
  },
  {
    id: 34,
    mood: "excitement",
    content: "콘서트 티켓팅에 성공했다!",
    options: [
      { label: "비명 지르는 중 이웃 미안", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "기쁜데 카드값이 무섭다", scores: { joy: 0, fatigue: 2, stress: 3, calm: 0, excitement: 0 } },
      { label: "좌석 좋은 건지 확인 또 확인", scores: { joy: 0, fatigue: 0, stress: 2, calm: 0, excitement: 3 } },
      { label: "성공 확인하고 차분하게 뿌듯", scores: { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 } },
    ],
  },
  {
    id: 35,
    mood: "excitement",
    content: "내일 해외여행 출발이다. 짐을 싸는 중.",
    options: [
      { label: "잠이 안 온다 설레서 미칠 것 같아", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "짐 싸다가 지쳐서 내일 아침에 할래", scores: { joy: 0, fatigue: 4, stress: 1, calm: 0, excitement: 0 } },
      { label: "여권 확인 7번째... 불안 무한루프", scores: { joy: 0, fatigue: 0, stress: 3, calm: 0, excitement: 2 } },
      { label: "체크리스트 보면서 차근차근 준비", scores: { joy: 1, fatigue: 0, stress: 0, calm: 3, excitement: 1 } },
    ],
  },
  {
    id: 36,
    mood: "excitement",
    content: "좋아하는 웹툰이 시즌2 연재를 시작했다.",
    options: [
      { label: "광클해서 바로 정주행 시작", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "읽을 힘이... 주말에 몰아보자", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "시즌1만큼 재밌을까 걱정반 기대반", scores: { joy: 0, fatigue: 0, stress: 2, calm: 0, excitement: 3 } },
      { label: "모아뒀다가 한번에 읽는 게 국룰", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 37,
    mood: "excitement",
    content: "갑자기 옛날 짝사랑이 연락이 왔다.",
    options: [
      { label: "?!?!? 심장 쿵쾅 대혼란", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "읽고 나중에 답하기 (귀찮)", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "뭔 의도지? 일단 의심부터", scores: { joy: 0, fatigue: 0, stress: 3, calm: 0, excitement: 2 } },
      { label: "반가운 마음에 편하게 대화", scores: { joy: 2, fatigue: 0, stress: 0, calm: 3, excitement: 0 } },
    ],
  },
  {
    id: 38,
    mood: "excitement",
    content: "퇴근하고 집 앞 편의점에서 복권을 긁는 중이다.",
    options: [
      { label: "한 숫자씩 긁을 때마다 심장 폭발", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "결과는 뻔해... 그냥 긁는 중", scores: { joy: 0, fatigue: 3, stress: 0, calm: 2, excitement: 0 } },
      { label: "안 되면 2천원 날린 거잖아 ㅠ", scores: { joy: 0, fatigue: 0, stress: 3, calm: 0, excitement: 2 } },
      { label: "당첨이든 아니든 소소한 재미", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 39,
    mood: "excitement",
    content: "새로 산 옷 입고 거울 앞에 섰다.",
    options: [
      { label: "거울아 거울아 세상에서 누가 제일... 나다", scores: { joy: 3, fatigue: 0, stress: 0, calm: 0, excitement: 2 } },
      { label: "입긴 입었는데 어디 나갈 힘이 없네", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "이게 맞나... 교환할까 고민 시작", scores: { joy: 0, fatigue: 0, stress: 3, calm: 0, excitement: 2 } },
      { label: "나쁘지 않군, 만족스러워", scores: { joy: 1, fatigue: 0, stress: 0, calm: 4, excitement: 0 } },
    ],
  },
  {
    id: 40,
    mood: "excitement",
    content: "친구가 '나 너한테 할 말 있어'라고 했다.",
    options: [
      { label: "뭔데뭔데!! 궁금해 죽겠다", scores: { joy: 2, fatigue: 0, stress: 0, calm: 0, excitement: 3 } },
      { label: "지금은 못 들을 것 같아... 내일 해줘", scores: { joy: 0, fatigue: 4, stress: 0, calm: 1, excitement: 0 } },
      { label: "혹시 안 좋은 얘긴가... 불안 폭주", scores: { joy: 0, fatigue: 0, stress: 4, calm: 0, excitement: 1 } },
      { label: "그래 편하게 말해~ (차분)", scores: { joy: 0, fatigue: 0, stress: 0, calm: 4, excitement: 1 } },
    ],
  },
];
