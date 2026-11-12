# 표현식과 흐름 제어

같은 입력·계산·출력도 조건에 따라 다른 일을 하거나 여러 번 반복할 수 있습니다. 이번에는 점수를 보고 합격 여부를 고른 뒤, 여러 점수에서 합격한 사람 수를 세어 봅니다.

## 수업 목표와 진행 순서

**먼저 알아둘 것:** [0주차](/lectures/week-00)의 변수, `cin`·`cout`, 비교식과 `bool`입니다. `score >= 60`이 참·거짓을 만든다는 점을 복습하고 시작하세요.

- `if / else`로 실행 경로를 고릅니다.
- `while`과 `for`의 조건·본문·갱신 순서를 추적합니다.
- 반복 중 합계나 개수처럼 기억할 값을 정합니다.

**권장 60분:** 선택 15분 → 반복과 실행 추적 20분 → 자료형 변환 5분 → 함께 풀기 15분 → 확인 5분. `switch`, `do while`, 범위 기반 `for`는 보충에서 비교합니다.

> [!EXAMPLE]
> **발표 시작 질문:** 점수가 59일 때와 60일 때 같은 문장을 출력하면 될까요? 먼저 기준을 말로 정한 다음 `if`로 옮깁니다. 짧은 실행문은 `main` 안에, `#include`는 파일 맨 위에 둡니다. 전체 프로그램들은 각각 따로 실행합니다.

## 선택과 반복의 큰 그림

```text
조건식의 true / false
    ↓
if로 선택
    ↓
갱신·누적과 while·for 반복
    ↓
break·continue로 반복 제어
    ↓
필요한 자료형으로 변환해 결과 계산
```

| 구분 | 문법 | 역할 |
|---|---|---|
| 선택 | `if`, `if else`, `switch` | 조건에 따라 실행할 코드 선택 |
| 반복 | `while`, `do while`, `for` | 조건을 만족하는 동안 코드 반복 |

---

## `if`

`if`는 조건이 참일 때만 Block을 실행합니다.

```cpp
if (condition) {
    // condition이 true일 때 실행
}
```

예:

```cpp
int grade = 95;

if (grade >= 90) {
    cout << "A" << endl;
}
```

실행 흐름:

```text
grade >= 90 계산
        ↓
true인가?
 ├─ Yes → Block 실행
 └─ No  → Block 건너뛰기
```

### `=`와 `==` 구분

```cpp
if (grade = 100)   // 대입: 잘못된 의도
if (grade == 100)  // 비교: 올바른 코드
```

`grade = 100`은 `grade`에 100을 저장합니다. 대입식의 결과 `100`은 0이 아니므로 조건이 참으로 평가됩니다.

> [!DEFINITION]
> **핵심:** `=`는 대입이고 `==`는 같은지 비교하는 연산자입니다.

---

## `if else`와 `else if`

`if else`는 조건에 따라 두 경로 중 하나를 실행합니다.

```cpp
if (score >= 60) {
    cout << "Pass" << endl;
} else {
    cout << "Fail" << endl;
}
```

여러 조건을 순서대로 검사할 때는 `else if`를 사용합니다.

```cpp
char letterGrade;
int grade = 85;

if (grade >= 90) {
    letterGrade = 'A';
} else if (grade >= 80) {
    letterGrade = 'B';
} else if (grade >= 70) {
    letterGrade = 'C';
} else {
    letterGrade = 'F';
}
```

위에서부터 검사하여 **처음 참이 된 분기 하나만 실행**합니다. 따라서 더 높은 점수 조건을 먼저 작성해야 합니다.

`85`라면 `>= 90`은 거짓, `>= 80`은 참이므로 B를 고르고 나머지는 검사하지 않습니다. `if`를 각각 따로 쓰면 조건마다 독립적으로 검사하므로 85가 80 이상이면서 70 이상이라는 이유로 여러 블록을 실행할 수 있습니다.

> [!QUIZ]
> 첫 조건을 `grade >= 70`으로 바꾸면 점수 95는 어떤 등급이 되나요?

> [!ANSWER]
> 첫 분기에서 C가 됩니다. `else if`는 가장 좋은 등급을 알아서 고르지 않고 처음 참인 분기에서 멈춥니다. 90, 80, 70 순으로 검사해야 합니다.

