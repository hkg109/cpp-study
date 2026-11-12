# 포인터와 동적 메모리

참조가 원본의 별명이었다면, 포인터는 원본이 있는 위치인 주소를 값으로 저장합니다. 주소와 그 주소에 있는 값을 구분한 뒤, 메모리를 직접 확보하고 정리하는 과정을 살펴봅니다.

## 수업 목표와 진행 순서

**먼저 알아둘 것:** [3주차](/lectures/week-03)의 참조, 배열의 인덱스, `vector`입니다. `int& ref = number;`가 복사가 아니라 별명이라는 점부터 확인하세요.

- `pointer`, `&number`, `*pointer`가 각각 무엇인지 설명합니다.
- 포인터를 다른 대상으로 옮기는 것과 대상의 값을 바꾸는 것을 구분합니다.
- `new`와 `delete`의 짝과, 자동 관리하는 `vector`의 장점을 설명합니다.

**권장 60분:** 주소·역참조 20분 → 함수·배열과 연결 10분 → 동적 메모리와 수명 15분 → 함께 풀기·확인 15분. 복잡한 `const` 선언, 포인터 연산, C 문자열은 보충에서 봅니다.

> [!EXAMPLE]
> **발표 시작:** 종이에 ‘상자 number: 42’를 그리고 상자를 가리키는 화살표를 pointer라고 적으세요. 주소는 위치이고 42는 그 위치에 든 값입니다. 실제 주소 숫자를 외우게 하지 말고 화살표의 대상과 값만 추적합니다. 전체 프로그램과 코드 조각을 구분해서 실행하세요.

## 이번에 연결할 개념

```text
변수의 메모리 주소 확인
        ↓
포인터에 주소 저장
        ↓
역참조로 원본 값 읽고 변경
        ↓
포인터를 함수와 배열에 활용
        ↓
new와 delete로 동적 메모리 관리
        ↓
vector·스마트 포인터의 자동 정리와 비교
```

| 개념 | 핵심 역할 |
|---|---|
| 주소 | 메모리에서 값이 저장된 위치 |
| 포인터 | 주소를 저장하는 변수 |
| 역참조 | 포인터가 가리키는 원본 값에 접근 |
| 포인터 연산 | 연속된 배열 요소 사이를 이동 |
| C 문자열 | 널 문자로 끝나는 `char` 배열 |
| 동적 메모리 | 실행 중 필요한 만큼 직접 할당한 메모리 |

---

## 주소와 포인터

> [!DEFINITION]
> 프로그램의 변수는 메모리의 특정 위치에 저장됩니다. 주소 연산자 `&`를 사용하면 변수의 주소를 확인할 수 있습니다.

```cpp
#include <iostream>
using namespace std;

int main() {
    int number = 42;

    cout << number << '\n';
    cout << &number << '\n';
    return 0;
}
```

주소 값은 실행할 때마다 달라질 수 있습니다.

### 포인터 선언

포인터(pointer)는 메모리 주소를 저장하는 변수입니다.

```cpp
int number = 42;
int* pointer = &number;
```

| 표현 | 읽는 방법 | 의미 |
| --- | --- | --- |
| `number` | number의 값 | 42 |
| `&number` | number의 주소 | number가 있는 위치 |
| `pointer` | 포인터에 저장한 값 | number의 주소 |
| `*pointer` | 그 주소의 객체 | number에 접근 |

`int& ref = number;`의 `&`는 **참조 선언**이고, 위 표현식 `&number`의 `&`는 **주소를 구하는 연산**입니다. 같은 기호라도 선언인지 표현식인지 보고 읽습니다.

```text
pointer ── 주소 저장 ──▶ number
                        42
```

포인터의 자료형은 가리키는 값의 자료형과 맞아야 합니다.

```cpp
int count = 10;
double temperature = 21.5;

int* countPointer = &count;
double* temperaturePointer = &temperature;
```

### nullptr

아무 객체도 가리키지 않는 포인터는 `nullptr`로 표현합니다.

```cpp
int* pointer = nullptr;
```

초기화하지 않은 포인터에는 알 수 없는 주소가 들어 있을 수 있으므로, 바로 연결할 대상이 없다면 `nullptr`로 초기화합니다.

```cpp
// int* unsafePointer;       // 위험: 알 수 없는 주소
int* safePointer = nullptr;  // 안전한 초기 상태
```

포인터를 사용하기 전에 검사할 수 있습니다.

```cpp
if (pointer != nullptr) {
    cout << *pointer << '\n';
}
```

---

## 역참조

> [!DEFINITION]
> 포인터 앞에 역참조 연산자 `*`를 붙이면 포인터가 가리키는 원본 값에 접근합니다.

