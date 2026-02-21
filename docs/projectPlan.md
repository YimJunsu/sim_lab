# 📌 Project Planning Document

---

# 1. Project Overview

## 🔹 Project Name
- **SimLab**

## 🔹 Purpose
- Provide light, participatory content
- Increase user session duration
- Encourage repeat visits
- Activate sharing and word-of-mouth referrals
- **Generate Google AdSense revenue (core objective)**

## 🔹 Target Audience
- Late teens to early 30s
- Users who enjoy light content such as psychological tests, menu recommendations, fortune readings, etc.
- Mobile-first users

## 🔹 Core Strategy
- Click-inducing content structure
- Strong SNS sharing functionality
- Random elements + light psychological stimulation
- Short and repeatable content format

---

# 2. Service Structure / Page Structure

---

# 1🍽 Mood-Based Menu Recommendation Service

## 1. Service Overview
A web service that recommends food based on:
- User’s current mood/condition
- Or direct cuisine selection

Each result includes:
- Recommended menu item
- Nutritional information
- Top 3 nearby restaurants (sorted by distance)

---

## 2. User Flow

### Step 1: Input Section
Simple introduction + two options:

**A. Recommend by Current Mood**
Examples:
- Feeling great
- Angry
- Depressed
- Hungover
- Rainy day
- Craving soju
- Need comfort food
- (Humorous options allowed)

**B. Direct Menu Recommendation**
Cuisine categories:
- Korean
- Western
- Chinese
- Japanese
- Dessert
- Fully Random (All)

---

### Step 2: Result Section

1. A menu item is selected.
2. Nutritional information is displayed.
3. The selected food name is searched automatically via Kakao Map API.
4. Using Geolocation, restaurants are sorted by distance.
5. The nearest 3 restaurants are rendered.

Example:
If result = Kimchi Jjigae → Search “김치찌개” → Show 3 closest restaurants + nutrition info.

---

## 3. Data & APIs
- Nutritional Data: Public Data Portal
- Map Search: Kakao Map API
- Location: Browser Geolocation API

---

## 4. Sharing Method
Share via URL parameters including:
- Selected menu
- 3 restaurant results
- Location-based rendering reference

Example:
?menu=kimchi-jjigae

---

## 5. Legal Notice (Required Display)
- Nutritional data is provided by the Public Data Portal and may not be fully accurate.
- Distance and restaurant location data may not be fully accurate.
- User location is collected via Geolocation and is not stored on the server.
- Location-based searches are conducted using Kakao Map API.

---

## 2️⃣ What Is My Mood Today?

### 📌 Service Description
A simple multiple-choice survey calculates and visualizes today’s emotional state.

### 📌 Structure
- 10 randomly selected questions out of 30 total
- Multiple-choice answers
- Emotion score calculation logic

### 📌 Example Result
- Joy 65%
- Fatigue 20%
- Stress 15%

→ Visualized as a donut chart or bar graph

### 📌 Expansion Points
- Connect results to related content
    - High joy → Activity recommendations
    - High fatigue → Healing/relaxation content
- Avoid fixed results (randomness required)
- Save to localStorage
    - “Compare with yesterday?” feature

### 📌 Page Structure
- Mood input page
- Result page

---

## 3️⃣ What Type of Person Am I Attracted To? Test

### 📌 Service Description
20-question test (randomly selected from 40 total questions)

### 📌 Flow
- Scenario-based questions
- Score calculation based on selected answers

### 📌 Example Results
- Prefers active and leadership-oriented people
- Prefers quiet but considerate people

### 📌 Monetization Points
- Generate shareable result image
- Link to “Ideal Type Compatibility Test”
- Encourage longer session duration

### 📌 Page Structure
- Test page
- Result page

---

## 4️⃣ Four Pillars / Today’s Mini Fortune

### 📌 Service Description
Input name + birthdate → Generate random-based daily fortune

### 📌 Components
- Overall luck
- Love luck
- Financial luck
- One sentence advice of the day
- “Today’s Mini Experiment” link button

### 📌 Example Output
> Today is a good day to try something new.  
> Even small choices can create big changes.

### 📌 Considerations
- Four Pillars calculation formula is prepared
- Interpretation logic needs to be designed
- Free AI token usage may be applied if available
- Avoid fixed results (to maintain credibility)