```text
grade >= 90 ?
 ├─ true  → A
 └─ false → grade >= 80 ?
              ├─ true  → B
              └─ false → 다음 조건
```

---

## 논리 연산자

| 연산자 | 의미 | 결과가 `true`인 경우 |
|---|---|---|
| `A && B` | AND | A와 B가 모두 참 |
| `A \|\| B` | OR | A와 B 중 하나 이상이 참 |
| `!A` | NOT | A가 거짓 |

```cpp
int x = 5;
int y = !x;
```

C++에서 `0`은 거짓, `0`이 아닌 값은 참으로 평가됩니다.

```text
x = 5
5는 0이 아니므로 true
!true는 false
false를 int로 변환하면 0

최종 y = 0
```

`!5`는 `false`입니다. 5가 참으로 바뀐 다음 반전되기 때문입니다. 정수로 출력하면 0으로 보입니다. `!`는 부호를 바꾸는 `-`와 다릅니다.

---

## 증감 연산자

```cpp
x++;  // x를 1 증가
x--;  // x를 1 감소
```

단독 문장으로 사용하면 다음 코드와 같은 효과입니다.

```cpp
x = x + 1;
x = x - 1;
```

### 전위와 후위

| 형식 | 표현식에서의 동작 |
|---|---|
| `x++` | 현재 값을 먼저 사용한 후 증가 |
| `++x` | 먼저 증가한 후 증가한 값 사용 |
| `x--` | 현재 값을 먼저 사용한 후 감소 |
| `--x` | 먼저 감소한 후 감소한 값 사용 |

```cpp
#include <iostream>

using namespace std;

int main() {
    int x = 5;

    cout << x++ << ' ';  // 5 출력 후 x는 6
    cout << ++x << endl; // x를 7로 만든 후 7 출력

    return 0;
}
```

실행 결과:

```text
5 7
```

### 피해야 할 코드

> [!CAUTION]
> 한 표현식 안에서 같은 변수를 여러 번 증감하지 않습니다.

```cpp
int result = x++ + ++x;  // 피해야 함
```

증감은 별도 문장으로 분리하는 것이 안전하고 읽기 쉽습니다.

---

## 복합 대입 연산자

| 복합 대입 | 같은 의미 |
|---|---|
| `x += 3` | `x = x + 3` |
| `x -= 3` | `x = x - 3` |
| `x *= 3` | `x = x * 3` |
| `x /= 3` | `x = x / 3` |
| `x %= 3` | `x = x % 3` |

```cpp
int score = 80;
score += 10;
```

최종 결과:

```text
score = 90
```

---

## `while`

`while`은 조건을 먼저 확인하고, 참인 동안 Block을 반복합니다.

```cpp
while (condition) {
    statements;
}
```

예:

```cpp
#include <iostream>

using namespace std;

int main() {
    int i = 1;

    while (i <= 3) {
        cout << i << ' ';
        i++;
    }

    return 0;
}
```

실행 결과:

```text
1 2 3
```

실행 추적:

| 단계 | 조건 | 출력 | 실행 후 `i` |
|---|---|---|---:|
| 시작 | `1 <= 3` → true | `1` | 2 |
| 2회 | `2 <= 3` → true | `2` | 3 |
| 3회 | `3 <= 3` → true | `3` | 4 |
| 종료 | `4 <= 3` → false | 없음 | 4 |

### 무한 반복 주의

```cpp
int i = 1;

while (i <= 3) {
    cout << i;
    // i++가 없으므로 조건이 계속 true
}
```

> [!DEFINITION]
> **핵심:** 반복문에는 조건을 언젠가 거짓으로 만드는 변화가 필요합니다.

---

## `for`

`for`는 반복 횟수를 제어할 때 주로 사용합니다.

```cpp
for (initialization; condition; update) {
    statements;
}
```

실행 순서:

```text
initialization — 처음 한 번
        ↓
condition
   ├─ false → 반복 종료
   └─ true
        ↓
       body
        ↓
      update
        └────→ condition으로 이동
```

예:

```cpp
#include <iostream>

using namespace std;

int main() {
    for (int i = 1; i < 10; i++) {
        cout << i << ' ';
    }

    return 0;
}
```

실행 결과:

```text
1 2 3 4 5 6 7 8 9
```

본문은 `i`가 1부터 9일 때 실행되므로 총 9회 실행됩니다.

### 합계를 기억하는 변수는 반복문 밖에 둡니다

