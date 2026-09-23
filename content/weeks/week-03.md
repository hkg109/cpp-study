# 참조와 배열, vector

## 전체 학습 흐름

```text
참조 변수로 기존 객체에 별명 붙이기
        ↓
참조 매개변수로 함수 밖의 값 변경하기
        ↓
배열에 같은 자료형의 값 모으기
        ↓
배열을 함수에 전달하기
        ↓
다차원 배열로 표 형태의 데이터 표현하기
        ↓
vector로 크기가 변하는 배열 다루기
```

| 개념 | 핵심 역할 |
|---|---|
| 참조 변수 | 기존 변수에 새로운 이름을 붙임 |
| 참조 매개변수 | 복사 없이 원본을 함수에서 사용 |
| 배열 | 같은 자료형의 값을 연속해서 저장 |
| 다차원 배열 | 행과 열처럼 여러 차원의 데이터 저장 |
| `vector` | 실행 중에도 크기를 바꿀 수 있는 컨테이너 |

---

## 참조 변수

참조(reference)는 이미 존재하는 변수에 붙이는 **별명**입니다. 참조를 통해 값을 바꾸면 원본 변수도 함께 바뀝니다.

```cpp
#include <iostream>
using namespace std;

int main() {
    int score = 80;
    int& scoreRef = score;

    scoreRef = 95;

    cout << score << '\n';     // 95
    cout << scoreRef << '\n';  // 95
    return 0;
}
```

```text
score ──────┐
            ├── 같은 int 객체
scoreRef ───┘
```

### 참조 선언 문법

```cpp
자료형& 참조이름 = 원본변수;
```

참조는 선언할 때 반드시 원본 변수와 연결해야 합니다.

```cpp
int value = 10;
int& ref = value;  // 올바른 선언

// int& emptyRef;  // 오류: 연결할 원본이 없음
```

### 참조는 다른 변수로 다시 연결되지 않는다

```cpp
int first = 10;
int second = 20;
int& ref = first;

ref = second;
```

마지막 줄은 `ref`를 `second`에 다시 연결하는 코드가 아닙니다. `second`의 값인 `20`을 `first`에 대입합니다.

```text
실행 전: first = 10, second = 20
실행 후: first = 20, second = 20
```

### const 참조

원본을 읽기만 하고 수정하지 않을 때는 `const` 참조를 사용합니다.

```cpp
int number = 42;
const int& readOnly = number;

cout << readOnly << '\n';
// readOnly = 50;  // 오류: const 참조로 값을 변경할 수 없음
```

큰 객체를 복사하지 않고 안전하게 읽을 때 `const` 참조가 자주 사용됩니다.

---

## 참조 매개변수

일반 매개변수는 인수의 값을 복사합니다. 함수 안에서 매개변수를 바꿔도 원본은 변하지 않습니다.

```cpp
void addOne(int number) {
    number++;
}

int main() {
    int value = 5;
    addOne(value);
    cout << value << '\n';  // 5
}
```

참조 매개변수는 원본 변수에 직접 연결됩니다.

```cpp
#include <iostream>
using namespace std;

void addOne(int& number) {
    number++;
}

int main() {
    int value = 5;
    addOne(value);
    cout << value << '\n';  // 6
    return 0;
}
```

### 두 값 교환하기

```cpp
void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

```cpp
int x = 3;
int y = 7;
swapValues(x, y);

cout << x << ' ' << y << '\n';  // 7 3
```

### 출력값을 여러 개 돌려주기

함수는 `return`으로 하나의 값만 직접 반환하지만, 참조 매개변수를 사용하면 여러 결과를 전달할 수 있습니다.

```cpp
void divide(int dividend, int divisor, int& quotient, int& remainder) {
    quotient = dividend / divisor;
    remainder = dividend % divisor;
}

int main() {
    int q = 0;
    int r = 0;

    divide(17, 5, q, r);
    cout << q << ' ' << r << '\n';  // 3 2
}
```

### 값, 참조, const 참조 비교

| 선언 | 복사 여부 | 원본 수정 | 주 용도 |
|---|---:|---:|---|
| `void f(int x)` | 복사함 | 불가능 | 작은 값을 입력받음 |
| `void f(int& x)` | 복사 안 함 | 가능 | 원본을 변경함 |
| `void f(const int& x)` | 복사 안 함 | 불가능 | 복사 없이 안전하게 읽음 |

---

## 배열 선언과 초기화

배열(array)은 같은 자료형의 값을 정해진 개수만큼 연속해서 저장합니다.

```cpp
int scores[5];
```

배열의 각 칸은 **요소(element)**이며, 위치를 나타내는 숫자를 **인덱스(index)**라고 합니다. 인덱스는 `0`부터 시작합니다.

```text
인덱스:   0    1    2    3    4
scores: [ ]  [ ]  [ ]  [ ]  [ ]
```

### 배열 초기화

```cpp
int scores[5] = {90, 85, 100, 70, 95};
int numbers[] = {1, 2, 3, 4};  // 요소 개수로 크기 결정
int zeros[5] = {};              // 모든 요소를 0으로 초기화
```

일부 값만 적으면 나머지 요소는 `0`으로 초기화됩니다.

```cpp
int values[5] = {10, 20};  // {10, 20, 0, 0, 0}
```

### 배열 요소 사용하기

```cpp
int scores[3] = {80, 90, 100};

