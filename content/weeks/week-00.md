# Hello World 해부하기

```cpp
#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

| // … | 컴파일러가 무시하는 한 줄 주석 |
| --- | --- |
| #include <iostream> | 표준 입출력 라이브러리 기능을 포함 |
| int main() | 기본 함수 main의 정의 시작, 프로그램의 진입점 |
| std::cout << … | 문자열을 화면에 출력 |
| std::endl | 새 줄로 이동하고 입출력 버퍼를 비움 |
| return 0 | 프로그램이 상태 코드 0을 반환 |

---

# 부가 설명

**1. 컴파일러가 뭔가요?**

컴파일러는 사람이 작성한 코드를 컴퓨터가 실행할 수 있는 형태로 번역하는 프로그램입니다.

컴퓨터의 CPU는 이 코드를 그대로 이해하지 못하기에 컴파일러가 C++ 문법을 검사하고 실행 가능한 기계어로 번역합니다!!

```
C++ Source Code
       ↓
문법·자료형 검사
       ↓
Compiler
       ↓
실행파일
       ↓
프로그램 실행
```

문법이 잘못되었다면 컴파일러가 오류 메시지를 출력하고 실행파일을 만들지 못합니다.

---

**2. 표준 입출력 라이브러리가 뭔가요?**

표준 입출력 기능은 키보드로 값을 입력받거나 화면에 값을 출력할 때 사용하는 C++의 표준 기능입니다.
대표적인 기능으로는 `cin` ,`cout` 이 있습니다

| cin | 키보드 입력을 변수에 저장 |
| --- | --- |
| cout | Console에 값을 출력 |

이 기능들의 선언을 사용하려면 다음 Header를 포함해야 합니다.

```
#include <iostream>
```

이해하기 쉽게 iostream의 어원에 대해 설명해드리면 다음과 같습니다

```
Input + Output + Stream
 입력    출력    데이터흐름
```

기본적으로 저희가 다룰 실습 예제나, 다른 교양 강의에서 사용할 코드에서는 입출력 기능이 대부분 사용되기에 항상 쓰는 **기본적인 헤더**라고 생각하시면 될 거 같습니다!

---

3. `using namespace std;` 란?

```cpp
#include <iostream>

using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
```

처음 보여드렸던 코드와 차이점이 보이시나요?

 `using namespace std;` 가 사용되고, `cout` 앞에 붙었던 `std::` 가 사라져있죠?

이것이 `using namespace std;` 를 선언하는 이유입니다

바로 표준 라이브러리 이름 앞의 `std::` 를 반복해서 쓰지 않기 위해서 입니다!

```cpp
#include <iostream>
#include <string>

using namespace std;

int main() {
    string name;
    cin >> name;
    cout << name << endl;
}
```

`using namespace std;` 를 선언하지 않으면 다음처럼 작성해야 합니다

```cpp
std::string name;
std::cin >> name;
std::cout << name << std::endl;
```

즉, `using namespace std;` 를 선언하는게 코드를 손수 작성할 때 더 편하겠죠?

---

**이 아래부터는 조금 딥하니, 자세히 알고 싶으신 분들만 읽어주세요
main 함수 부분부터 다시 읽어주시면 됩니다!**

---

그렇다면 `using namespace std;` 의 정확한 의미는 무엇일까요?

이를 알려면 `Namespace`  에 대해 먼저 알아야 합니다

`Namespace` 는 서로 같은 이름의 변수, 함수, Class 가 충돌하지 않도록 구역별로 나누는 기능입니다

쉽게 말해 컴퓨터 안에 만드는 이름표가 붙은 폴더와 비슷합니다

예를 들어 서로 다른 두 사람이 모두 `score` 라는 변수를 만들 수 있습니다.

```cpp
namespace game {
    int score = 100;
}

namespace exam {
    int score = 90;
}
```

변수 이름은 둘 다 score지만, 서로 다른 `Namespace`에 들어 있기 때문에 충돌하지 않습니다.

```
game
└─ score = 100

exam
└─ score = 90
```

사용할 때는 어느 `Namespace`에 속한 이름인지 지정합니다! 

아래 예제를 참고해주세요

```cpp
#include <iostream>

namespace game {
    int score = 100;
}

namespace exam {
    int score = 90;
}