```cpp
int number = 42;
int* pointer = &number;

cout << *pointer << '\n';  // 42
```

역참조한 위치에 새 값을 대입하면 원본 변수가 바뀝니다.

```cpp
*pointer = 100;
cout << number << '\n';  // 100
```

### 화살표를 옮기는 것과 상자 안을 바꾸는 것

```cpp
int first = 10;
int second = 20;
int* pointer = &first;
*pointer = 15;
pointer = &second;
*pointer = 25;
```

| 실행 후 | 포인터의 대상 | `first` | `second` |
| --- | --- | --- | --- |
| `int* pointer = &first;` | first | 10 | 20 |
| `*pointer = 15;` | first | 15 | 20 |
| `pointer = &second;` | second | 15 | 20 |
| `*pointer = 25;` | second | 15 | 25 |

`pointer = ...`는 화살표를 옮기고, `*pointer = ...`는 현재 화살표가 가리키는 값을 바꿉니다. 참조와 달리 포인터 자체는 다른 객체의 주소로 바꿀 수 있습니다.

### 선언의 *와 표현식의 *

```cpp
int* pointer = &number;
```

선언에서 `*`는 `pointer`가 포인터 변수임을 나타냅니다.

```cpp
cout << *pointer;
```

표현식에서 `*`는 포인터가 가리키는 값을 읽는 역참조 연산자입니다.

### nullptr 역참조 금지

```cpp
int* pointer = nullptr;
// cout << *pointer;  // 잘못된 접근
```

> [!CAUTION]
> 존재하지 않거나 유효하지 않은 주소를 역참조하면 프로그램이 비정상 종료될 수 있습니다.

이는 **정의되지 않은 동작**이므로 항상 오류 메시지나 충돌로 드러나는 것도 아닙니다. `pointer != nullptr`만으로 유효한 객체가 살아 있음을 보장하지는 않습니다. 해제된 주소나 수명이 끝난 지역 변수의 주소도 사용하면 안 됩니다.

---

## 포인터 매개변수

포인터를 함수에 전달하면 함수가 호출한 곳의 원본 값에 접근할 수 있습니다.

```cpp
#include <iostream>
using namespace std;

void addOne(int* number) {
    if (number != nullptr) {
        (*number)++;
    }
}

int main() {
    int value = 5;
    addOne(&value);

    cout << value << '\n';  // 6
    return 0;
}
```

호출할 때는 값이 아니라 주소를 전달합니다.

```text
addOne(&value)
       └── value의 주소
```

### 두 값 교환하기

```cpp
void swapValues(int* first, int* second) {
    if (first == nullptr || second == nullptr) {
        return;
    }

    int temp = *first;
    *first = *second;
    *second = temp;
}
```

```cpp
int x = 3;
int y = 7;
swapValues(&x, &y);
```

### 참조 매개변수와 비교

```cpp
void byReference(int& value) {
    value++;
}

void byPointer(int* value) {
    if (value != nullptr) {
        (*value)++;
    }
}
```

| 구분 | 참조 매개변수 | 포인터 매개변수 |
|---|---|---|
| 호출 | `byReference(x)` | `byPointer(&x)` |
| 빈 대상 | 표현하기 어려움 | `nullptr` 가능 |
| 접근 | `value` | `*value` |
| 일반적인 선택 | 대상이 반드시 존재함 | 대상이 없을 수도 있음 |

---

## 배열과 포인터

대부분의 표현식에서 배열 이름은 첫 번째 요소의 주소처럼 동작합니다.

```cpp
int numbers[4] = {10, 20, 30, 40};

int* pointer = numbers;
```

다음 두 주소는 같습니다.

```cpp
cout << numbers << '\n';
cout << &numbers[0] << '\n';
```

배열 인덱스 표현과 포인터 역참조 표현도 같은 요소를 나타냅니다.

```cpp
cout << numbers[2] << '\n';     // 30
cout << *(numbers + 2) << '\n'; // 30
```

```text
numbers + 0 ─▶ numbers[0]
numbers + 1 ─▶ numbers[1]
numbers + 2 ─▶ numbers[2]
numbers + 3 ─▶ numbers[3]
```

### 배열을 함수에 전달하기

```cpp
void printArray(const int* values, int size) {
    for (int i = 0; i < size; i++) {
        cout << values[i] << ' ';
    }
    cout << '\n';
}
```

다음 선언은 함수 매개변수에서 같은 의미로 사용됩니다.

```cpp
void printArray(const int values[], int size);
void printArray(const int* values, int size);
```

함수는 포인터만으로 배열의 크기를 알 수 없으므로 `size`를 함께 받아야 합니다.