```cpp
int sum = 0;
for (int i = 1; i <= 3; i++) {
    sum += i;
}
cout << sum << '\n';
```

| 회차 | 본문 실행 전 `i` | 실행 전 `sum` | `sum += i` 후 | 갱신 후 `i` |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 1 | 2 |
| 2 | 2 | 1 | 3 | 3 |
| 3 | 3 | 3 | 6 | 4 |

다음 조건 `4 <= 3`이 거짓이어서 6을 출력합니다. `sum = 0`을 반복문 안에 두면 매번 이전 합을 지우므로 누적되지 않습니다. ‘반복 전 준비 → 한 번 처리 → 다음 상태’ 순서로 읽으세요.

### 감소 반복

```cpp
for (int i = 10; i >= 0; i--) {
    cout << i << ' ';
}
```

### 홀수와 짝수 판별

```cpp
for (int i = 1; i < 10; i++) {
    if (i % 2 == 1) {
        cout << i << " is odd" << endl;
    } else {
        cout << i << " is even" << endl;
    }
}
```

```text
i % 2 == 0 → 짝수
i % 2 == 1 → 양의 홀수
```

### 무한 반복

`for`의 조건을 생략하면 항상 참으로 처리됩니다.

```cpp
for (;;) {
    // 무한 반복
}
```

종료 조건과 `break`가 없다면 프로그램이 계속 반복됩니다.

---

## `break`와 `continue`

| Keyword | 반복문에서의 역할 |
|---|---|
| `break` | 현재 반복문을 즉시 종료 |
| `continue` | 현재 회차의 남은 코드를 건너뛰고 다음 반복 진행 |

```cpp
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }

    if (i == 5) {
        break;
    }

    cout << i << ' ';
}
```

실행 결과:

```text
1 2 4
```

실행 과정:

```text
i = 1 → 출력
i = 2 → 출력
i = 3 → continue → 출력 생략
i = 4 → 출력
i = 5 → break → 반복 종료
```

> [!CAUTION]
> **주의:** `while`에서 `continue`를 사용하면 반복 변수의 갱신 코드가 건너뛰어지지 않는지 확인합니다.

---

## 자료형 변환

서로 다른 자료형을 함께 계산하면 C++가 계산에 사용할 공통 자료형을 결정합니다.

```cpp
int a = 5;
double b = 2.5;
double c = a + b;
```

위 계산에서는 `a`가 `double`로 변환됩니다.

```text
int 5 + double 2.5
        ↓
double 5.0 + double 2.5
        ↓
double 7.5
```

| 표현식 | 처리 | 결과 |
|---|---|---|
| `3 + 4.5` | `3`을 `double`로 변환 | `double 7.5` |
| `7 / 2` | 두 값 모두 `int` | `int 3` |
| `7 / 2.0` | `7`을 `double`로 변환 | `double 3.5` |
| `static_cast<double>(7) / 2` | `7`을 명시적으로 변환 | `double 3.5` |

### 정수 승격

`bool`, `char`, `short`처럼 작은 정수형은 산술 계산에서 일반적으로 `int`로 승격됩니다.

```text
bool / char / short
        ↓
       int
```

### 축소 변환

> [!CAUTION]
> 더 넓은 자료형의 값을 더 좁은 자료형으로 바꾸면 데이터가 손실될 수 있습니다.

```cpp
double pi = 3.14;
int number = pi;
```

```text
3.14
 ↓ 소수 부분 손실
3
```

```cpp
uint16_t x = 10000;
uint8_t y = x;  // uint8_t 범위를 벗어나 데이터 손실 가능
```

중괄호 초기화는 일부 축소 변환을 Compile 단계에서 막아줍니다.

```cpp
int number{3.14};  // Compile Error
```

> [!DEFINITION]
> **핵심:** 혼합 자료형을 계산할 때는 각 피연산자와 최종 결과의 자료형을 확인합니다.

---

## 자주 하는 실수

### 대입과 비교 혼동

```cpp
if (grade = 100)   // 대입
if (grade == 100)  // 비교
```

### 정수 나눗셈 착각

```cpp
7 / 2    // 3
7 / 2.0  // 3.5
```

### 반복 변수 갱신 누락

```cpp
int i = 0;

while (i < 10) {
    cout << i;
    // i++ 누락 → 무한 반복
}
```