int main() {
    std::cout << game::score << '\n';
    std::cout << exam::score << '\n';

    return 0;
}
```

---

`std::` 에 대해서도 알아봅시다

우선 `::` 은 범위 지정 연산자 입니다

간단한 예제를 통해 이해해봅시다!

```cpp
game::score
```

`game` Namespace 안에 있는 `score` 라고 읽을 수 있습니다

즉 `game`이라는 폴더 안에 있는 `score`라는 변수라고 해석하면 되겠습니다

---

`std` 는 C++ 표준 라이브러리의 이름들이 들어 있는 Namespace 입니다!

`std` 는 단어의 줄임말입니다

```cpp
STanDard
-> 표준
```

대표적인 예시들을 아래 표로 보겠습니다!

| std::cout | Console 출력 |
| --- | --- |
| std::cin | Console 입력 |
| std::string | 문자열 Type |
| std::vector | 크기를 조절할 수 있는 Container |
| std::endl | 줄바꿈 후 출력 버퍼 Flush |
| std::sort | 데이터 정렬 함수 |
| std::sqrt | 제곱근 계산 함수 |

---

`using namespace std;`의 정확한 의미

Compiler는 이름을 만나면 **현재 위치에서 가까운 Scope부터 바깥쪽으로 검색**합니다.

```cpp

void hello() {  // 전역 범위
}

int main() {
    hello();    // main 내부 → 전역 범위 순서로 검색
}
```

기본적인 이름 검색 방향은 다음과 같습니다.

```
현재 Block
    ↓
바깥 Block
    ↓
Class 또는 Namespace
    ↓
전역 범위
```

다음 코드에서 `printMessage()`는 전역 범위에서 찾을 수 있습니다.

```cpp
#include <iostream>

void printMessage() {
    std::cout << "Hello";
}

int main() {
    printMessage();
}
```

하지만 `cout`은 전역 범위가 아니라 `std` Namespace 안에 있으므로 소속을 지정해야 합니다.

```cpp
std::cout << "Hello";
```

이때 다음 문장을 사용하면:

```cpp
using namespace std;
```

기존 이름 검색 과정에 `std` Namespace도 후보로 추가됩니다.

```cpp
#include <iostream>

using namespace std;

int main() {
    cout << "Hello";
}
```

Compiler는 `cout`을 찾지 못하면 `std` Namespace에서도 검색하여 `std::cout`을 사용합니다.

```
현재 Scope에서 cout 검색
        ↓ 없음
바깥 Scope에서 cout 검색
        ↓ 없음
std Namespace에서 cout 검색
        ↓ 발견
std::cout 사용
```

따라서 다음 두 표현은 같은 `cout`을 가리킵니다.

```cpp
std::cout << "Hello";
```

```cpp
using namespace std;

cout << "Hello";
```

다른 표준 Library 이름도 마찬가지입니다.

```cpp
cout   → std::cout
cin    → std::cin
string → std::string
```

단, `std`의 이름을 현재 위치로 복사하는 것은 아닙니다. 이름을 검색할 때 `std` Namespace도 후보에 포함하는 것입니다!

### 한 문장으로 요약하자면

> **`using namespace std;`는 이름 검색 범위에 `std` Namespace를 추가하여 `std::`를 생략할 수 있게 합니다!**
> 

---

**4. main 함수는 항상 실행 되나요?**

일반적인 C++ 프로그램을 실행하면 `main` 함수가 프로그램의 시작점으로 실행됩니다

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "프로그램 시작\n";
    return 0;
}
```

실행 과정은 다음과 같습니다

```cpp
사용자가 프로그램 실행
        ↓
운영체제와 C++ 실행환경이 프로그램 준비
        ↓
main 함수 호출
        ↓
main 내부 코드 실행
        ↓
프로그램 종료
```

---

>> **혹시 `main` 함수를 사용하지 않고 다른 함수를 사용할 수 있나요?**

일반적인 C++ 실행 프로그램에서는 `main` 함수 없이 다른 함수만 작성할 수는 없습니다!

```cpp
#include <iostream>
using namespace std;

void hello() {
    cout << "Hello\n";
}
```

위 코드에는 `hello` 함수가 있지만 프로그램의 시작점인 `main` 함수가 없습니다.

따라서 실행파일을 만들 때 일반적으로 다음과 같은 `Link Error`가 발생합니다

```cpp
main 함수를 찾을 수 없음
```

다른 함수를 사용하려면 보통 `main` 에서 호출해야 합니다.

```cpp
#include <iostream>
using namespace std;

void hello() {
    cout << "Hello\n";
}

int main() {
    hello();
    return 0;
}
```

---

# 리터럴, 변수, 자료형

프로그램은 데이터를 저장하고 계산하여 결과를 만듭니다. 이때 데이터를 직접 표현하는 것이 **리터럴(Literal)**이고, 데이터를 저장하고 다시 사용하기 위해 이름을 붙인 것이 **변수**입니다

---

## 1. 리터럴이란?

리터럴은 소스 코드에 직접 작성한 고정된 값입니다

