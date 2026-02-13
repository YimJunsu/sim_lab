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

## 1️⃣ Menu Recommendation Based on Today’s Mood

### 📌 Service Description
Users select their “today’s mood,” and a random menu matching that emotion is recommended.

### 📌 Flow
1. Mood selection (button-style UI)
    - Depressed
    - Energetic
    - Tired
    - Excited
    - Stressed
2. Click “Get Recommendation”
3. Display random menu + one-line comment

### 📌 Example Results
- Depressed → Sweet chocolate cake 🍫
- Energetic → Spicy stir-fried pork 🔥
- Tired → Warm gukbap 🍲

### 📌 Expansion Points
- Provide average nutritional information
- Include disclaimer: “Nutritional information may differ from actual values.”
- Generate SNS shareable image
- Use GeoLocation + Kakao Map API
    - Search nearby restaurants based on current location (sorted by distance)
    - Location is not stored and is only used during API calls
    - Must include this notice

### 📌 Page Structure
- Mood input page
- Result page

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

## 6️⃣ Additional Pages

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