### 📌 Notes
- Clearly state that personal data is not stored
- Specify that this is for entertainment purposes only
- Random logic-based generation

### 📌 Page Structure
- Input page (name, gender, date of birth, birth time)
- Result page

---

## 5️⃣ What Animal Is That Person? Test

### 📌 Service Description
An interactive test where users think about someone they like while answering questions.

### 📌 Flow
1. Enter name / gender
2. 4–6 questions
3. Score calculation
4. Animal emoji + description displayed

### 📌 Example Results
- Fox type 🦊 → Quick-witted and charming
- Dog type 🐶 → Warm and affectionate
- Cat type 🐱 → Chic but deeply caring

### 📌 Key Points
- Result-focused image-centered layout
- Avoid direct use of animal images due to copyright issues
- Clearly state that personal data is not stored
- Encourage sharing
- Allow repeat participation

### 📌 Page Structure
- Name/Gender input page
- Question page
- Result page

---

## 6️⃣ 마법의 책

### 📌 Service Description
"스폰지밥의 마법의 소라고동"에서 영감을 받은 단일 페이지 오라클 서비스.
사용자가 속으로 질문을 생각한 뒤 책에 물으면, 마법의 책이 O / X / Fortune 중 하나의 답을 내어준다.

### 📌 결과 확률
- O (긍정) : 30%
- X (부정) : 60%
- Fortune (행운) : 10%

### 📌 시간 기반 시드 방식 (localStorage 미사용)
- `Math.floor(Date.now() / 180_000)` 을 시드로 Mulberry32 PRNG 사용
- 3분 단위로 시드가 바뀌므로, 동일 시간대 내 항상 같은 결과 반환
- 데이터가 쌓이지 않으며, 서버 요청도 불필요

### 📌 Flow
1. **스플래시/스토리 인트로** — 유적지에서 발견된 마법의 책 컨셉으로 스토리 연출
2. **가이드 안내** — "속마음으로 질문을 생각하세요. (소리 내시면 더 잘 나와요! 제 경험입니다. 😉)"
3. **"책에 묻기" 버튼** 클릭 → "마법의 책님께서 확인중입니다..." 로딩 (5초)
4. **결과 공개** — 답변 유형에 맞는 이미지와 메시지 표시

### 📌 이미지 리소스
- `public/magic-book/magic-book-cover.png` — 인트로/로딩 표지
- `public/magic-book/magic-book-yes.png` — O(긍정) 결과
- `public/magic-book/magic-book-no.png` — X(부정) 결과
- `public/magic-book/magic-book-lucky.png` — Fortune(행운) 결과

### 📌 Design Concept
- **완전 독립된 이벤트형 디자인** — 나머지 콘텐츠와 전혀 다른 분위기
- 고대 유물·고대 마법서 감성: 깊은 보라-블랙 배경, 골드 타이포, 먼지 파티클
- 모바일 우선 단일 페이지 구성
- 스크린샷·공유 기능 없음

### 📌 Page Structure
- 단일 페이지 `/magic-book` (스테이지: intro → loading → result)

---

## 7️⃣ Additional Pages

- Main page
- Privacy Policy
- Terms page

---

# 3. Design / Development Rules

---

## 🎨 Design Rules

1. Mobile-first (responsive required)
2. Consistent header/footer across all pages
3. Unified design for additional pages
4. Individual concept for each content type
5. Clean and modern design (avoid excessive styling)
6. Maintain user-centered UX
7. Use Tailwind CSS

---

## 💻 Development Guide

1. Use readable file names / function names / variable names
2. Add comments to all functionality except rendering HTML
3. Immediate production deployment → security considerations required
4. SEO setup for each content page
5. Open Graph (OG) settings required

---

## ⚙️ Language / Environment

- Deployment: Vercel
- Domain: simlab.kr
- Framework: Next.js
- Survey/Menu data: Hardcoded

---

# 4. Development Order

1. Build main page + common layout (header/footer)
2. Build Privacy Policy / Terms pages
3. Develop Content #1
4. After completing Content #2, apply SEO settings
5. After SEO setup, proceed with Content #3
6. After completing Contents #1–5, review and improve overall features  