예를 들어 다음 코드에서 20은 정수 리터럴입니다.

```cpp
int age = 20;
```

```cpp
int   age   =   20;
 │     │    │    │
 │     │    │    └─ 리터럴
 │     │    └────── 값을 저장
 │     └─────────── 변수 이름
 └───────────────── 자료형
```

주요 리터럴은 다음과 같습니다

| **종류** | **예** | **의미** |
| --- | --- | --- |
| 정수 | 42 | 10진수 정수 |
| 16진수 | 0x2A | 16진수 정수 |
| 실수 | 3.14 | 기본적으로 double |
| 문자 | ‘A’ | 문자 하나 |
| Boolean | true, false | 참 또는 거짓 |
| 문자열 | “Hello” | 여러 문자로 이루어진 문자열 |

### **42와 0x2A**

다음 두 리터럴은 표현 방법만 다르고 값은 같습니다.

```cpp
int a = 42;
int b = 0x2A;

42      → 10진수 42
0x2A    → 16진수 2A → 10진수 42
```

### **문자와 문자열의 차이**

```cpp
char grade = 'A';
string name = "A";

'A' || 문자 하나
"A" || 문자 A와 문자열 종료 문자(\0)를 포함한 문자열 리터럴
```

이 때문에 작음 따옴표와 큰 따옴표를 구분해야 합니다!!

```cpp
char grade = "A";  //오류
```

"A" 는 문자 하나가 아니라 문자열이므로 char 변수에 저장할 수 없습니다

## 2. 변수란?

변수는 값을 저장하는 메모리 공간에 붙인 이름입니다

```cpp
int age = 20; // age 변수 선언
```

개념적으로 다음과 같이 이해할 수 있습니다

```cpp
변수 이름
   age
    │
    ▼
┌─────────────┐
│     20      │
└─────────────┘
  메모리 공간
```

변수를 선언한 이후에는 age라는 이름을 사용하여 저장된 값에 접근할 수 있습니다!

```cpp
cout << age;

OUTPUT
20
```

변수의 값을 변경할 수도 있습니다.

```cpp
age = 21;
```

메모리 상태:

```cpp
변경 전                    변경 후

age                        age
┌─────────┐                ┌─────────┐
│   20    │       →        │   21    │
└─────────┘                └─────────┘
```

---

## 3. 변수와 리터럴의 차이

```cpp
int age = 20;
```

여기에서:

```cpp
age → 변수
20  → 리터럴
```

둘의 가장 큰 차이는 값의 변경 가능성입니다

변수 age에 저장된 값은 변경할 수 있지만, 코드에 적힌 리터럴 20 자체가 변경되는 것은 아닙니다.

---

## 4. 변수 선언, 정의, 초기화, 대입

변수를 사용할 때는 다음 네 용어를 구분해야 합니다

### 선언과 정의

```cpp
int age;
```

이 코드는 컴파일러에게 변수 이름과 자료형 정보를 제공합니다

함수 내부에서 작성한 `int age;` 는 단순히 이름을 알리는 것을 넘어 실제 저장 공간도 만들기 때문에, 정확히는 변수의 정의이기도 합니다

### 초기화

변수를 만드는 순간 첫 값을 저장하는 것을 초기화라고 합니다

```cpp
int age = 20;
```

```cpp
변수 생성
   ↓
메모리 공간 준비
   ↓
첫 값 20 저장
```

### 대입

이미 존재하는 변수에 새로운 값을 저장하는 것을 대입이라고 합니다.

```cpp
age = 21;
```

```cpp
기존 값 20
    ↓
새로운 값 21로 교체
```

### 코드 비교

```cpp
int age;       // 변수를 정의하지만 명시적인 초기값은 없음
int score = 90; // 변수를 정의하면서 90으로 초기화

age = 20;      // 이미 존재하는 age에 20을 대입
```

### 자주 하는 실수

함수 내부의 기본 자료형 변수를 초기화하지 않고 사용하면 값이 정해져 있지 않습니다

즉, 선언한 변수에 어떤 값이 들어 있다고 보장할 수 없으므로 출력 결과를 예측할 수 없습니다.

>> 이에 가능하면 **변수를 선언하면서 초기화**해야 합니다.

```cpp
int age = 0;
int age{0}; // 둘 다 가능
```

# 자료형

## 기본 자료형

### char

문자 하나를 저장하는 기본 자료형

```cpp
char grade = 'A';
```

### 주의!

```cpp
char a = '7'; // 문자
int b = 7; // 정수
```

‘7’은 숫자 7이 아니라 문자입니다!!!

---

### int

정수를 저장하는 기본 자료형