cout << scores[0] << '\n';
scores[1] = 95;
cout << scores[1] << '\n';
```

배열의 범위를 벗어난 인덱스를 사용하면 정의되지 않은 동작이 발생합니다.

```cpp
int numbers[3] = {1, 2, 3};
// cout << numbers[3];  // 잘못된 접근: 마지막 인덱스는 2
```

---

## 배열 순회

배열의 모든 요소를 차례로 처리하는 것을 순회라고 합니다.

### 인덱스를 사용하는 for문

```cpp
int scores[5] = {90, 85, 100, 70, 95};

for (int i = 0; i < 5; i++) {
    cout << i << ": " << scores[i] << '\n';
}
```

반복 조건은 `i <= 5`가 아니라 `i < 5`입니다.

### 범위 기반 for문

```cpp
for (int score : scores) {
    cout << score << '\n';
}
```

값을 변경하려면 참조 변수로 요소를 받아야 합니다.

```cpp
for (int& score : scores) {
    score += 5;
}
```

읽기만 할 때는 `const` 참조를 사용할 수 있습니다.

```cpp
for (const int& score : scores) {
    cout << score << '\n';
}
```

### 합계와 평균 구하기

```cpp
#include <iostream>
using namespace std;

int main() {
    int scores[5] = {90, 85, 100, 70, 95};
    int sum = 0;

    for (int score : scores) {
        sum += score;
    }

    double average = static_cast<double>(sum) / 5;
    cout << "합계: " << sum << '\n';
    cout << "평균: " << average << '\n';
    return 0;
}
```

---

## 배열과 함수

배열을 함수에 전달하면 배열 전체가 복사되지 않습니다. 함수는 원본 배열의 요소에 접근합니다.

```cpp
void printArray(const int values[], int size) {
    for (int i = 0; i < size; i++) {
        cout << values[i] << ' ';
    }
    cout << '\n';
}
```

배열만 전달하면 함수는 요소 개수를 자동으로 알 수 없으므로 크기도 함께 전달해야 합니다.

```cpp
int numbers[4] = {10, 20, 30, 40};
printArray(numbers, 4);
```

### 배열 요소 변경하기

```cpp
void doubleValues(int values[], int size) {
    for (int i = 0; i < size; i++) {
        values[i] *= 2;
    }
}
```

```cpp
int numbers[3] = {1, 2, 3};
doubleValues(numbers, 3);
// numbers는 {2, 4, 6}
```

원본을 변경하지 않는 함수라면 `const`를 붙이는 습관이 좋습니다.

```cpp
int findMax(const int values[], int size) {
    int maximum = values[0];

    for (int i = 1; i < size; i++) {
        if (values[i] > maximum) {
            maximum = values[i];
        }
    }

    return maximum;
}
```

### 배열 크기를 자동으로 받는 함수

배열 참조와 템플릿을 사용하면 고정 배열의 크기를 자동으로 받을 수 있습니다.

```cpp
template <size_t N>
void printArray(const int (&values)[N]) {
    for (int value : values) {
        cout << value << ' ';
    }
    cout << '\n';
}
```

이 문법은 뒤에서 템플릿을 배운 뒤 더 자세히 이해해도 됩니다. 지금은 일반적으로 배열과 크기를 함께 전달한다는 점이 중요합니다.

---

## 다차원 배열

2차원 배열은 행과 열로 이루어진 표처럼 생각할 수 있습니다.

```cpp
int board[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

```text
          열 0  열 1  열 2
행 0       1     2     3
행 1       4     5     6
```

요소에 접근할 때는 `[행][열]` 순서로 작성합니다.

```cpp
cout << board[0][1] << '\n';  // 2
board[1][2] = 10;
```

### 중첩 반복문으로 순회하기

```cpp
for (int row = 0; row < 2; row++) {
    for (int column = 0; column < 3; column++) {
        cout << board[row][column] << ' ';
    }
    cout << '\n';
}
```

### 2차원 배열을 함수에 전달하기

2차원 배열을 전달할 때는 두 번째 차원의 크기를 함수가 알아야 합니다.

```cpp
const int COLUMN_COUNT = 3;

void printBoard(const int board[][COLUMN_COUNT], int rowCount) {
    for (int row = 0; row < rowCount; row++) {
        for (int column = 0; column < COLUMN_COUNT; column++) {
            cout << board[row][column] << ' ';
        }
        cout << '\n';
    }
}
```

---

## vector

`vector`는 같은 자료형의 값을 연속해서 저장하지만, 일반 배열과 달리 실행 중에 크기를 바꿀 수 있습니다.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> scores = {90, 85, 100};

    scores.push_back(95);
    scores.push_back(80);

    for (int score : scores) {
        cout << score << ' ';
    }
    return 0;
}
```

### 자주 사용하는 기능

| 표현식 | 의미 |
|---|---|
| `values.size()` | 현재 요소 개수 |
| `values.empty()` | 비어 있는지 확인 |
| `values.push_back(x)` | 마지막에 `x` 추가 |
| `values.pop_back()` | 마지막 요소 제거 |
| `values.front()` | 첫 번째 요소 |
| `values.back()` | 마지막 요소 |
| `values.clear()` | 모든 요소 제거 |

```cpp
vector<int> values;
values.push_back(10);
values.push_back(20);

