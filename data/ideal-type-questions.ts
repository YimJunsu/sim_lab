/**
 * 이상형 성향 테스트 - 40개 질문 데이터
 * 성향당 8개씩: leader(주도형), romantic(감성형), stable(신뢰형), humorous(에너지형), intellectual(브레인형)
 * 각 옵션은 5개 성향에 대한 점수를 직접 포함
 */

import type { IdealTypeScores } from "@/lib/ideal-type-questions";

export interface IdealTypeQuestion {
  id: number;
  category: keyof IdealTypeScores;
  content: string;
  options: { label: string; scores: IdealTypeScores }[];
}

export const ALL_QUESTIONS: IdealTypeQuestion[] = [
  // ━━━ LEADER (주도형) 1~8 ━━━
  {
    id: 1,
    category: "leader",
    content: "금요일 저녁, 데이트 장소를 정해야 하는 상황.",
    options: [
      { label: "여기 가자, 내가 다 알아봤어", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "분위기 좋은 데 찾아봤는데 같이 볼래?", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "우리 단골 가자, 거기가 편하잖아", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "일단 나가! 걷다 보면 뭐가 되겠지", scores: { leader: 1, romantic: 0, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 2,
    category: "leader",
    content: "회사에서 멘탈 나간 날, 연인한테 연락이 왔다.",
    options: [
      { label: "당장 퇴근해, 내가 데리러 갈게", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "힘들었지… 오늘 좋아하는 거 사줄게", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "괜찮아, 옆에 있을게 (조용히 같이)", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "ㅋㅋ 상사 성대모사 해줄까?", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 3,
    category: "leader",
    content: "연인과 해외여행 계획 중. 어떤 스타일이 좋아?",
    options: [
      { label: "동선, 맛집, 숙소 다 짜온 갓생 플래너", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "일출 보자고 새벽에 깨우는 감성파", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "무리 없이 여유롭게, 쉬는 것도 여행", scores: { leader: 0, romantic: 0, stable: 4, humorous: 1, intellectual: 0 } },
      { label: "지도 없이 걷다가 맛집 발견하는 즉흥파", scores: { leader: 1, romantic: 0, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 4,
    category: "leader",
    content: "친구들이랑 같이 놀 때, 연인의 이런 모습이 좋다.",
    options: [
      { label: "자연스럽게 분위기 장악하는 인싸력", scores: { leader: 4, romantic: 0, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "내 옆에서 몰래 손 잡아주는 센스", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "조용히 옆에서 웃으며 함께하는 것", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "분위기 메이커로 다 웃기는 텐션", scores: { leader: 1, romantic: 0, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 5,
    category: "leader",
    content: "의견이 다를 때 이런 반응이면 오히려 끌린다.",
    options: [
      { label: "논리적으로 설득하는데 묘하게 멋있음", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "네 마음이 더 중요해, 네가 정해", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "감정 빼고 타협점을 찾는 쿨함", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "ㅋㅋ 일단 밥 먹고 하자 (분위기 전환)", scores: { leader: 0, romantic: 0, stable: 1, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 6,
    category: "leader",
    content: "소개팅에서 이런 첫인상이면 관심 간다.",
    options: [
      { label: "눈빛부터 자신감 있는 사람", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "말투가 부드럽고 다정한 사람", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "차분하고 편안한 바이브의 사람", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "유쾌해서 바로 웃게 만드는 사람", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 7,
    category: "leader",
    content: "서프라이즈를 받는다면 어떤 게 좋아?",
    options: [
      { label: "계획적으로 준비한 완벽한 이벤트", scores: { leader: 4, romantic: 1, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "직접 쓴 편지 + 작은 선물", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "좋아하는 음식 냉장고에 넣어두기", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "웃기면서 감동적인 틱톡 영상 제작", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 8,
    category: "leader",
    content: "이런 고백이면 마음이 흔들린다.",
    options: [
      { label: "내가 너 행복하게 해줄 자신 있어", scores: { leader: 4, romantic: 1, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "너를 알고 나서 세상이 달라 보여", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "너랑 있으면 편하고 안심이 돼", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "너 때문에 매일 볼살이 아파 (웃느라)", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },

  // ━━━ ROMANTIC (감성형) 9~16 ━━━
  {
    id: 9,
    category: "romantic",
    content: "비 오는 퇴근길, 연인이랑 같이라면?",
    options: [
      { label: "우산 하나에 어깨 딱 붙이고 걷기", scores: { leader: 1, romantic: 4, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "근처 카페 들어가서 창밖 비 구경", scores: { leader: 0, romantic: 3, stable: 2, humorous: 0, intellectual: 0 } },
      { label: "빠르게 집 가서 담요 + 넷플릭스", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "비 맞으면서 물웅덩이 점프 대회", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 10,
    category: "romantic",
    content: "100일. 연인이 이렇게 해주면 진짜 감동.",
    options: [
      { label: "완벽한 코스 디너 예약 + 드레스 코드", scores: { leader: 4, romantic: 1, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "우리 추억 담은 포토북 직접 제작", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "특별한 건 없어도 진심 어린 말 한마디", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "깜짝 밈 영상으로 웃기면서 축하", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 11,
    category: "romantic",
    content: "연인 인스타에 올라온 이 게시물에 심쿵.",
    options: [
      { label: "승진했다는 글 + 자신감 넘치는 셀카", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "노을 사진에 의미심장한 글귀", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "소소한 일상 + 오늘 하루 감사 내용", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "센스 있는 밈이나 웃긴 릴스", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 12,
    category: "romantic",
    content: "밤 11시에 온 이 카톡에 심장이 뛴다.",
    options: [
      { label: "수고했어, 내일 점심 맛집 데려다줄게", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "달 진짜 예쁜데, 너 생각나서 찍었어", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "집 잘 도착했어? 따뜻하게 자", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "방금 본 릴스 찐이야 ㅋㅋㅋ 이거 봐", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 13,
    category: "romantic",
    content: "헤어지면 가장 그리울 것 같은 포인트는?",
    options: [
      { label: "항상 앞에서 끌어주던 든든함", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "별거 아닌 날도 특별하게 만든 감성", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "말없이도 편했던 그 공기감", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "매일 배꼽 빠지게 했던 그 웃음", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 14,
    category: "romantic",
    content: "같이 음악 듣는다면 이 조합이 최고.",
    options: [
      { label: "러닝할 때 같이 텐션 올리는 플리", scores: { leader: 3, romantic: 0, stable: 0, humorous: 2, intellectual: 0 } },
      { label: "잔잔한 재즈에 와인 한 잔", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "에어팟 한쪽씩 끼고 각자 멍", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "노래방에서 듀엣 부르며 폭소", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 15,
    category: "romantic",
    content: "카페에서 연인의 이런 모습에 몰입.",
    options: [
      { label: "메뉴 추천하면서 자연스럽게 결제", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "내 취향 기억하고 미리 주문해놓기", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "같이 각자 책 읽거나 작업하기", scores: { leader: 0, romantic: 0, stable: 3, humorous: 0, intellectual: 2 } },
      { label: "메뉴판 이상한 이름 찾기 대회 시작", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 16,
    category: "romantic",
    content: "연인의 이런 루틴에 사랑을 느낀다.",
    options: [
      { label: "같이 목표 세우고 계획 공유하기", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "매달 기념일에 손편지 쓰는 감성", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "매일 같은 시간 굿나잇 문자", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "아침마다 웃긴 짤 폭격", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },

  // ━━━ STABLE (신뢰형) 17~24 ━━━
  {
    id: 17,
    category: "stable",
    content: "처음 만난 사람, 이런 바이브면 호감.",
    options: [
      { label: "대화를 주도하며 빈틈없이 리드", scores: { leader: 4, romantic: 0, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "눈 맞추면서 진짜 들어주는 느낌", scores: { leader: 0, romantic: 3, stable: 2, humorous: 0, intellectual: 0 } },
      { label: "차분하게 말하는 안정감", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "재치 있는 한마디로 분위기 띄우기", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 18,
    category: "stable",
    content: "주말에 연인이랑 뭐 하면 제일 좋아?",
    options: [
      { label: "새로 뜬 핫플 탐방", scores: { leader: 3, romantic: 1, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "감성 전시회나 팝업 스토어", scores: { leader: 0, romantic: 3, stable: 0, humorous: 0, intellectual: 2 } },
      { label: "집에서 같이 요리하고 OTT", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "방탈출이나 VR 같은 거 신나게", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 19,
    category: "stable",
    content: "연애에서 이거 하나만은 진짜 중요하다.",
    options: [
      { label: "삶의 방향과 목표가 뚜렷한 것", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "감정 표현 잘하고 진심이 느껴지는 것", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "한결같고 말이랑 행동이 일치하는 것", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "같이 있으면 항상 텐션이 올라가는 것", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 20,
    category: "stable",
    content: "연인이 30분 지각. 이런 반응이면 OK.",
    options: [
      { label: "미안, 택시 탔어! (바로 해결 모드)", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "기다리라고 내가 좋아하는 노래 보내줌", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "미리 연락하고 진심으로 사과", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "미안 ㅋㅋ 벌칙으로 오늘 내가 다 쏨!", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 21,
    category: "stable",
    content: "장거리 연애라면 이런 스타일이 좋다.",
    options: [
      { label: "만날 날짜 확정 + 계획 빠르게 공유", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "매일 영상통화로 감정 나누기", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "꾸준한 연락으로 신뢰감 쌓기", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "밈이랑 릴스로 지루할 틈 없이", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 22,
    category: "stable",
    content: "동거하게 되면 이게 제일 중요.",
    options: [
      { label: "생활 규칙부터 인테리어까지 체계적으로", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "매일 아침 커피 내려주는 작은 정성", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "각자 공간과 시간 존중하는 것", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "집안일도 게임처럼 재밌게 하는 것", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 23,
    category: "stable",
    content: "연인이 새로운 도전을 한다고 하면?",
    options: [
      { label: "같이 전략 짜고 목표 셋팅 도와주기", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "응원 카드 + 관련 굿즈 선물", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "묵묵히 옆에서 서포트", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "힘들면 개그로 스트레스 해소 담당", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 24,
    category: "stable",
    content: "연인 친구들 처음 만나는 자리.",
    options: [
      { label: "적극적으로 인사하고 자연스럽게 섞임", scores: { leader: 4, romantic: 0, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "연인 옆에서 다정하게 함께", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "예의 바르게 인사, 편안한 대화", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "유머로 분위기 풀면서 빠르게 친해짐", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },

  // ━━━ HUMOROUS (에너지형) 25~32 ━━━
  {
    id: 25,
    category: "humorous",
    content: "싸우고 나서 이런 화해법이면 웃으면서 풀림.",
    options: [
      { label: "문제점 분석하고 해결책 제시", scores: { leader: 3, romantic: 0, stable: 0, humorous: 0, intellectual: 2 } },
      { label: "진심 담은 긴 카톡 메시지", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "냉각기 갖고 서로 정리할 시간", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "웃긴 사과 영상 찍어서 보내기", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 26,
    category: "humorous",
    content: "같이 요리하는 상황. 이상적인 분위기는?",
    options: [
      { label: "레시피 보면서 내가 지휘, 넌 서포트", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "서로 먹여주면서 달달하게", scores: { leader: 0, romantic: 4, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "역할 나눠서 효율적으로 뚝딱", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "밀가루 전쟁 ㅋㅋ 일단 장난부터", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 27,
    category: "humorous",
    content: "썸 탈 때 이런 시그널 보내는 사람?",
    options: [
      { label: "직진. 확실하게 마음 표현", scores: { leader: 4, romantic: 1, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "은근히 감성 플리 공유하면서 시그널", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "꾸준히 챙기면서 자연스럽게 다가옴", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "웃기면서 은근 설레는 톡 센스", scores: { leader: 0, romantic: 1, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 28,
    category: "humorous",
    content: "같이 운동한다면 이런 스타일이 좋아.",
    options: [
      { label: "목표 세우고 같이 달성하는 성취감", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "운동 끝나고 예쁜 카페 루틴", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "서로 페이스 맞춰서 무리 없이", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "배드민턴 같은 걸로 웃기게 대결", scores: { leader: 1, romantic: 0, stable: 0, humorous: 4, intellectual: 0 } },
    ],
  },
  {
    id: 29,
    category: "humorous",
    content: "연인의 웃는 모습 중 가장 좋은 건?",
    options: [
      { label: "뭔가 해냈을 때 뿌듯한 미소", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "나만 바라보며 짓는 살짝 수줍은 미소", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "평소에 자연스럽게 짓는 편안한 미소", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "깔깔깔 배꼽잡고 진심으로 웃는 모습", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 30,
    category: "humorous",
    content: "야식 먹는다면 어떤 무드?",
    options: [
      { label: "맛집 리스트에서 골라서 즉시 배달", scores: { leader: 3, romantic: 1, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "촛불 켜놓고 라면이라도 분위기 있게", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "냉장고 털어서 편하게 해먹기", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "먹방 찍으면서 리뷰하기 ㅋㅋ", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 31,
    category: "humorous",
    content: "연인이 나한테 별명을 지어준다면?",
    options: [
      { label: "뭔가 간지나는 별명 (대장, 킹 같은)", scores: { leader: 4, romantic: 0, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "달달한 별명 (자기야, 달링 같은)", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "편한 별명 (이름 줄임말 같은)", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "웃긴 별명 (감자, 두부, 뚱이 같은)", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 32,
    category: "humorous",
    content: "커플 사진 찍을 때 이런 게 좋다.",
    options: [
      { label: "인생샷 각도 잡아주기", scores: { leader: 3, romantic: 1, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "눈 맞추며 감성 컷", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "자연스러운 일상 스냅", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "변형 포즈 + 표정 개그 ㅋㅋ", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },

  // ━━━ INTELLECTUAL (브레인형) 33~40 ━━━
  {
    id: 33,
    category: "intellectual",
    content: "대화 중에 이 순간이 제일 매력적이다.",
    options: [
      { label: "꿈이랑 비전을 열정적으로 말할 때", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "서로의 감정을 솔직하게 나눌 때", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "편하게 일상 수다 떨 때", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "새로운 주제로 깊은 토론할 때", scores: { leader: 0, romantic: 0, stable: 0, humorous: 1, intellectual: 4 } },
    ],
  },
  {
    id: 34,
    category: "intellectual",
    content: "연인이 추천해준 콘텐츠를 봤을 때.",
    options: [
      { label: "자기계발 콘텐츠면 같이 실천 계획까지", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "감동적이면 밤새 감상 나누기", scores: { leader: 0, romantic: 3, stable: 0, humorous: 0, intellectual: 2 } },
      { label: "좋으면 좋다, 담백하게 리뷰", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "재밌는 장면 패러디하며 까르르", scores: { leader: 0, romantic: 0, stable: 0, humorous: 4, intellectual: 1 } },
    ],
  },
  {
    id: 35,
    category: "intellectual",
    content: "연인이 자기 전문 분야 설명해줄 때?",
    options: [
      { label: "확신 있게 말하는 자체가 멋있음", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "열정적인 눈빛에 설렘", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "쉽게 눈높이 맞춰주는 배려가 좋음", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "깊이 있는 지식 자체가 매력", scores: { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 5 } },
    ],
  },
  {
    id: 36,
    category: "intellectual",
    content: "뉴스나 이슈 얘기할 때 이런 반응이 좋아.",
    options: [
      { label: "자기 의견 당당하게 말하는 것", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "사회 문제에 공감하며 감성적 반응", scores: { leader: 0, romantic: 3, stable: 0, humorous: 0, intellectual: 2 } },
      { label: "감정 빼고 균형 잡힌 시각", scores: { leader: 0, romantic: 0, stable: 3, humorous: 0, intellectual: 2 } },
      { label: "다양한 관점으로 깊이 파고드는 분석력", scores: { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 5 } },
    ],
  },
  {
    id: 37,
    category: "intellectual",
    content: "연인과 미래 얘기를 한다면?",
    options: [
      { label: "구체적 목표 + 실행 타임라인 세우기", scores: { leader: 4, romantic: 0, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "둘만의 꿈을 로맨틱하게 그려보기", scores: { leader: 0, romantic: 4, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "현실적으로 차근차근 플랜 짜기", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "인생관, 가치관 깊게 나누기", scores: { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 5 } },
    ],
  },
  {
    id: 38,
    category: "intellectual",
    content: "데이트 중 갑자기 퀴즈를 낸다면?",
    options: [
      { label: "승부욕 폭발, 지면 안 됨", scores: { leader: 4, romantic: 0, stable: 0, humorous: 1, intellectual: 0 } },
      { label: "틀려도 귀엽게 봐주는 게 좋음", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "가볍게 맞추고 대화 이어가기", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "오 재밌다, 나도 낼게! (토론 모드)", scores: { leader: 0, romantic: 0, stable: 0, humorous: 1, intellectual: 4 } },
    ],
  },
  {
    id: 39,
    category: "intellectual",
    content: "연인이 새로운 취미를 시작했다면?",
    options: [
      { label: "같이 목표 잡고 열정적으로 도전", scores: { leader: 4, romantic: 0, stable: 0, humorous: 0, intellectual: 1 } },
      { label: "응원 + 관련 굿즈 깜짝 선물", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "관심 가져주면서 편하게 지켜봐주기", scores: { leader: 0, romantic: 0, stable: 4, humorous: 0, intellectual: 1 } },
      { label: "그 분야 같이 공부하면서 토론", scores: { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 5 } },
    ],
  },
  {
    id: 40,
    category: "intellectual",
    content: "연인한테 가장 듣고 싶은 말은?",
    options: [
      { label: "너 진짜 멋있다, 존경스러워", scores: { leader: 4, romantic: 1, stable: 0, humorous: 0, intellectual: 0 } },
      { label: "너는 내 인생에서 제일 소중한 사람이야", scores: { leader: 0, romantic: 4, stable: 1, humorous: 0, intellectual: 0 } },
      { label: "너랑 있으면 마음이 편해져", scores: { leader: 0, romantic: 1, stable: 4, humorous: 0, intellectual: 0 } },
      { label: "너랑 대화하면 항상 배우는 게 있어", scores: { leader: 0, romantic: 0, stable: 0, humorous: 0, intellectual: 5 } },
    ],
  },
];