```cpp
int age = 20;
int score = 95;
int temperature = -3;
```

소수점이 있는 값은 온전히 저장할 수 없습니다!

```cpp
int value = 3.14;
```

위 코드에서 실수 3.14가 정수로 변환되며 소수 부분이 사라질 수 있습니다

---

### float

소수점이 있는 실수를 저장하는 단정밀도 부동소수점 자료형

```cpp
float temperature = 23.5f;
```

float 리터럴은 일반적으로 뒤에 f를 붙입니다!

```cpp
3.14   // double 리터럴
3.14f  // float 리터럴
```

---

### double

float과 같이 실수를 저장하지만, float보다 높은 정밀도를 제공하는 자료형

```cpp
double height = 1.75;
double pi = 3.141592;
```

| 자료형 | 일반적인 특징 |
| --- | --- |
| `float` | 메모리 사용량이 비교적 작고 정밀도가 낮음 |
| `double` | 메모리 사용량이 비교적 크고 정밀도가 높음 |

---

### bool

참 또는 거짓을 저장하는 자료형

```cpp
bool pass = true;
bool gameOver = false;
```

가능한 값이 두 가지이므로, 조건의 상태를 표현할 때 적합합니다.

```cpp
bool isAdult = true;
bool isLoggedIn = false;
```

---

### string

문자열, 즉 여러 문자를 하나의 텍스트로 저장하는 자료형

```cpp
string name = "Alex";
string message = "Hello World";
```

string은 기본 자료형이 아니라 C++ 표준 라이브러리가 제공하는 Class 입니다

따라서 다음 헤더가 필요합니다.

```cpp
#include <string>
```

`using namespace std;` 가 없다면 다음처럼 작성해야 합니다

```cpp
std::string name = "Alex";
```

## 자료형 비교

| 자료형 | 저장 대상 | 예 |
| --- | --- | --- |
| `char` | 문자 하나 | `'A'` |
| `int` | 정수 | `20` |
| `float` | 단정밀도 실수 | `1.75f` |
| `double` | 배정밀도 실수 | `1.75` |
| `bool` | 참 또는 거짓 | `true` |
| `string` | 문자열 | `"Alex"` |

## 변수 이름 규칙

사용할 수 있는 문자

- 영문자
- 숫자
- 밑줄 _

주의

- 숫자로 시작할 수 없음

```cpp
int 2score;  // 오류
int score2;  // 가능
```

- 공백을 사용할 수 없음

```cpp
int student score;   // 오류
int studentScore;    // 가능
int student_score;   // 가능
```

- C++ keyword를 사용할 수 없음

```cpp
C++ keyword 예시
int
double
return
if
while
class
==================================
int return;  // 오류
int class;   // 오류
```

- 대소문자를 구분함

```cpp
다음은 모두 서로 다른 이름입니다!

int score;
int Score;
int SCORE;
```

- 의미 있는 이름을 사용해야 함

```cpp
int a = 20;
```

보다 다음 코드가 이해하기 쉽습니다.

```cpp
int studentAge = 20;
```

## 고정 폭 정수형 <cstdint>

일반적인 `int` , `long` 의 정확한 비트 수는 운영체제와 컴파일러 환경에 따라 달라질 수 있습니다

따라서 정확한 크기의 정수가 필요한 경우, <cstdint> 헤더의 고정 폭 정수형을 사용할 수 있습니다.

```cpp
#include <cstdint>
```

| Signed(부호 O) | Unsigned(부호 X) | 의미 |
| --- | --- | --- |
| `int8_t` | `uint8_t` | 정확히 8비트 정수 |
| `int16_t` | `uint16_t` | 정확히 16비트 정수 |
| `int32_t` | `uint32_t` | 정확히 32비트 정수 |
| `int64_t` | `uint64_t` | 정확히 64비트 정수 |

```cpp
int
→ 환경에 따라 정확한 크기가 달라질 수 있음

int32_t
→ 사용할 수 있는 환경이라면 정확히 32비트
```

## Signed 와 Unsigned

Signed 정수형은 음수, 0, 양수를 표현합니다.

```cpp
int32_t temperature = -10;
```

Unsigned 정수형은 0과 양수만 표현합니다.

```cpp
uint32_t studentCount = 30;
```

## Boolean 과 bool

기본적으로 bool을 cout으로 출력하면 정수처럼 표시됩니다

## 출력 결과

```cpp
#include <iostream>

using namespace std;

int main() {
    bool a = true;
    bool b = false;

    cout << a << '\n';
    cout << b << '\n';

    return 0;
}
```

실행결과

```cpp
1
0
```

`boolalpha` 를 사용하면 단어로 출력할 수 있습니다.

