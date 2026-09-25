# 콘텐츠 작성법

## 강의노트

`content/weeks`에 각 주차의 첫 강의는 `week-00.md`, 추가 강의는 `week-00-02.md`, `week-00-03.md` 형식으로 추가합니다. 강의 제목은 같은 폴더의 `titles.json`에서 파일명과 같은 키로 관리합니다.

```json
{
  "week-00": "Hello World, 자료형, 연산자",
  "week-00-02": "조건문 기초",
  "week-01": "표현식과 흐름 제어"
}
```

Markdown 본문은 첫 줄부터 일반 제목과 문단으로 작성합니다. 모든 `#`, `##`, `###` 제목은 본문에 표시되며 목차에도 반영됩니다.

```md
# 컴파일러란 무엇인가요?

컴파일 과정에 대한 설명입니다.

## 빌드 과정

세부 내용을 작성합니다.
```

## 실습

`content/practice`에 같은 주차 이름의 `.md` 파일을 추가합니다. 파일 상단에는 다음 frontmatter가 필요합니다.

```md
---
title: 실습 제목
description: 실습 설명
week: 3
order: 1
published: true
---

## Q1. 문제 제목

문제 내용을 작성합니다.
```

정답 코드는 `<Answer>` 안에 넣으면 접힌 상태로 표시됩니다.

````md
<Answer label="예시 코드 보기">

```cpp
#include <iostream>
using namespace std;

int main() {
  cout << "Hello" << endl;
  return 0;
}
```

</Answer>
````

## 공통 규칙

- 첫 강의 파일명은 `week-주차.md`, 추가 강의는 `week-주차-강의번호.md` 형식으로 작성합니다.
- 같은 주차·강의 번호를 두 개 만들지 않습니다. `week-4.md`는 4주차 1번 강의이므로 `week-04-01.md`와 동시에 사용할 수 없습니다.
- C++ 코드는 언어 이름이 `cpp`인 코드 블록으로 작성하면 문법 강조와 복사 버튼이 붙습니다.
- 이미지는 `public/images`에 넣고 `![설명](/images/example.png)`처럼 연결합니다.
- 공개하지 않을 초안은 콘텐츠 폴더 밖에 보관합니다.
- 배포 사이트에는 GitHub push와 Vercel 재배포가 끝난 뒤 반영됩니다.

로컬에서는 `npm run dev` 실행 중 저장한 변경을 자동으로 감지합니다. 관리자 모드를 이용한 파일 직접 수정 기능도 로컬 개발 환경에서만 동작합니다.
