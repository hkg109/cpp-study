# 포인터와 동적 메모리

## 전체 학습 흐름

```text
변수의 메모리 주소 확인
        ↓
포인터에 주소 저장
        ↓
역참조로 원본 값 읽고 변경
        ↓
포인터를 함수와 배열에 활용
        ↓
C 문자열의 끝을 나타내는 널 문자 이해
        ↓
new와 delete로 동적 메모리 관리
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

프로그램의 변수는 메모리의 특정 위치에 저장됩니다. 주소 연산자 `&`를 사용하면 변수의 주소를 확인할 수 있습니다.

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

포인터 앞에 역참조 연산자 `*`를 붙이면 포인터가 가리키는 원본 값에 접근합니다.

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

존재하지 않거나 유효하지 않은 주소를 역참조하면 프로그램이 비정상 종료될 수 있습니다.

---

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

서로 다른 배열을 가리키는 포인터끼리 빼거나 비교하면 안 됩니다.

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
cin >> name;
```

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
    int size;
    cin >> size;

    if (size <= 0) {
        return 0;
    }

    int* numbers = new int[size]{};

    for (int i = 0; i < size; i++) {
        cin >> numbers[i];
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

할당한 메모리를 해제하지 않은 채 주소를 잃으면 메모리 누수가 발생합니다.

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

메모리를 해제한 뒤에도 그 주소를 저장하고 있는 포인터를 댕글링 포인터라고 합니다.

```cpp
int* pointer = new int(10);
delete pointer;

// cout << *pointer;  // 위험: 이미 해제된 메모리
pointer = nullptr;
```

해제한 뒤 `nullptr`을 대입하면 실수로 다시 역참조할 가능성을 줄일 수 있습니다.

---

## vector와 스마트 포인터를 우선 고려하기

직접 `new[]`와 `delete[]`를 사용하는 대신 `vector`를 사용하면 메모리가 자동으로 관리됩니다.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int size;
    cin >> size;

    vector<int> numbers(size);

    for (int& number : numbers) {
        cin >> number;
    }

    for (int number : numbers) {
        cout << number << ' ';
    }
    return 0;
}
```

객체 하나를 동적으로 관리해야 하는 현대 C++ 코드에서는 원시 포인터와 `new` 대신 스마트 포인터를 사용하기도 합니다.

```cpp
#include <memory>

unique_ptr<int> number = make_unique<int>(42);
cout << *number << '\n';
```

스마트 포인터는 소유권 단원에서 더 자세히 다룹니다. 이번 주에는 주소, 역참조, 동적 할당과 해제의 원리를 이해하는 것이 목표입니다.

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
    int studentCount;
    cin >> studentCount;

    if (studentCount <= 0) {
        cout << "학생 수가 올바르지 않습니다.\n";
        return 0;
    }

    int* scores = new int[studentCount];

    for (int i = 0; i < studentCount; i++) {
        cin >> scores[i];
    }

    cout << "평균: " << calculateAverage(scores, studentCount) << '\n';

    delete[] scores;
    scores = nullptr;
    return 0;
}
```

---

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