```cpp
cout << boolalpha;
cout << a << '\n';
cout << b << '\n';
```

실행결과

```cpp
true
false 
```

## 정수와 bool의 변환

C++에서는 정수 값을 bool을 변환할 수 있습니다

```cpp
0        → false
0이 아님 → true
```

예시:

```cpp
#include <iostream>

using namespace std;

int main() {
    bool a = 0;
    bool b = 1;
    bool c = -5;

    cout << boolalpha;
    cout << a << '\n';
    cout << b << '\n';
    cout << c << '\n';

    return 0;
}
```

실행결과

```cpp
false
true
true
```

반대로 bool을 정수로 변환하면 다음과 같습니다

```cpp
false → 0
true  → 1
```

> bool은 독립된 기본 자료형이나, 정수형과 서로 변환할 수 있다.
> 

---

# 연산자

## 연산자란?

**연산자(Operator)는 하나 이상의 값을 계산하거나 비교하는 기호입니다.**

```
5 + 3
```

위 식에서:

```
5   +   3
│   │   │
│   │   └─ 피연산자
│   └───── 연산자
└───────── 피연산자
```

`5`와 `3`처럼 연산의 대상이 되는 값을 **피연산자(Operand)**라고 합니다.

---

## 산술 연산자

산술 연산자는 숫자를 계산할 때 사용합니다.

| 연산자 | 이름 | 예 | 결과 |
| --- | --- | --- | --- |
| `+` | 덧셈 | `5 + 3` | `8` |
| `-` | 뺄셈 | `5 - 3` | `2` |
| `*` | 곱셈 | `5 * 3` | `15` |
| `/` | 나눗셈 | `6 / 3` | `2` |
| `%` | 나머지 | `5 % 3` | `2` |

사용 예:

```
#include <iostream>

using namespace std;

int main() {
    int a = 5;
    int b = 3;

    cout << a + b << '\n';
    cout << a - b << '\n';
    cout << a * b << '\n';
    cout << a / b << '\n';
    cout << a % b << '\n';

    return 0;
}
```

실행 결과:

```
8
2
15
1
2
```

### 왜 `5 / 3`의 결과가 `1`인가요?

두 피연산자가 모두 정수이면 결과도 정수입니다.

```
5 / 3
```

수학적인 결과는 약 `1.666...`이지만 정수형 결과에는 소수 부분을 저장할 수 없습니다.

```
5 / 3
→ 1.666...
→ 소수 부분 제거
→ 1
```

소수 결과가 필요하다면 피연산자 중 하나 이상을 실수로 만들어야 합니다.

```
cout << 5.0 / 3;
```

실행 결과:

```
1.66667
```

| 식 | 연산 종류 | 결과 |
| --- | --- | --- |
| `5 / 3` | 정수 나눗셈 | `1` |
| `5.0 / 3` | 실수 나눗셈 | 약 `1.66667` |
| `5 / 3.0` | 실수 나눗셈 | 약 `1.66667` |

### 나머지 연산자 `%`

`%`는 정수 나눗셈의 나머지를 구합니다.

```
cout << 5 % 3;
```

```
5 = 3 × 1 + 2
              ↑
            나머지
```

실행 결과:

```
2
```

`%`는 홀수와 짝수를 판별할 때 자주 사용합니다.

```
int number = 7;

cout << number % 2;
```

결과가 `0`이면 짝수이고, `1`이면 홀수입니다.

### ⚠ 0으로 나눌 수 없다

```
int result = 10 / 0;  // 잘못된 코드
```

정수를 0으로 나누거나 0으로 나머지 연산을 수행하면 정상적인 결과가 정의되지 않습니다.

```
10 / 0
10 % 0
```

> **한 문장으로 기억하기:** 정수끼리 나누면 소수 부분이 사라지고, `%`는 정수 나눗셈의 나머지를 구합니다.
> 

---

## 대입 연산자

대입 연산자 `=`는 오른쪽 값을 왼쪽 변수에 저장합니다.

```
int x = 10;

x = 20;
```

두 번째 코드의 실행 과정:

```
오른쪽 값 20 계산
        ↓
변수 x의 메모리 공간에 저장
        ↓
기존 값 10이 20으로 변경
```

`=`는 수학에서 사용하는 “같다”가 아닙니다.

```
x = x + 1;
```

수학식으로 보면 이상해 보이지만 C++에서는 다음 순서로 실행됩니다.

```
현재 x의 값 가져오기
        ↓
x + 1 계산
        ↓
계산 결과를 x에 다시 저장
```

예를 들어 `x`가 `5`라면:

```
x = x + 1
  = 5 + 1
  = 6

최종 x = 6
```

