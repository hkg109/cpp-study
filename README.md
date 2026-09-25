# Handsome C++

주차별 Markdown 파일로 운영하는 FORIF C++ 학습 사이트입니다. 강의노트와 실습, 검색, 목차, C++ 코드 강조, 학습 진도 표시를 제공합니다.

## 실행

Node.js 22 이상이 필요합니다.

```sh
npm ci
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다. 콘텐츠 감시 방식이 바뀐 뒤에는 실행 중인 개발 서버를 종료하고 다시 시작하세요.

배포 전 검사는 다음 명령으로 실행합니다.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

## 콘텐츠 관리

```text
content/
├── weeks/
│   ├── titles.json
│   ├── week-00.md
│   ├── week-00-02.md
│   └── week-01.md
└── practice/
    ├── week-00.md
    └── week-01.md
```

- 각 주차의 첫 강의는 `content/weeks/week-00.md`, 추가 강의는 `week-00-02.md`, `week-00-03.md` 형식으로 추가합니다.
- 강의 제목은 `content/weeks/titles.json`에서 파일명과 같은 키(`week-00`, `week-00-02`)로 별도 관리합니다.
- 강의 Markdown 안의 제목은 본문과 오른쪽 목차에 그대로 표시됩니다.
- 실습 파일은 `content/practice/week-00.md` 형식이며, 제목과 설명 등의 정보는 파일 상단 frontmatter에 둡니다.
- 0주차부터 사용할 수 있고 주차와 강의 번호순으로 자동 정렬됩니다.
- 파일 추가·수정·삭제는 개발 서버에서 자동 감지됩니다.
- `lib/weeks.generated.json`은 빌드 전에 자동 생성되므로 직접 수정하지 않습니다.

자세한 작성 형식은 [콘텐츠 작성법](docs/content-guide.md)을 참고하세요.

## 로컬 관리자 모드

관리자 모드는 `npm run dev`로 실행한 로컬 사이트에서만 표시됩니다. 강의 제목·본문과 실습 제목·설명·본문을 수정하면 해당 Markdown 또는 JSON 파일에 저장됩니다. 이 기능은 계정 인증 시스템이 아니며, Vercel 운영 빌드에서는 버튼과 저장 API가 모두 비활성화됩니다.

## 배포

GitHub 업로드와 Vercel 배포는 사용자 검토 후 진행합니다. 예정 저장소는 `hkg109/cpp-study` 비공개 저장소입니다.

Vercel에 저장소를 연결한 뒤에는 콘텐츠 변경을 GitHub에 push해야 새 빌드에 반영됩니다. 로컬 PC의 파일 변경만으로 배포 사이트가 갱신되지는 않습니다. 운영 빌드는 콘텐츠를 정적 페이지로 생성하여 Vercel 캐시에서 제공합니다.

학습 완료 기록은 브라우저의 `localStorage`에 저장되며 기기 간 동기화되지 않습니다.