배열과 포인터는 같은 자료형이 아닙니다. 배열 이름이 많은 표현식에서 첫 원소의 포인터로 변환되는 것입니다. 예를 들어 원래 배열의 `sizeof(numbers)`는 전체 배열의 바이트 수지만, 함수의 포인터 매개변수에 `sizeof`를 적용하면 포인터 자체의 크기입니다.

---

## 동적 메모리

지역 배열의 크기는 보통 컴파일할 때 정해집니다. 실행 중에 필요한 크기가 결정된다면 `new`로 메모리를 할당할 수 있습니다.

### 값 하나 할당하기

```cpp
int* number = new int;
*number = 42;

cout << *number << '\n';

delete number;
number = nullptr;
```

`new`로 할당한 메모리는 더 이상 필요하지 않을 때 반드시 `delete`로 해제합니다.

### 초기값과 함께 할당하기

```cpp
int* number = new int(42);
```

### 동적 배열 할당하기

```cpp
#include <iostream>
using namespace std;

int main() {
    int size = 0;
    if (!(cin >> size) || size <= 0 || size > 1000) {
        return 1;
    }

    int* numbers = new int[size]{};

    for (int i = 0; i < size; i++) {
        if (!(cin >> numbers[i])) {
            delete[] numbers;
            return 1;
        }
    }

    for (int i = 0; i < size; i++) {
        cout << numbers[i] << ' ';
    }

    delete[] numbers;
    numbers = nullptr;
    return 0;
}
```

배열로 할당했다면 반드시 `delete[]`로 해제해야 합니다.

| 할당 | 해제 |
|---|---|
| `new int` | `delete pointer` |
| `new int[size]` | `delete[] pointer` |

### 메모리 누수

> [!CAUTION]
> 할당한 메모리를 해제하지 않은 채 주소를 잃으면 메모리 누수가 발생합니다.

```cpp
int* pointer = new int(10);
pointer = new int(20);  // 처음 할당한 주소를 잃어버림
```

올바르게 해제한 뒤 새로운 메모리를 할당해야 합니다.

```cpp
int* pointer = new int(10);
delete pointer;

pointer = new int(20);
delete pointer;
pointer = nullptr;
```

### 댕글링 포인터

> [!DEFINITION]
> 메모리를 해제한 뒤에도 그 주소를 저장하고 있는 포인터를 댕글링 포인터라고 합니다.

```cpp
int* pointer = new int(10);
delete pointer;

// cout << *pointer;  // 위험: 이미 해제된 메모리
pointer = nullptr;
```

해제한 뒤 `nullptr`을 대입하면 실수로 다시 역참조할 가능성을 줄일 수 있습니다.

다른 포인터에 같은 주소를 복사해 뒀다면 그 포인터도 무효가 됩니다. `pointer = nullptr;`는 **이 변수 하나만** 바꾸며, 모든 별칭을 자동으로 고치지 않습니다. 지역 변수의 주소를 함수 밖으로 반환하는 경우도 원본이 사라져 같은 수명 문제가 생깁니다.

---

## vector와 스마트 포인터를 우선 고려하기

직접 `new[]`와 `delete[]`를 사용하는 대신 `vector`를 사용하면 메모리가 자동으로 관리됩니다.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int size = 0;
    if (!(cin >> size) || size <= 0 || size > 1000) {
        return 1;
    }

    vector<int> numbers(size);

    for (int& number : numbers) {
        if (!(cin >> number)) {
            return 1;
        }
    }

    for (int number : numbers) {
        cout << number << ' ';
    }
    return 0;
}
```

객체 하나를 동적으로 관리해야 하는 현대 C++ 코드에서는 원시 포인터와 `new` 대신 스마트 포인터를 사용하기도 합니다.

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> number = make_unique<int>(42);
    cout << *number << '\n';
    return 0;
}
```

`unique_ptr`가 소유한 객체는 스마트 포인터의 수명이 끝날 때 자동으로 정리됩니다. 이번 주에는 사용 예를 보고, 객체 수명에 정리를 맡기는 원리는 5주차 소멸자와 6주차 예외 처리에서 연결합니다. 위 객체에 직접 `delete`를 호출하지 않습니다.

---

## 종합 예제: 동적 점수 목록