cout << values.size() << '\n';  // 2
cout << values.front() << '\n'; // 10
cout << values.back() << '\n';  // 20

values.pop_back();
```

### 인덱스 접근과 at

```cpp
vector<int> numbers = {10, 20, 30};

cout << numbers[1] << '\n';    // 20
cout << numbers.at(1) << '\n'; // 20
```

`[]`는 범위를 검사하지 않지만 `at()`은 범위를 벗어나면 예외를 발생시킵니다.

### vector를 함수에 전달하기

읽기만 하는 함수에는 `const` 참조를 사용합니다.

```cpp
double calculateAverage(const vector<int>& scores) {
    int sum = 0;

    for (int score : scores) {
        sum += score;
    }

    return static_cast<double>(sum) / scores.size();
}
```

원본을 변경하려면 일반 참조를 사용합니다.

```cpp
void addBonus(vector<int>& scores, int bonus) {
    for (int& score : scores) {
        score += bonus;
    }
}
```

### 배열과 vector 비교

| 구분 | 배열 | `vector` |
|---|---|---|
| 크기 | 선언할 때 고정 | 실행 중 변경 가능 |
| 요소 개수 | 따로 관리하는 경우가 많음 | `size()`로 확인 |
| 범위 검사 | 없음 | `at()` 사용 가능 |
| 함수 전달 | 크기를 함께 전달 | `const vector<int>&` 사용 |
| 사용 추천 | 크기가 확실히 고정됨 | 일반적인 가변 목록 |

---

## 종합 예제: 점수 관리

```cpp
#include <iostream>
#include <vector>
using namespace std;

void addBonus(vector<int>& scores, int bonus) {
    for (int& score : scores) {
        score += bonus;

        if (score > 100) {
            score = 100;
        }
    }
}

double calculateAverage(const vector<int>& scores) {
    if (scores.empty()) {
        return 0.0;
    }

    int sum = 0;
    for (int score : scores) {
        sum += score;
    }

    return static_cast<double>(sum) / scores.size();
}

int main() {
    vector<int> scores = {72, 88, 95, 100};

    addBonus(scores, 5);

    for (int score : scores) {
        cout << score << ' ';
    }
    cout << "\n평균: " << calculateAverage(scores) << '\n';
    return 0;
}
```

---

## 자주 하는 실수

### 참조를 초기화하지 않음

```cpp
// int& ref;  // 오류
```

### 배열 범위를 벗어남

```cpp
int values[3] = {1, 2, 3};
// values[3] = 10;  // 마지막 유효 인덱스는 2
```

### 함수에서 배열 크기를 자동으로 알 수 있다고 생각함

```cpp
void printArray(const int values[], int size);
```

배열과 함께 `size`를 전달해야 합니다.

### 범위 기반 for문에서 복사본을 수정함

```cpp
for (int value : values) {
    value *= 2;  // 원본 요소는 바뀌지 않음
}

for (int& value : values) {
    value *= 2;  // 원본 요소가 바뀜
}
```

---

## 핵심 정리

- 참조 변수는 기존 변수의 별명이다.
- 참조 매개변수를 사용하면 함수가 원본 값을 변경할 수 있다.
- 원본을 읽기만 할 때는 `const` 참조를 우선 고려한다.
- 배열의 인덱스는 `0`부터 시작하며 크기를 벗어나면 안 된다.
- 배열을 함수에 전달할 때는 일반적으로 요소 개수도 함께 전달한다.
- 2차원 배열은 중첩 반복문으로 순회한다.
- `vector`는 크기가 변하는 값 목록을 다룰 때 편리하다.
- `vector`를 함수에 전달할 때는 목적에 따라 참조 또는 `const` 참조를 사용한다.