### 복합 대입 연산자

계산 후 같은 변수에 다시 저장하는 코드는 짧게 작성할 수 있습니다.

| 기본 표현 | 복합 대입 | 의미 |
| --- | --- | --- |
| `x = x + 3` | `x += 3` | 3을 더한 후 저장 |
| `x = x - 3` | `x -= 3` | 3을 뺀 후 저장 |
| `x = x * 3` | `x *= 3` | 3을 곱한 후 저장 |
| `x = x / 3` | `x /= 3` | 3으로 나눈 후 저장 |
| `x = x % 3` | `x %= 3` | 3으로 나눈 나머지 저장 |

예:

```
int score = 80;

score += 10;
```

최종 결과:

```
score = 90
```

> **한 문장으로 기억하기:** `=`는 오른쪽의 계산 결과를 왼쪽 변수에 저장하는 연산자입니다.
> 

---

## 비교 연산자

비교 연산자는 두 값을 비교하여 `true` 또는 `false`를 만듭니다.

| 연산자 | 의미 | 예 | 결과 |
| --- | --- | --- | --- |
| `<` | 왼쪽이 더 작다 | `5 < 8` | `true` |
| `>` | 왼쪽이 더 크다 | `5 > 8` | `false` |
| `<=` | 왼쪽이 작거나 같다 | `5 <= 5` | `true` |
| `>=` | 왼쪽이 크거나 같다 | `5 >= 8` | `false` |
| `==` | 두 값이 같다 | `5 == 5` | `true` |
| `!=` | 두 값이 같지 않다 | `5 != 8` | `true` |

### `=`와 `==`의 차이

입문자가 가장 자주 혼동하는 연산자입니다.

```
x = 5;
```

오른쪽 값 `5`를 변수 `x`에 저장합니다.

```
x == 5
```

`x`의 값이 `5`와 같은지 비교합니다.

| 연산자 | 종류 | 의미 |
| --- | --- | --- |
| `=` | 대입 연산자 | 오른쪽 값을 왼쪽 변수에 저장 |
| `==` | 비교 연산자 | 두 값이 같은지 비교 |

예:

```
#include <iostream>

using namespace std;

int main() {
    int score = 90;
    bool result = score == 90;

    cout << boolalpha;
    cout << result << '\n';

    return 0;
}
```

실행 결과:

```
true
```

### 비교 결과 저장하기

비교 연산의 결과는 `bool` 값입니다.

```
bool isAdult = age >= 20;
```

`age`가 `20`이라면:

```
age >= 20
20 >= 20
true
```

따라서 `isAdult`에는 `true`가 저장됩니다.

> **한 문장으로 기억하기:** 비교 연산자는 두 값을 비교하고 그 결과로 `true` 또는 `false`를 만듭니다.
> 

---

## 정수 오버플로우

**정수 오버플로우(Integer Overflow)는 계산 결과가 자료형이 표현할 수 있는 범위를 벗어나는 문제입니다.**

자료형은 사용할 수 있는 메모리 크기가 정해져 있으므로 표현 가능한 값에도 범위가 있습니다.

개념적으로 표현하면:

```
자료형이 표현할 수 있는 최대값: 100

현재 값: 100
계산:    100 + 1
결과:    표현 가능한 범위를 벗어남
```

실제 `int`의 최대값은 `<limits>`를 이용해 확인할 수 있습니다.

```
#include <iostream>
#include <limits>

using namespace std;

int main() {
    cout << numeric_limits<int>::max() << '\n';
    cout << numeric_limits<int>::min() << '\n';

    return 0;
}
```

많은 일반적인 환경에서 32비트 `int`의 범위는 다음과 같습니다.

```
최솟값: -2,147,483,648
최댓값:  2,147,483,647
```

다음 계산은 최댓값을 벗어납니다.

```
int number = 2147483647;
number = number + 1;
```

### 중요한 규칙

Signed 정수의 오버플로우 결과는 C++에서 **정의되지 않은 동작(Undefined Behavior)**입니다.

따라서 다음처럼 단순히 최솟값으로 돌아간다고 가정하면 안 됩니다.

```
최댓값 + 1 = 최솟값이라고 항상 보장됨  ❌
```

더 큰 값이 필요하면 더 넓은 정수형을 고려할 수 있습니다.

```
long long population = 8000000000LL;
```

또는 정확한 크기가 필요하면 `<cstdint>`의 고정 폭 정수형을 사용할 수 있습니다.

```
#include <cstdint>

int64_t population = 8000000000LL;
```

### Unsigned 정수의 경우

