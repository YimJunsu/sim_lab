# API 설정 가이드

사주/미니 운세 기능은 OpenAI API를 사용합니다. 아래 단계를 따라 설정하세요.

---

## 1. OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com/)에 접속합니다.
2. 로그인 후 **API Keys** 메뉴로 이동합니다.
3. **Create new secret key** 버튼을 클릭합니다.
4. 생성된 키(`sk-...`)를 복사합니다.

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 열고, `OPENAI_API_KEY` 값을 입력합니다.

```
OPENAI_API_KEY=sk-여기에-복사한-키를-붙여넣기
```

## 3. 모델 선택 (선택사항)

기본 모델은 `gpt-4o-mini`입니다. 변경하고 싶다면:

```
OPENAI_MODEL=gpt-4o
```

| 모델 | 비용 | 품질 |
|------|------|------|
| `gpt-4o-mini` | 저렴 | 충분히 좋음 (기본값) |
| `gpt-4o` | 보통 | 더 세밀한 해석 |

## 4. 실행

```bash
npm run dev
```

`http://localhost:3000/fortune/input` 에서 사주/운세 기능을 확인할 수 있습니다.

---

## Vercel 배포 시

Vercel 대시보드에서 **Settings > Environment Variables**에 아래 값을 추가합니다:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-...` (발급받은 키) |
| `OPENAI_MODEL` | `gpt-4o-mini` (선택) |

---

## 비용 참고

- `gpt-4o-mini`: 요청당 약 $0.001~$0.003
- 하루 1,000회 사용 시 약 $1~$3
- OpenAI에서 사용량 제한(Usage Limits)을 설정하는 것을 권장합니다.