### `switch`에서 `break` 누락

```cpp
switch (menu) {
    case 1:
        cout << "One";
        // break가 없으면 다음 case로 진행 가능
    case 2:
        cout << "Two";
}
```

### `do while` 마지막 세미콜론 누락

```cpp
do {
    // 반복할 코드
} while (condition); // 세미콜론 필요
```

### 같은 표현식에서 여러 번 증감

```cpp
int result = i++ + ++i; // 피해야 함
```

각 증감 연산을 별도 문장으로 분리합니다.

---

## 함께 풀기: 세 명 중 합격한 사람 세기

60점 이상을 합격으로 정하고 점수 세 개를 입력받으세요. 점수는 0~100의 정수입니다. 배열 없이 한 점수씩 읽어 처리할 수 있습니다.

1. 반복 전에 `passedCount = 0`으로 준비합니다.
2. 세 번 반복하며 점수 하나를 읽습니다.
3. 60 이상일 때만 개수를 1 늘립니다.
4. 반복이 끝난 뒤 개수를 한 번 출력합니다.

먼저 직접 작성한 뒤 다음 전체 코드와 비교하세요.

```cpp
#include <iostream>
using namespace std;

int main() {
    int passedCount = 0;
    for (int i = 0; i < 3; i++) {
        int score = 0;
        if (!(cin >> score) || score < 0 || score > 100) {
            cout << "Invalid score\n";
            return 1;
        }
        if (score >= 60) {
            passedCount++;
        }
    }
    cout << passedCount << '\n';
    return 0;
}
```

입력 `59 60 90`에서 `passedCount`는 `0 → 0 → 1 → 2`가 되고 출력은 2입니다. `0 0 0`이면 0, `100 100 100`이면 3입니다. 입력 실패 또는 범위 밖 점수에서는 계산을 중단합니다. 입력 성공 여부도 조건식으로 검사할 수 있다는 점을 확인하세요.

## 수업을 마치기 전 확인

> [!QUIZ]
> 위 코드의 조건을 `i <= 3`으로 바꾸면 점수를 몇 개 읽나요? `passedCount`를 반복문 안에서 0으로 만들면 어떻게 되나요?

> [!ANSWER]
> i가 0, 1, 2, 3일 때 네 개를 읽습니다. 개수를 반복문 안에서 초기화하면 이전 합격자 수를 잊어버립니다. 반복 횟수와 누적값의 초기화 위치를 따로 확인해야 합니다.

> [!QUIZ]
> `for` 본문에서 `continue`를 만나면 갱신식 `i++`도 건너뛰나요? `break`라면요?

> [!ANSWER]
> `continue`는 남은 본문을 건너뛴 뒤 갱신식으로 이동합니다. `break`는 반복문을 끝내므로 갱신식도 실행하지 않습니다. 둘 다 가장 가까운 해당 반복문에 적용됩니다.

**발표자 마무리:** 참가자가 반복 전·중·후의 변수 값을 설명하면 [Exercise 03](/lectures/week-00-03)에서 반복문을 연습한 뒤 [2주차 함수](/lectures/week-02)로 갑니다.

# 최종 핵심

1. 혼합 자료형 계산에서는 자동 변환이 발생합니다.
2. 축소 변환은 값이나 정밀도를 잃을 수 있습니다.
3. 부동소수점은 근삿값이므로 작은 오차가 생길 수 있습니다.
4. `&&`, `||`, `!`는 조건을 결합하거나 반전합니다.
5. `x++`는 값을 사용한 후 증가하고 `++x`는 증가한 후 값을 사용합니다.
6. `if`는 조건, `switch`는 여러 값 중 하나를 선택할 때 사용합니다.
7. `while`은 조건을 먼저 검사하고 `do while`은 본문을 먼저 실행합니다.
8. `for`의 순서는 초기화 → 조건 → 본문 → 갱신입니다.
9. `break`는 반복을 종료하고 `continue`는 현재 회차를 건너뜁니다.
10. 범위 기반 `for`는 Container의 모든 요소를 순회할 때 사용합니다.

---

## 보충: 다른 문법과 숫자 표현

여기부터는 본 수업 뒤에 비교하거나 복습할 내용입니다. 범위 기반 `for`의 배열·`vector`와 참조 문법은 3주차에서 자세히 다룹니다.

## `switch`

