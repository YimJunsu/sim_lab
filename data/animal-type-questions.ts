/**
 * 동물상 테스트 - 40개 질문 데이터
 * 여자용 20개 + 남자용 20개
 * 5가지 성향: warmth(다정함), energy(활력), wit(재치), calm(차분함), charm(매력)
 */

import type { AnimalScores, AnimalGender } from "@/lib/animal-type-questions";

export interface AnimalQuestion {
  id: number;
  gender: AnimalGender;
  content: string;
  options: { label: string; scores: AnimalScores }[];
}

export const ALL_ANIMAL_QUESTIONS: AnimalQuestion[] = [
  // ━━━ 여자용 질문 1~20 ━━━
  {
    id: 1,
    gender: "female",
    content: "그녀가 카페에서 음료를 고를 때, 이런 모습이면 심쿵.",
    options: [
      { label: "뭐 먹을지 고민하다가 나한테 골라달라는 표정", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "메뉴판 보자마자 바로 이거! 하는 자신감", scores: { warmth: 0, energy: 4, wit: 1, calm: 0, charm: 0 } },
      { label: "이 카페 시그니처가 뭐예요? 바리스타랑 대화하는 센스", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용히 메뉴 읽다가 살짝 미소 짓는 모습", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 2,
    gender: "female",
    content: "길 가다 귀여운 강아지를 만났을 때 그녀의 반응은?",
    options: [
      { label: "아 너무 귀여워!! 바닥에 앉아서 쓰다듬기", scores: { warmth: 4, energy: 1, wit: 0, calm: 0, charm: 0 } },
      { label: "강아지한테 달려가서 사진 찍기 시작", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "이 견종이 뭔지 설명해주면서 TMI 폭발", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "살짝 눈 마주치고 조용히 미소만", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 3,
    gender: "female",
    content: "그녀가 웃을 때 이런 웃음이면 빠진다.",
    options: [
      { label: "눈이 초승달 되면서 해맑게 웃는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 0, charm: 1 } },
      { label: "크게 깔깔깔 소리 내면서 터지는 웃음", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "피식 하고 코웃음 치는데 그게 매력적인", scores: { warmth: 0, energy: 0, wit: 3, calm: 0, charm: 2 } },
      { label: "입꼬리만 살짝 올라가는 미스터리한 미소", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 4,
    gender: "female",
    content: "데이트 중 갑자기 비가 올 때, 이런 반응이면 좋겠다.",
    options: [
      { label: "내 팔 꼭 잡고 빨리 뛰자! 하면서 웃는 거", scores: { warmth: 4, energy: 1, wit: 0, calm: 0, charm: 0 } },
      { label: "비 맞으면서 뛰어다니자! 하는 즉흥 텐션", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "여기 처마 밑이 괜찮을 것 같은데? 빠르게 판단", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "비 소리 좋다… 잠깐 서서 듣자", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 5,
    gender: "female",
    content: "밤에 전화했을 때, 이런 목소리면 잠이 안 올 것 같다.",
    options: [
      { label: "오늘 하루 어땠어~ 하고 다정하게 물어보는", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "야 오늘 진짜 웃긴 일 있었어! 텐션 가득", scores: { warmth: 0, energy: 4, wit: 1, calm: 0, charm: 0 } },
      { label: "갑자기 이상한 퀴즈 내면서 장난치는", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용히 숨소리만 들리는데 그게 편안한", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 6,
    gender: "female",
    content: "그녀의 인스타 피드 스타일이 이러면 관심 간다.",
    options: [
      { label: "일상 가득, 맛집/카페 사진에 귀여운 셀카", scores: { warmth: 3, energy: 1, wit: 0, calm: 0, charm: 1 } },
      { label: "여행/액티비티 사진 가득한 활동적인 피드", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "감성 사진에 위트 있는 캡션이 포인트", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "미니멀하게 가끔 올리는 감성 피드", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 7,
    gender: "female",
    content: "처음 만났을 때 이런 인상이면 마음이 간다.",
    options: [
      { label: "따뜻한 눈빛으로 먼저 인사해주는 사람", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "밝은 에너지로 분위기를 띄우는 사람", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "센스 있는 첫마디로 웃게 만드는 사람", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용히 있는데 묘하게 시선이 가는 사람", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
  {
    id: 8,
    gender: "female",
    content: "같이 놀이공원 갔을 때, 이런 모습이 좋다.",
    options: [
      { label: "무서운 거 타면서 내 팔 꽉 잡는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 0, charm: 1 } },
      { label: "이것도 타자 저것도 타자! 체력 괴물", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "인형뽑기에서 전략 짜면서 도전하는 모습", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "벤치에 앉아서 함께 간식 먹으며 여유", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 9,
    gender: "female",
    content: "싸웠을 때, 이런 화해 방식이면 바로 풀린다.",
    options: [
      { label: "미안해… 하면서 안아주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "갑자기 맛있는 거 사들고 나타나는 서프라이즈", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "웃긴 사과 영상 만들어서 보내기", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "차분하게 대화로 풀어나가자고 하는 거", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 10,
    gender: "female",
    content: "그녀가 요리해줄 때, 이런 스타일이면 심장이 뛴다.",
    options: [
      { label: "맛봐봐~ 하면서 떠먹여주는 다정함", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "신나게 노래 부르면서 요리하는 텐션", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "레시피 없이 감으로 맛있게 뚝딱 만드는 센스", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "정성스럽게 플레이팅까지 완벽하게 하는 거", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 11,
    gender: "female",
    content: "같이 영화 볼 때, 이런 리액션이면 더 집중이 안 된다.",
    options: [
      { label: "슬픈 장면에서 눈물 글썽이며 내 팔 잡는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 0, charm: 1 } },
      { label: "흥미로운 장면마다 와! 하고 리액션 폭발", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "복선 찾으면서 추리하는 거 진짜 귀여워", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "어깨에 기대서 조용히 보는 게 제일 좋다", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 12,
    gender: "female",
    content: "그녀의 패션 스타일이 이러면 눈을 못 뗀다.",
    options: [
      { label: "편하고 귀여운 캐주얼 (맨투맨+볼캡)", scores: { warmth: 3, energy: 1, wit: 0, calm: 1, charm: 0 } },
      { label: "트렌디하고 과감한 스타일링", scores: { warmth: 0, energy: 3, wit: 0, calm: 0, charm: 2 } },
      { label: "남들과 다른 유니크한 감성 코디", scores: { warmth: 0, energy: 0, wit: 3, calm: 0, charm: 2 } },
      { label: "깔끔하고 단정한 미니멀 룩", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 13,
    gender: "female",
    content: "카톡으로 이런 메시지가 오면 하루가 행복하다.",
    options: [
      { label: "밥 먹었어? 오늘 날씨 추우니까 따뜻하게 입어~", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "야 이거 봐 ㅋㅋㅋㅋ (웃긴 영상 폭격)", scores: { warmth: 0, energy: 4, wit: 1, calm: 0, charm: 0 } },
      { label: "갑자기 궁금한 건데, 너 MBTI가 뭐야?", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "오늘 하늘 예쁘더라 (사진 한 장)", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 14,
    gender: "female",
    content: "같이 술 마실 때, 이런 모습이면 더 좋아진다.",
    options: [
      { label: "술 취하면 평소보다 더 다정해지는 모습", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "텐션 올라가면서 재밌는 에피소드 폭풍 공유", scores: { warmth: 0, energy: 4, wit: 1, calm: 0, charm: 0 } },
      { label: "술 게임 천재, 센스 있는 벌칙 제안", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용히 마시면서 깊은 이야기 나누는 타입", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 15,
    gender: "female",
    content: "여행지에서 이런 모습을 보면 더 끌린다.",
    options: [
      { label: "이거 같이 먹어보자! 맛집 탐방 러버", scores: { warmth: 3, energy: 2, wit: 0, calm: 0, charm: 0 } },
      { label: "여기서 점프샷 찍자! 활동적인 포토그래퍼", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "이 건물이 원래는~ 하면서 해설해주는 박학다식", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "경치 보면서 그냥 걷자 하는 여유로운 감성", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 16,
    gender: "female",
    content: "기념일에 이런 서프라이즈면 완벽하다.",
    options: [
      { label: "내가 좋아하는 거 기억해서 깜짝 선물", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "갑자기 여행 예약해놓고 짐 싸! 하는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "직접 만든 퀴즈 게임으로 선물 찾기 이벤트", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "손편지 + 작은 꽃다발로 진심 전달", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 17,
    gender: "female",
    content: "내가 힘들 때, 이렇게 해주면 마음이 녹는다.",
    options: [
      { label: "말없이 안아주면서 괜찮아 한마디", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "맛있는 거 먹으러 가자! 기분 전환시켜주기", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "상황 분석해서 해결책까지 같이 고민해주는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "조용히 옆에 앉아서 그냥 같이 있어주는 거", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 18,
    gender: "female",
    content: "친구들한테 그녀를 소개할 때, 이런 모습이면 자랑스럽다.",
    options: [
      { label: "친구들한테도 다정하게 대하는 모습", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "분위기 메이커로 금방 친해지는 사교성", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "재치 있는 유머로 분위기 장악하는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "차분하고 예의 바르게 인사하는 모습", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 19,
    gender: "female",
    content: "잠들기 전 마지막 연락이 이러면 행복하게 잠든다.",
    options: [
      { label: "오늘 고마웠어, 내일도 좋은 하루 보내♥", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "내일 뭐 하지?! 벌써 신나ㅋㅋ", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "아 근데 아까 그 얘기 결론이 뭐였지 ㅋㅋ", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "잘 자 (짧지만 따뜻한 한마디)", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 20,
    gender: "female",
    content: "그녀의 이런 습관이 은근 매력적이다.",
    options: [
      { label: "추우면 자기 패딩 벗어서 덮어주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "새로운 맛집이나 카페를 끊임없이 발굴하는 거", scores: { warmth: 0, energy: 4, wit: 1, calm: 0, charm: 0 } },
      { label: "일상에서 웃긴 포인트를 귀신같이 찾아내는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "멍 때리다가 예쁜 풍경에 멈추는 감성", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },

  // ━━━ 남자용 질문 21~40 ━━━
  {
    id: 21,
    gender: "male",
    content: "그가 운전할 때, 이런 모습이면 옆자리가 행복하다.",
    options: [
      { label: "한 손으로 운전하면서 다른 손은 내 손 잡는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "좋아하는 노래 틀면서 같이 떼창하는 텐션", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "맛집 루트 완벽하게 짜온 드라이브 기획자", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "조용히 운전하는데 그 모습 자체가 멋있는", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 22,
    gender: "male",
    content: "그가 웃을 때, 이런 웃음에 심장이 뛴다.",
    options: [
      { label: "눈이 없어질 정도로 환하게 웃는 거", scores: { warmth: 4, energy: 1, wit: 0, calm: 0, charm: 0 } },
      { label: "크게 하하! 하면서 호쾌하게 웃는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "피식 하면서 나만 웃기다는 듯한 웃음", scores: { warmth: 0, energy: 0, wit: 3, calm: 0, charm: 2 } },
      { label: "입꼬리만 슬쩍 올라가는 여유로운 미소", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 23,
    gender: "male",
    content: "같이 밥 먹을 때, 이런 모습이면 더 좋아진다.",
    options: [
      { label: "맛있는 거 자기 먼저 내 접시에 올려주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "맛있으면 맛있다고 리액션 크게 해주는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "이 메뉴 궁합이 좋대~ 하면서 페어링 추천", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "천천히 음식 음미하면서 분위기 즐기는 거", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 24,
    gender: "male",
    content: "첫 만남에서 이런 인상이면 두 번째가 기대된다.",
    options: [
      { label: "대화 중 내 말에 진심으로 공감해주는 사람", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "에너지 넘치고 적극적으로 이야기하는 사람", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "위트 있는 말투에 은근 박학다식한 사람", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "말은 적지만 눈빛에 깊이가 느껴지는 사람", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
  {
    id: 25,
    gender: "male",
    content: "그가 운동하는 모습을 보면 이런 게 매력적이다.",
    options: [
      { label: "같이 하자면서 자세 잡아주는 다정함", scores: { warmth: 4, energy: 1, wit: 0, calm: 0, charm: 0 } },
      { label: "운동에 진심인 열정적인 모습 그 자체", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "운동 루틴 분석하면서 효율적으로 하는 스마트함", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "조용히 집중하는데 그 모습이 그냥 멋있는 거", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
  {
    id: 26,
    gender: "male",
    content: "카톡 프사가 이런 거면 호감도 올라간다.",
    options: [
      { label: "따뜻한 느낌의 일상 셀카", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "여행이나 액티비티 하는 활동적인 사진", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "센스 있는 밈이나 위트 있는 사진", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "감성적인 풍경 사진이나 예술적인 컷", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 27,
    gender: "male",
    content: "같이 게임할 때, 이런 스타일이면 더 재밌다.",
    options: [
      { label: "초보인 나한테 친절하게 알려주는 다정함", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "승부욕 불타면서 열정적으로 하는 모습", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "전략 짜서 효율적으로 이기는 머리 플레이", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "이기든 지든 편하게 즐기는 여유로운 태도", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 28,
    gender: "male",
    content: "내가 아플 때, 이런 반응이면 감동이다.",
    options: [
      { label: "약 사오고 죽 끓여주면서 곁에 있어주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "당장 병원 가자! 차 빼고 데려다주는 행동파", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "증상 검색해서 가장 좋은 대처법 알려주는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "조용히 이마에 손 대보면서 걱정하는 눈빛", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 29,
    gender: "male",
    content: "그가 일하는 모습을 봤을 때, 이런 게 멋있다.",
    options: [
      { label: "후배한테 친절하게 설명해주는 선배 바이브", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "열정적으로 프레젠테이션하는 에너지", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "문제를 창의적으로 해결하는 똑똑함", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "묵묵히 집중하는 진지한 옆모습", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 30,
    gender: "male",
    content: "데이트 코스를 이렇게 짜오면 감동이다.",
    options: [
      { label: "내가 먹고 싶다고 한 거 기억해서 예약해놓은 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "이것저것 빽빽하게 알찬 하루 계획", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "남들 모르는 히든 스팟 발굴해온 센스", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "일단 만나서 느긋하게 정하자는 여유", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 31,
    gender: "male",
    content: "같이 사진 찍을 때, 이런 모습이 좋다.",
    options: [
      { label: "자연스럽게 어깨 감싸면서 찍는 다정함", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "여러 포즈 제안하면서 즐겁게 찍는 텐션", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "각도 맞춰서 내 인생샷 찍어주는 센스", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "편하게 웃으면서 자연스러운 스냅 컷", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 32,
    gender: "male",
    content: "친구 모임에서 그의 이런 모습에 몰래 뿌듯하다.",
    options: [
      { label: "내 친구들한테도 친절하고 배려하는 모습", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "분위기 띄우면서 자연스럽게 어울리는 사교성", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "대화 중에 센스 있는 한마디로 좌중을 장악", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용히 있는데 묘한 존재감이 느껴지는 거", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
  {
    id: 33,
    gender: "male",
    content: "싸웠을 때, 이런 모습이면 화가 풀린다.",
    options: [
      { label: "진심으로 미안하다고 먼저 연락하는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "갑자기 나타나서 맛있는 거 같이 먹자고 하는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "냉정하게 분석하면서도 내 입장 이해해주는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "시간 두고 천천히 대화로 풀자고 하는 차분함", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 34,
    gender: "male",
    content: "밤 늦게 통화할 때, 이런 목소리면 잠이 안 온다.",
    options: [
      { label: "나지막하게 오늘 고마웠어 하는 따뜻한 톤", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "내일 뭐하지? 벌써 기대된다! 하는 밝은 톤", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "갑자기 OX 퀴즈 내면서 장난치는 텐션", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "저음으로 잘 자… 한마디에 심장 쿵", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
  {
    id: 35,
    gender: "male",
    content: "그의 취미가 이러면 더 매력적으로 느껴진다.",
    options: [
      { label: "요리나 베이킹 같은 따뜻한 취미", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "서핑, 클라이밍 같은 액티비티 취미", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "퍼즐, 프로그래밍 같은 두뇌 취미", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "독서, 음악감상 같은 조용한 취미", scores: { warmth: 0, energy: 0, wit: 0, calm: 4, charm: 1 } },
    ],
  },
  {
    id: 36,
    gender: "male",
    content: "같이 쇼핑할 때, 이런 모습이면 점수 UP.",
    options: [
      { label: "이거 너한테 잘 어울릴 것 같아 하면서 골라주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 0, charm: 1 } },
      { label: "이것도 입어봐 저것도! 하면서 같이 신나는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "소재랑 가성비 분석하면서 쇼핑 도와주는 거", scores: { warmth: 0, energy: 0, wit: 4, calm: 1, charm: 0 } },
      { label: "벤치에서 기다리면서 짐 들어주는 묵묵함", scores: { warmth: 1, energy: 0, wit: 0, calm: 4, charm: 0 } },
    ],
  },
  {
    id: 37,
    gender: "male",
    content: "기념일에 이런 모습이면 평생 기억에 남을 것 같다.",
    options: [
      { label: "내가 전에 갖고 싶다고 한 거 기억해서 선물하는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "갑자기 깜짝 여행 예약해놓은 서프라이즈", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "영상편지나 포토북 같은 아이디어 선물", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "조용한 곳에서 진심 담은 편지 읽어주는 거", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 38,
    gender: "male",
    content: "길 가다 이런 모습을 보면 심장이 뛴다.",
    options: [
      { label: "차도 쪽에 서서 자연스럽게 자리 바꿔주는 거", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "여기 맛있는 데 있어! 하면서 손 잡고 뛰는 거", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "지나가다 재밌는 거 발견하고 같이 키득키득", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "나란히 걸으면서 손등에 살짝 손가락 거는 거", scores: { warmth: 1, energy: 0, wit: 0, calm: 3, charm: 1 } },
    ],
  },
  {
    id: 39,
    gender: "male",
    content: "그의 패션이 이러면 자꾸 쳐다보게 된다.",
    options: [
      { label: "편안한 니트에 따뜻한 느낌의 코디", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "핏 좋은 셔츠나 활동적인 스포티 룩", scores: { warmth: 0, energy: 3, wit: 0, calm: 0, charm: 2 } },
      { label: "남들과 다른 유니크한 아이템 포인트", scores: { warmth: 0, energy: 0, wit: 3, calm: 0, charm: 2 } },
      { label: "올블랙이나 깔끔한 미니멀 스타일", scores: { warmth: 0, energy: 0, wit: 0, calm: 3, charm: 2 } },
    ],
  },
  {
    id: 40,
    gender: "male",
    content: "잠들기 전 마지막 연락이 이러면 꿈에서도 웃겠다.",
    options: [
      { label: "오늘 너 때문에 행복했어. 잘 자, 좋은 꿈 꿔", scores: { warmth: 4, energy: 0, wit: 0, calm: 1, charm: 0 } },
      { label: "내일 진짜 재밌는 거 해보자!! 기대해!", scores: { warmth: 0, energy: 4, wit: 0, calm: 0, charm: 1 } },
      { label: "아까 그거 왜 웃겼는지 지금 생각해도 ㅋㅋ", scores: { warmth: 0, energy: 0, wit: 4, calm: 0, charm: 1 } },
      { label: "…잘 자 (짧지만 괜히 설레는 한마디)", scores: { warmth: 0, energy: 0, wit: 0, calm: 2, charm: 3 } },
    ],
  },
];