```cpp
#include <iostream>
using namespace std;

double calculateAverage(const int* scores, int size) {
    if (scores == nullptr || size <= 0) {
        return 0.0;
    }

    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += scores[i];
    }

    return static_cast<double>(sum) / size;
}

int main() {
    int studentCount = 0;
    if (!(cin >> studentCount) || studentCount <= 0 || studentCount > 1000) {
        cout << "학생 수가 올바르지 않습니다.\n";
        return 1;
    }

    int* scores = new int[studentCount];

    for (int i = 0; i < studentCount; i++) {
        if (!(cin >> scores[i]) || scores[i] < 0 || scores[i] > 100) {
            delete[] scores;
            cout << "점수가 올바르지 않습니다.\n";
            return 1;
        }
    }

    cout << "평균: " << calculateAverage(scores, studentCount) << '\n';

    delete[] scores;
    scores = nullptr;
    return 0;
}
```

---

### 입력부터 해제까지 따라가기

입력을 `3`과 `80 90 100`으로 주면 `평균: 90`을 출력합니다. 이 예제는 학생 수 1~1000, 점수 0~100만 받으므로 `int` 합계가 범위를 넘지 않습니다.

| 시점 | 메모리 상태 | 할 일 |
| --- | --- | --- |
| `new int[studentCount]` 후 | 세 요소를 저장할 공간을 확보 | 읽기 전에 값을 넣음 |
| 입력 성공 후 | 80, 90, 100 저장 | 평균 함수는 읽기만 함 |
| 평균 계산 후 | 여전히 할당되어 있음 | 사용이 끝났으므로 해제 |
| `delete[] scores` 후 | 원소들의 수명이 끝남 | 다시 읽거나 해제하지 않음 |
| `scores = nullptr` 후 | 이 포인터는 대상 없음 | 다른 별칭의 유효성까지 고쳐지지는 않음 |

입력이 중간에 실패하는 경로에도 `delete[]`가 있습니다. `vector`라면 블록을 벗어날 때 자동으로 정리하므로 직접 해제할 경로를 하나씩 챙길 필요가 줄어듭니다.

## 함께 풀기: 같은 원본을 다른 방법으로 바꾸기

1. 앞의 `addOne(int* number)` 전체 예제를 실행해서 6이 나오는지 확인합니다.
2. `addOne(&value)` 다음에 `addOne(nullptr)`를 추가합니다. 왜 여전히 6인지 조건을 짚어 보세요.
3. `addOne`을 두 번 모두 `&value`로 호출하면 7이 되는지 예상하고 실행합니다.
4. 동적 점수 목록을 `vector<int>`로 바꾼다면 어떤 `delete[]` 줄들을 없앨 수 있는지 설명합니다.

> [!QUIZ]
> `int value = 10; int* p = &value;`에서 `p`와 `*p`는 각각 무엇인가요? `*p = 20;` 뒤 value는 얼마인가요?

> [!ANSWER]
> p는 value의 주소이고, *p는 그 주소에 있는 value에 접근하는 표현식입니다. 따라서 value는 20이 됩니다. `&p`는 포인터 변수 p 자체의 주소이므로 구분해야 합니다.

> [!QUIZ]
> `int* p = new int(10); int* q = p; delete p; p = nullptr;` 뒤에 q를 역참조해도 되나요?

> [!ANSWER]
> 안 됩니다. q도 해제된 객체의 주소를 갖고 있습니다. p를 nullptr로 바꾸어도 q는 자동으로 바뀌지 않습니다. 주소가 0이 아닌지와 대상이 살아 있는지는 다른 조건입니다.

**발표자 마무리:** 주소·대상·수명을 구분한 뒤 [5주차 클래스](/lectures/week-05)에서 객체를 만들고 정리하는 방법을 배웁니다.

## 자주 하는 실수

### 초기화하지 않은 포인터 사용

```cpp
// int* pointer;
// *pointer = 10;  // 위험
```

### nullptr 역참조

```cpp
int* pointer = nullptr;
// cout << *pointer;  // 잘못된 접근
```

### 배열 범위를 벗어난 포인터 연산

```cpp
int numbers[3] = {1, 2, 3};
int* pointer = numbers + 3;
// cout << *pointer;  // 끝 다음 주소는 역참조할 수 없음
```

### new와 delete 형태를 맞추지 않음

```cpp
int* numbers = new int[10];
// delete numbers;   // 잘못된 해제
delete[] numbers;    // 올바른 해제
```

### 같은 메모리를 두 번 해제

```cpp
int* pointer = new int(10);
delete pointer;
pointer = nullptr;

// delete pointer;는 nullptr에 대해서는 안전하지만,
// 이전 주소를 다른 포인터로 다시 해제하면 안 됨
```

### C 문자열의 널 문자 공간을 빼먹음

```cpp
char word[5] = "Hello";  // 오류: 널 문자까지 6칸 필요
char safeWord[6] = "Hello";
```

---

## 핵심 정리