`switch`는 하나의 값을 여러 `case`와 비교합니다.

```cpp
switch (expression) {
    case value1:
        statements;
        break;

    case value2:
        statements;
        break;

    default:
        statements;
}
```

예:

```cpp
#include <iostream>

using namespace std;

int main() {
    int menu = 2;

    switch (menu) {
        case 1:
            cout << "Start" << endl;
            break;
        case 2:
            cout << "Settings" << endl;
            break;
        default:
            cout << "Invalid menu" << endl;
    }

    return 0;
}
```

실행 결과:

```text
Settings
```

### `break`의 역할

`break`가 없으면 일치한 `case` 아래의 다음 `case`까지 계속 실행될 수 있습니다.

### `if`와 `switch`

| `if` | `switch` |
|---|---|
| 범위와 복합 조건에 적합 | 하나의 값과 여러 상수를 비교할 때 적합 |
| `score >= 90` | `menu == 1`, `menu == 2` |
| 자유로운 조건식 사용 | `case`에는 상수값 사용 |

---

## `do while`

`do while`은 본문을 먼저 실행하고 조건을 검사합니다. 따라서 본문이 최소 한 번 실행됩니다.

```cpp
do {
    statements;
} while (condition);
```

예:

```cpp
int i = 1;

do {
    cout << i << ' ';
    i++;
} while (i <= 3);
```

실행 결과:

```text
1 2 3
```

### `while`과 `do while`

| `while` | `do while` |
|---|---|
| 조건을 먼저 검사 | 본문을 먼저 실행 |
| 0회 실행 가능 | 최소 1회 실행 |
| 선조건 반복 | 후조건 반복 |

> [!CAUTION]
> **주의:** `do while`의 마지막에는 세미콜론이 필요합니다.

```cpp
} while (condition);
```

---

## 부동소수점 오차

> [!CAUTION]
> `float`와 `double`은 모든 십진 소수를 정확하게 저장하지 못합니다. 많은 값을 이진수로 표현한 근삿값으로 저장합니다.

```cpp
#include <iostream>

using namespace std;

int main() {
    float sum = 0.0f;

    for (int i = 0; i < 1000; i++) {
        sum += 0.1f;
    }

    cout << sum << endl;
    return 0;
}
```

```text
0.1을 근삿값으로 저장
        ↓
1000번 반복해서 덧셈
        ↓
작은 오차가 누적될 수 있음
```

부동소수점 값은 상황에 따라 아주 작은 허용 오차를 두고 비교합니다.

```cpp
#include <cmath>

double a = 0.1 + 0.2;
double b = 0.3;

bool same = abs(a - b) < 0.000001;
```

> [!DEFINITION]
> **핵심:** 부동소수점은 근삿값이므로 계산과 비교에서 오차를 고려해야 합니다.

---

## 주요 연산자 우선순위

```text
1. ( )
2. ++  --
3. *  /  %
4. +  -
5. <  <=  >  >=
6. ==  !=
7. &&
8. ||
9. =
```

복잡한 표현식은 우선순위에만 의존하지 말고 괄호를 사용합니다.

```cpp
bool canEnter = (age >= 18) && hasTicket;
```

---

## 보충: 범위 기반 `for`

범위 기반 `for`는 Array나 Container의 각 요소를 순서대로 방문합니다.

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4};

    for (int number : numbers) {
        cout << number << ' ';
    }

    return 0;
}
```

실행 결과:

```text
1 2 3 4
```

| 일반 `for` | 범위 기반 `for` |
|---|---|
| 초기화·조건·갱신을 직접 작성 | 각 요소를 자동으로 순회 |
| Index 또는 횟수 제어에 적합 | 모든 요소를 읽을 때 간결 |

요소를 복사하지 않고 읽기만 할 때는 다음 형식을 사용할 수 있습니다.

```cpp
for (const int& number : numbers) {
    cout << number << ' ';
}
```

---

## 반복문 선택 기준

| 상황 | 적합한 반복문 |
|---|---|
| 반복 횟수가 명확함 | `for` |
| 조건이 참인 동안 반복 | `while` |
| 본문을 최소 한 번 실행 | `do while` |
| Container의 모든 요소 순회 | 범위 기반 `for` |

문법적으로 많은 `for`와 `while`을 서로 바꿀 수 있지만, 의도를 가장 명확하게 보여주는 반복문을 선택합니다.

---