Unsigned 정수는 범위를 넘으면 표현 가능한 범위 안에서 다시 순환합니다. 하지만 입문 단계에서는 이러한 동작에 의존하기보다 계산 범위를 먼저 확인하는 습관이 중요합니다.

> **한 문장으로 기억하기:** 정수 계산 전에 결과가 해당 자료형의 표현 범위를 넘지 않는지 확인해야 합니다.
> 

---

## 결합성이란?

**결합성(Associativity)은 우선순위가 같은 연산자가 연속으로 등장할 때 어느 방향부터 묶어서 계산할지를 정합니다.**

대부분의 산술 연산자는 왼쪽에서 오른쪽으로 결합합니다.

```
3 / 4 / 5
```

다음과 같이 계산됩니다.

```
(3 / 4) / 5
```

모두 정수이므로:

```
3 / 4 = 0
0 / 5 = 0
```

최종 결과:

```
0
```

다음처럼 계산하는 것이 아닙니다.

```
3 / (4 / 5)  ❌
```

### 덧셈과 뺄셈

```
10 - 3 - 2
```

왼쪽부터 계산합니다.

```
(10 - 3) - 2
= 7 - 2
= 5
```

### 대입 연산자는 오른쪽에서 왼쪽

대입 연산자는 오른쪽에서 왼쪽으로 결합합니다.

```
x = y = 10;
```

다음처럼 처리됩니다.

```
x = (y = 10)
```

실행 순서:

```
y에 10 저장
    ↓
대입식의 결과 10
    ↓
x에도 10 저장
```

최종 결과:

```
x = 10
y = 10
```

> **한 문장으로 기억하기:** 결합성은 우선순위가 같은 연산자가 연속될 때 계산 방향을 결정합니다.
> 

---

## 연산자 우선순위

**연산자 우선순위(Operator Precedence)는 한 식에 여러 종류의 연산자가 있을 때 어떤 연산을 먼저 수행할지 결정합니다.**

입문 단계에서는 다음 순서를 기억하면 됩니다.

```
1. ( )
2. *  /  %
3. +  -
4. <  <=  >  >=
5. ==  !=
6. &&
7. ||
8. =
```

표로 정리하면:

| 우선순위 | 연산자 | 의미 |
| --- | --- | --- |
| 1 | `( )` | 괄호 |
| 2 | `*`, `/`, `%` | 곱셈, 나눗셈, 나머지 |
| 3 | `+`, `-` | 덧셈, 뺄셈 |
| 4 | `<`, `<=`, `>`, `>=` | 크기 비교 |
| 5 | `==`, `!=` | 같음 비교 |
| 6 | `&&` | 논리 AND |
| 7 | `||` | 논리 OR |
| 8 | `=` | 대입 |

### 예제 1

```
2 / 3 / 4 + 5
```

우선 `/`가 `+`보다 먼저 계산됩니다. `/`끼리는 왼쪽에서 오른쪽으로 결합합니다.

```
2 / 3 / 4 + 5
↓
(2 / 3) / 4 + 5
↓
0 / 4 + 5
↓
0 + 5
↓
5
```

최종 결과:

```
5
```

### 예제 2

```
x = (7 * 3 / 4 - 2) * 5 == y;
```

`int` 변수만 사용한다고 가정하면 다음 순서로 처리됩니다.

```
7 * 3
↓
21

21 / 4
↓
5    // 정수 나눗셈

5 - 2
↓
3

3 * 5
↓
15

15 == y
↓
true 또는 false

x = 비교 결과
```

이 식에서 `==`가 `=`보다 우선순위가 높기 때문에 비교 결과가 `x`에 저장됩니다.

```
x = (((7 * 3 / 4 - 2) * 5) == y);
```

만약 `x`가 `int`라면:

```
true  → 1
false → 0
```

으로 변환되어 저장됩니다.

하지만 의도를 더 명확하게 표현하려면 `x`를 `bool`로 선언하는 것이 좋습니다.

```
bool x = (7 * 3 / 4 - 2) * 5 == y;
```

### 괄호를 적극적으로 사용하기

우선순위를 알고 있더라도 복잡한 식에는 괄호를 사용합니다.

```
bool canEnter = (age >= 18) && hasTicket;
```

괄호가 없어도 같은 순서로 계산되지만, 괄호를 사용하면 조건의 구조를 더 쉽게 이해할 수 있습니다.

> **한 문장으로 기억하기:** 우선순위가 헷갈리거나 식이 복잡하면 괄호로 계산 순서를 명확하게 표현합니다.
> 

---

## 논리 연산자

논리 연산자는 하나 이상의 조건을 결합하거나 논리값을 반대로 바꿉니다.