- `&변수`는 변수의 주소를 구한다.
- 포인터는 주소를 저장하며, `*포인터`로 원본 값에 접근한다.
- 연결할 대상이 없는 포인터는 `nullptr`로 초기화한다.
- 포인터 매개변수는 원본을 변경하거나 대상이 없음을 표현할 수 있다.
- 배열 이름은 대부분 첫 요소의 주소처럼 사용된다.
- 포인터 연산은 배열 범위 안에서만 사용해야 한다.
- C 문자열은 널 문자 `\0`으로 끝나는 `char` 배열이다.
- `new`와 `delete`, `new[]`와 `delete[]`는 반드시 짝을 맞춘다.
- 직접 동적 메모리를 관리해야 하는 특별한 이유가 없다면 `vector`와 스마트 포인터를 우선 고려한다.


## 보충: const, 포인터 연산, C 문자열

여기부터는 포인터의 기본 동작에 익숙해진 뒤 읽습니다. 각 기호를 외우기보다 원본 값·저장한 주소·배열의 유효 구간 중 무엇이 바뀌는지 확인하세요.

## 포인터와 const

`const`의 위치에 따라 변경할 수 있는 대상이 달라집니다.

### 가리키는 값을 변경할 수 없는 포인터

```cpp
int number = 10;
const int* pointer = &number;

cout << *pointer << '\n';
// *pointer = 20;  // 오류
```

포인터가 다른 주소를 가리키는 것은 가능합니다.

```cpp
int other = 30;
pointer = &other;
```

### 포인터 자체를 변경할 수 없는 경우

```cpp
int number = 10;
int* const pointer = &number;

*pointer = 20;  // 원본 값 변경 가능
// pointer = &other;  // 오류: 저장된 주소 변경 불가
```

### 둘 다 변경할 수 없는 경우

```cpp
const int* const pointer = &number;
```

| 선언 | 원본 값 변경 | 가리키는 주소 변경 |
|---|---:|---:|
| `int* p` | 가능 | 가능 |
| `const int* p` | 불가능 | 가능 |
| `int* const p` | 가능 | 불가능 |
| `const int* const p` | 불가능 | 불가능 |

---

## 포인터 연산

포인터에 정수를 더하거나 빼면 해당 자료형의 요소 단위로 이동합니다.

```cpp
int numbers[4] = {10, 20, 30, 40};
int* pointer = numbers;

cout << *pointer << '\n';  // 10

pointer++;
cout << *pointer << '\n';  // 20

pointer += 2;
cout << *pointer << '\n';  // 40
```

`pointer + 1`은 주소 값을 단순히 1바이트 증가시키는 것이 아니라, 다음 `int` 요소의 주소로 이동합니다.

### 포인터로 배열 순회하기

```cpp
int numbers[4] = {10, 20, 30, 40};

for (int* pointer = numbers; pointer < numbers + 4; pointer++) {
    cout << *pointer << ' ';
}
```

### 두 포인터의 차이

같은 배열 안의 두 포인터를 빼면 두 요소 사이의 거리를 구할 수 있습니다.

```cpp
int numbers[5] = {10, 20, 30, 40, 50};
int* first = &numbers[1];
int* last = &numbers[4];

cout << last - first << '\n';  // 3
```

포인터의 거리 계산과 앞뒤 순서 비교는 같은 배열 안에서 연습합니다. 배열 끝 바로 다음 주소까지 만들 수 있지만 그 위치에는 원소가 없으므로 역참조할 수 없습니다. 서로 다른 객체를 가리키는 포인터의 `==`·`!=` 비교와, 배열 내부 위치를 계산하는 연산은 구분하세요.

---

## C 문자열

C 문자열은 마지막에 널 문자 `\0`이 들어 있는 `char` 배열입니다.

```cpp
char word[] = "Hello";
```

메모리에는 다음과 같이 저장됩니다.

```text
'H'  'e'  'l'  'l'  'o'  '\0'
```

문자 수는 5개지만 널 문자를 포함한 배열 크기는 6입니다.

```cpp
cout << sizeof(word) << '\n';  // 6
```

### 직접 초기화하기

```cpp
char word[] = {'H', 'i', '\0'};
```

널 문자가 없으면 `cout`이 문자열의 끝을 알 수 없습니다.

```cpp
char invalid[] = {'H', 'i'};  // C 문자열로 사용하기 위험함
```

### 문자열 입력

공백이 없는 단어는 `cin`으로 입력할 수 있습니다.

```cpp
char name[20];
cin >> setw(20) >> name;
```

`setw`에는 `<iomanip>`이 필요합니다. 위 입력은 C++17에서도 널 문자 자리를 포함한 20칸을 넘겨 쓰지 않도록 길이를 제한합니다. 일반적인 새 코드에서는 `string name; cin >> name;`을 우선 사용합니다.

공백을 포함한 한 줄은 `cin.getline`을 사용합니다.

```cpp
char sentence[100];
cin.getline(sentence, 100);
```

배열 크기를 넘는 입력을 받지 않도록 최대 길이를 지정해야 합니다.

### cstring 함수

`<cstring>`에는 C 문자열을 다루는 함수가 들어 있습니다.

```cpp
#include <cstring>
```

| 함수 | 역할 |
|---|---|
| `strlen(text)` | 널 문자를 제외한 길이 |
| `strcmp(a, b)` | 두 문자열 비교 |
| `strcpy(destination, source)` | 문자열 복사 |
| `strcat(destination, source)` | 문자열 이어 붙이기 |

```cpp
char first[20] = "Hello";
char second[] = "World";

cout << strlen(first) << '\n';

if (strcmp(first, second) == 0) {
    cout << "같은 문자열\n";
}
```

복사하거나 이어 붙일 때 목적지 배열의 크기가 충분해야 합니다. 일반적인 C++ 코드에서는 메모리를 더 안전하게 관리하는 `std::string`을 우선 사용합니다.

---


## 시험 대비 보충: 포인터를 한 줄씩 추적하기

최신 기말 대비 노트의 출력 추적 문제입니다. 본문의 주소·대상·수명 구분을 연습한 뒤 풀어 보세요. 아래 코드는 각각 독립된 코드 조각이며, `<iostream>`, `<cstring>`과 `using namespace std;`를 사용합니다. 실행문은 main 안에, 함수 정의는 main 밖에 둡니다. 컴파일 오류를 고르는 문제는 실행 전에 판정합니다.

크기 출력 문제는 **int가 4바이트, 포인터가 8바이트인 환경**, 문자열 순서 문제는 **ASCII 호환 문자 환경**을 가정합니다. 다른 환경의 크기는 sizeof로 직접 확인합니다. 포인터가 가리키는 대상은 사용 중 살아 있어야 합니다.