| 연산자 | 이름 | 의미 |
| --- | --- | --- |
| `&&` | AND | 두 조건이 모두 참일 때 참 |
| `||` | OR | 하나 이상의 조건이 참일 때 참 |
| `!` | NOT | 참과 거짓을 반대로 변경 |

---

### AND: `&&`

두 조건이 모두 `true`일 때만 전체 결과가 `true`입니다.

```
bool result = true && false;
```

실행 결과:

```
false
```

진리표:

| A | B | `A && B` |
| --- | --- | --- |
| `false` | `false` | `false` |
| `false` | `true` | `false` |
| `true` | `false` | `false` |
| `true` | `true` | `true` |

실생활 예:

```
bool canEnter = isAdult && hasTicket;
```

입장하려면 다음 두 조건이 모두 참이어야 합니다.

```
성인이다
AND
티켓이 있다
```

---

### OR: `||`

두 조건 중 하나 이상이 `true`이면 전체 결과가 `true`입니다.

```
bool result = true || false;
```

실행 결과:

```
true
```

진리표:

| A | B | `A || B` |
| --- | --- | --- |
| `false` | `false` | `false` |
| `false` | `true` | `true` |
| `true` | `false` | `true` |
| `true` | `true` | `true` |

실생활 예:

```
bool canGetDiscount = isStudent || isSenior;
```

학생이거나 노인이면 할인받을 수 있다는 의미입니다.

---

### NOT: `!`

논리값을 반대로 바꿉니다.

```
bool result = !true;
```

실행 결과:

```
false
```

진리표:

| A | `!A` |
| --- | --- |
| `false` | `true` |
| `true` | `false` |

실생활 예:

```
bool isLoggedIn = false;
bool needLogin = !isLoggedIn;
```

```
isLoggedIn = false
!isLoggedIn = true
needLogin = true
```

---

## 논리 연산자의 단축 평가

`&&`와 `||`는 결과가 이미 결정되면 오른쪽 조건을 확인하지 않을 수 있습니다. 이를 단축 평가(Short-circuit Evaluation)라고 합니다.

### AND의 단축 평가

```
false && 두 번째_조건
```

첫 번째 조건이 `false`라면 전체 결과는 반드시 `false`입니다. 따라서 두 번째 조건을 실행할 필요가 없습니다.

```
false && 무엇이든
→ false
```

### OR의 단축 평가

```
true || 두 번째_조건
```

첫 번째 조건이 `true`라면 전체 결과는 반드시 `true`입니다. 따라서 두 번째 조건을 실행할 필요가 없습니다.

```
true || 무엇이든
→ true
```

### 안전한 조건 검사에 활용

```
int divisor = 0;

bool canDivide = divisor != 0 && 10 / divisor > 2;
```

실행 순서:

```
divisor != 0
↓
false
↓
&&의 전체 결과는 이미 false
↓
10 / divisor는 실행하지 않음
```

따라서 두 번째 조건에서 0으로 나누는 연산을 피할 수 있습니다.

> **한 문장으로 기억하기:** `&&`와 `||`는 결과가 이미 결정되면 오른쪽 조건을 평가하지 않습니다.
> 

---

## 종합 예제

```
#include <iostream>

using namespace std;

int main() {
    int age = 20;
    bool hasTicket = true;

    bool isAdult = age >= 18;
    bool canEnter = isAdult && hasTicket;

    cout << boolalpha;
    cout << "성인 여부: " << isAdult << '\n';
    cout << "입장 가능: " << canEnter << '\n';

    return 0;
}
```

실행 결과:

```
성인 여부: true
입장 가능: true
```

### 실행 과정

```
age에 20 저장
        ↓
hasTicket에 true 저장
        ↓
age >= 18 계산
        ↓
20 >= 18 → true
        ↓
isAdult에 true 저장
        ↓
isAdult && hasTicket 계산
        ↓
true && true → true
        ↓
canEnter에 true 저장
        ↓
결과 출력
```

---

# 자주 하는 실수

## `=`와 `==`를 혼동

```
bool result = age = 20;
```

위 코드는 비교가 아니라 `age`에 `20`을 대입합니다.

올바른 비교:

```
bool result = age == 20;
```

---

## 정수 나눗셈을 실수 나눗셈으로 착각

```
double result = 5 / 2;
```

오른쪽의 `5 / 2`가 먼저 정수로 계산되므로 결과는 `2.0`입니다.

```
5 / 2 → 2
2를 double에 저장 → 2.0
```

소수 결과가 필요하다면:

```
double result = 5.0 / 2;
```

결과:

```
2.5
```

---

## NOT 연산 뒤 세미콜론 누락

잘못된 코드:

```
bool result = !true
```

올바른 코드:

```
bool result = !true;
```

---