2025 기말의 포인터 출력 유형은 배열에서 가리키는 위치를 바꾸어 추적하는 연습과 연결됩니다. static 지역 변수 유형은 [6주차 보충](/lectures/week-06#static-지역-변수)에서 이어갑니다.

### 주소와 대상 추적

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int a = 10, b = 20;
> int* p = &a;
> int* q = &b;
> *p = *q + 5;
> p = q;
> *p = 7;
> cout << a << ' ' << b << ' ' << *p << ' ' << *q << ' ' << (p == q);
> ```

> [!ANSWER]
> ```text
> 25 7 7 7 1
> ```
>
> | 문장 | 의미 | a | b | p가 가리킴 |
> |---|---|---:|---:|---|
> | `*p = *q + 5` | `a = b + 5` | 25 | 20 | a |
> | `p = q` | 주소 복사 (화살표 이동) | 25 | 20 | b |
> | `*p = 7` | `b = 7` | 25 | 7 | b |
>
> `p = q`는 값이 아니라 주소를 복사합니다. 이후 `*p`와 `*q`는 같은 변수입니다.

> [!QUIZ]
> 다음 선언에서 (1) `p[0] == n`의 참·거짓, (2) `p = &k;`의 대입 가능 여부를 쓰고, (3) 배열 `arr`의 `arr[i]`를 포인터 연산으로 쓰시오.
>
> ```cpp
> int n = 3;
> int& k = n;
> int* p = &n;
> ```

> [!ANSWER]
> (1) 참. `p[0]`은 `*(p + 0)` = `*p` = `n`입니다. (2) 가능. `k`는 `n`의 별명이므로 `&k`는 `&n`과 같은 주소입니다. (3) `*(arr + i)`.

### const 선언 판정

> [!QUIZ]
> 컴파일 오류가 나는 줄을 모두 고르시오.
>
> ```cpp
> int n = 1, m = 2;
> const int* p1 = &n;
> *p1 = 5;               // (1)
> p1 = &m;               // (2)
> int* const p2 = &n;
> *p2 = 5;               // (3)
> p2 = &m;               // (4)
> const int* const p3 = &n;
> *p3 = 5;               // (5)
> p3 = &m;               // (6)
> const int c = 9;
> int* p4 = &c;          // (7)
> const int* p5 = &c;    // (8)
> ```

> [!ANSWER]
> 오류: (1), (4), (5), (6), (7).
>
> `const int*`는 값을, `int* const`는 주소를 바꿀 수 없습니다. `const int*`가 `n`처럼 const가 아닌 변수를 가리키는 것은 괜찮습니다(그 포인터로 바꿀 수 없을 뿐).

### 배열 위치와 포인터 이동

`*p++`는 `*(p++)`여서 포인터를 다음 요소로 옮기며 이전 요소를 사용합니다. `(*p)++`는 대상 값을 늘리고 이전 값을 사용합니다. `*++p`는 옮긴 다음 요소, `++*p`는 늘린 다음 값을 사용합니다. 포인터 이동은 같은 배열의 유효 범위 안에서만 합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int s[5] = {3, 1, 4, 1, 5};
> int* p = s + 1;
> for (int k = 0; k < 4; k++)
>     *(p + k) = k + p[k];
> cout << *s << ' ' << *p << ' ' << s[4] << ' ' << p[2];
> ```

> [!ANSWER]
> ```text
> 3 1 8 3
> ```
>
> `p`가 `s[1]`을 가리키므로 `p[k]`는 `s[k + 1]`입니다. 반복문은 `s[k + 1] += k`와 같습니다.
>
> | k | 바뀌는 원소 | 결과 배열 |
> |---:|---|---|
> | 0 | `s[1] += 0` | 3 1 4 1 5 |
> | 1 | `s[2] += 1` | 3 1 5 1 5 |
> | 2 | `s[3] += 2` | 3 1 5 3 5 |
> | 3 | `s[4] += 3` | 3 1 5 3 8 |
>
> `*s` = `s[0]` = 3, `*p` = `s[1]` = 1, `s[4]` = 8, `p[2]` = `s[3]` = 3. `s[0]`은 한 번도 바뀌지 않습니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int arr[] = {10, 20, 30, 40};
> int* p = arr;
> cout << *p++ << ' ';
> cout << (*p)++ << ' ';
> cout << *++p << ' ';
> cout << ++*p << ' ';
> cout << *(p + 1) << ' ' << p[-1] << ' ' << p - arr << '\n';
> for (int v : arr) cout << v << ' ';
> ```

> [!ANSWER]
> ```text
> 10 20 30 31 40 21 2
> 10 21 31 40
> ```
>
> | 식 | 출력 | p 위치 | 배열 |
> |---|---|---:|---|
> | `*p++` | 10 | 1 | 10 20 30 40 |
> | `(*p)++` | 20 | 1 | 10 21 30 40 |
> | `*++p` | 30 | 2 | 10 21 30 40 |
> | `++*p` | 31 | 2 | 10 21 31 40 |
> | `*(p + 1)`, `p[-1]`, `p - arr` | 40, 21, 2 | 2 | 10 21 31 40 |

> [!QUIZ]
> `int a[5] = {1, 2, 3, 4, 5}; int* p = a;`일 때 출력과 오류를 판정하시오. (64비트 환경)
>
> ```cpp
> cout << sizeof(a) << ' ' << sizeof(p) << ' ' << *(a + 2) << ' '
>      << *(p + 4) << ' ' << (a + 2 == &a[2]) << '\n';
> a = p;      // (가)
> a++;        // (나)
> p++;        // (다)
> ```

> [!ANSWER]
> 출력: `20 8 3 5 1`
>
> (가)와 (나)는 컴파일 오류(배열 이름은 대입·증가할 수 없음), (다)는 정상입니다.

### C 문자열의 길이와 비교

`strlen`은 널 문자 앞까지의 길이, sizeof는 배열 전체의 바이트 수입니다. char 배열의 내용은 `strcmp(a, b)`가 0인지로 비교합니다. `string` 객체끼리는 `==`로 내용을 비교할 수 있으므로 구분하세요. `strcpy`와 `strcat`은 목적지에 널 문자까지 들어갈 공간이 있어야 합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> char a[20] = "Hello";
> char b[] = "World";
> cout << strlen(a) << ' ' << sizeof(a) << ' ' << sizeof(b) << ' ';
> strcat(a, b);
> cout << a << ' ' << strlen(a) << ' ';
> cout << (strcmp("abc", "abd") < 0) << ' ' << strcmp("abc", "abc") << ' '
>      << (strcmp("b", "a") > 0) << ' ' << (strcmp("Zoo", "apple") < 0) << '\n';
> ```

> [!ANSWER]
> ```text
> 5 20 6 HelloWorld 10 1 0 1 1
> ```
>
> `"Zoo" < "apple"`인 이유: `'Z'`(90)가 `'a'`(97)보다 작기 때문입니다.

### 동적 배열의 별칭과 해제

> [!QUIZ]
> 다음 출력을 쓰고, 마지막에 필요한 문장을 쓰시오.
>
> ```cpp
> int n = 4;
> int* d = new int[n];
> for (int i = 0; i < n; i++) d[i] = i * i;
> int* e = d + 1;
> e[1] = 100;
> for (int i = 0; i < n; i++) cout << d[i] << ' ';
> ```

> [!ANSWER]
> 출력: `0 1 100 9`
>
> `e`는 `d[1]`을 가리키므로 `e[1]`은 `d[2]`입니다. 마지막에 `delete[] d;`가 필요합니다. `e`는 할당 시작 주소가 아니므로 해제할 수 없습니다. 시작 주소 d를 정확히 한 번만 delete[]로 해제합니다.

### 값·포인터·참조 전달 비교

아래 s2와 minmax는 유효한 포인터와 실제 크기를 받는 예제입니다. minmax에는 요소가 하나 이상 있어야 합니다. 서로 다른 호출 사이의 x와 y 값을 표로 이어 적으세요.


```cpp
void s1(int a, int b)   { int t = a; a = b; b = t; }        // 복사본 교환
void s2(int* a, int* b) { int t = *a; *a = *b; *b = t; }    // 가리키는 값 교환
void s3(int* a, int* b) { int* t = a; a = b; b = t; }       // 지역 포인터만 교환
void s4(int& a, int& b) { int t = a; a = b; b = t; }        // 원본 교환
```

| 구분 | 포인터 매개변수 | 참조 매개변수 |
|---|---|---|
| 선언 | `void f(int* p)` | `void f(int& r)` |
| 호출 | `f(&x)` | `f(x)` |
| 안에서 사용 | `*p` | `r` |
| "없음" 표현 | `nullptr` 가능 | 불가(반드시 대상이 있음) |
| 다른 대상으로 바꾸기 | 가능 | 불가 |

> [!QUIZ]
> `int x = 1, y = 2;`에서 시작해 아래를 차례로 실행할 때 각 호출 뒤의 `x y`를 쓰시오.
>
> ```cpp
> s1(x, y);   s2(&x, &y);   s3(&x, &y);   s4(x, y);
> ```

> [!ANSWER]
> | 호출 | x y | 이유 |
> |---|---|---|
> | `s1(x, y)` | 1 2 | 값 복사본만 교환 |
> | `s2(&x, &y)` | 2 1 | `*a`, `*b`로 원본 교환 |
> | `s3(&x, &y)` | 2 1 | 포인터 변수(복사본)끼리만 교환, 값은 그대로 |
> | `s4(x, y)` | 1 2 | 참조로 원본 교환 |
>
> `s3`이 함정입니다. 포인터도 값으로 전달되므로 함수 안에서 `a = b`를 해도 호출한 쪽에는 영향이 없습니다.

포인터 매개변수로 여러 결과를 돌려줄 수 있습니다.

```cpp
void minmax(const int a[], int n, int* mn, int* mx) {
    *mn = *mx = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *mn) *mn = a[i];
        if (a[i] > *mx) *mx = a[i];
    }
}

int arr[4] = {4, -2, 9, 0};
int lo, hi;
minmax(arr, 4, &lo, &hi);     // lo = -2, hi = 9
```

---

## 7. 이중 포인터

포인터도 변수이므로 주소가 있습니다. 포인터의 주소를 저장하는 포인터를 이중 포인터라고 합니다.

```cpp
int x = 5;
int* p = &x;
int** pp = &p;    // 포인터의 주소
**pp = 9;         // x = 9
```

```text
pp ──▶ [ p ] ──▶ [ x : 9 ]
```

| 식 | 뜻 |
|---|---|
| `pp` | `p`의 주소 |
| `*pp` | `p` 자체 (`x`의 주소) |
| `**pp` | `x`의 값 |

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int x = 1, y = 2;
> int* p = &x;
> int** pp = &p;
> **pp = 10;
> *pp = &y;
> **pp += 5;
> cout << x << ' ' << y << ' ' << *p;
> ```

> [!ANSWER]
> ```text
> 10 7 7
> ```
>
> `**pp = 10`은 `x = 10`입니다. `*pp = &y`는 `p` 자체를 바꾸므로 이제 `p`가 `y`를 가리킵니다. 그 뒤 `**pp += 5`는 `y += 5`입니다.

---

### 2차원 배열은 행 경계도 지킵니다

`int m[2][3]`은 길이 3의 행 배열 두 개입니다. `m[1][1]` 또는 `*(*(m + 1) + 1)`로 접근합니다. 물리적으로 이어져 있어도 첫 행의 int 포인터를 행 경계 너머까지 더해 평평한 배열처럼 읽는 방식은 사용하지 않습니다. 2차원 배열의 열 크기가 필요한 이유와 함께 복습하세요.
