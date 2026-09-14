# 함수
## 함수가 필요한 이유

함수(Function)는 특정 작업을 수행하도록 작성한 코드 묶음이다.

함수를 사용하면 다음과 같은 장점이 있다.

- 같은 코드를 여러 번 작성하지 않아도 된다.
- 큰 문제를 여러 개의 작은 문제로 나눌 수 있다.
- 프로그램의 구조를 파악하고 수정하기 쉬워진다.
- 한 번 작성한 기능을 다른 위치에서 다시 사용할 수 있다.

예를 들어 두 값 중 큰 값을 구하는 작업을 `maxValue`라는 함수로 만들 수 있다.

```cpp
#include <iostream>

using namespace std;

int maxValue(int first, int second) {
    if (first > second) {
        return first;
    }

    return second;
}

int main() {
    cout << maxValue(5, 2) << '\n';
    return 0;
}
```

실행 결과:

```text
5
```

---

## 함수의 구성 요소

함수를 작성할 때는 다음 요소를 결정해야 한다.

| 구성 요소 | 의미 | 예 |
| --- | --- | --- |
| 반환형 | 함수가 돌려주는 값의 자료형 | `int` |
| 함수 이름 | 함수를 호출할 때 사용하는 이름 | `add` |
| 매개변수 | 함수가 입력받을 값 | `int a`, `int b` |
| 함수 본문 | 함수가 실제로 수행할 코드 | `{ return a + b; }` |

기본 형태:

```cpp
반환형 함수이름(자료형 매개변수1, 자료형 매개변수2) {
    실행할 코드
    return 반환값;
}
```

예시:

```cpp
int add(int a, int b) {
    return a + b;
}
```

구성 요소를 나누면 다음과 같다.

```text
int       add       (int a, int b)
 │         │              │
 │         │              └─ 매개변수
 │         └──────────────── 함수 이름
 └────────────────────────── 반환형
```

---

## 매개변수와 인수

### 매개변수

매개변수(Parameter)는 함수가 전달받은 값을 저장하는 함수 내부의 변수이다.

```cpp
int add(int a, int b) {
    return a + b;
}
```

위 코드에서 `a`와 `b`가 매개변수이다. 매개변수는 함수가 실행되는 동안 지역 변수처럼 사용된다.

### 인수

인수(Argument)는 함수를 호출할 때 실제로 전달하는 값이다.

```cpp
int result = add(3, 5);
```

위 코드에서 `3`과 `5`가 인수이다.

| 용어 | 의미 | 예 |
| --- | --- | --- |
| 매개변수 | 함수 정의에서 값을 받을 변수 | `int a`, `int b` |
| 인수 | 함수 호출 시 전달하는 실제 값 | `3`, `5` |

인수에는 리터럴, 변수, 표현식을 사용할 수 있다.

```cpp
int x = 4;
int y = 7;

add(3, 5);       // 리터럴
add(x, y);       // 변수
add(x + 1, y);   // 표현식
```

---

## 함수 호출 과정

```cpp
#include <iostream>

using namespace std;

int maxValue(int first, int second) {
    int result;

    if (first > second) {
        result = first;
    } else {
        result = second;
    }

    return result;
}

int main() {
    int a = 5;
    int b = 2;
    int answer = maxValue(a, b);

    cout << answer << '\n';
    return 0;
}
```

실행 과정:

```text
main에서 maxValue(a, b) 호출
        ↓
a의 값 5가 first에 전달됨
b의 값 2가 second에 전달됨
        ↓
두 값을 비교하여 result에 5 저장
        ↓
return result 실행
        ↓
반환값 5가 answer에 저장됨
```

---

## 값에 의한 전달

기본 자료형의 값을 일반 매개변수로 전달하면 인수의 값이 매개변수에 **복사**된다. 이를 값에 의한 전달(Call by Value)이라고 한다.

```cpp
#include <iostream>

using namespace std;

void changeNumber(int number) {
    number = 100;
}

int main() {
    int value = 10;

    changeNumber(value);
    cout << value << '\n';

    return 0;
}
```

실행 결과:

```text
10
```

`value`의 값 `10`이 `number`에 복사되므로 두 변수는 서로 다른 메모리 공간을 사용한다. 함수 안에서 `number`를 변경해도 원본 변수 `value`는 바뀌지 않는다.

```text
value = 10
    │ 값 복사
    ▼
number = 10 → 100

value는 여전히 10
```

---

## 지역 변수

함수 안에서 선언한 변수는 지역 변수(Local Variable)이다.

```cpp
int maxValue(int first, int second) {
    int result;
    return result;
}
```

`first`, `second`, `result`는 모두 `maxValue` 함수의 지역 변수이다.

- 선언된 함수 안에서만 사용할 수 있다.
- 다른 함수에서 같은 이름의 지역 변수를 선언해도 충돌하지 않는다.
- 일반적인 지역 변수는 함수 호출 때 생성되고 함수가 끝나면 사라진다.

```cpp
void firstFunction() {
    int count = 1;
}

void secondFunction() {
    int count = 2;
}
```

두 `count`는 서로 다른 변수이다.

---

## `return` 문

`return`은 함수의 실행을 끝내고 호출한 위치로 값을 돌려준다.

```cpp
return 표현식;
```

예시:

```cpp
int square(int number) {
    return number * number;
}
```

```cpp
int result = square(4);
```

`square(4)`의 반환값 `16`이 `result`에 저장된다.

반환값의 자료형은 함수의 반환형과 호환되어야 한다.

```cpp
int getNumber() {
    return 10;
}
```

---

## 반환값이 없는 함수와 `void`

함수가 값을 반환하지 않는다면 반환형으로 `void`를 사용한다.

```cpp
#include <iostream>

using namespace std;

void printGreeting(string name) {
    cout << "Hello, " << name << "!\n";
}

int main() {
    printGreeting("Alex");
    return 0;
}
```

실행 결과:

```text
Hello, Alex!
```

`void` 함수에서도 `return;`을 사용해 함수를 즉시 종료할 수 있지만 값을 함께 반환할 수는 없다.

```cpp
void printPositive(int number) {
    if (number <= 0) {
        return;
    }

    cout << number << '\n';
}
```

---

# 함수 원형

## 함수 원형이 필요한 이유

C++ 컴파일러는 함수를 호출하는 지점에서 해당 함수의 이름, 반환형, 매개변수 자료형을 알고 있어야 한다.

함수 정의가 호출문보다 아래에 있다면 먼저 함수 원형(Function Prototype)을 작성한다.

```cpp
int add(int a, int b);
```

함수 원형에는 함수 본문이 없으며 끝에 세미콜론을 붙인다.

```cpp
#include <iostream>

using namespace std;

int add(int a, int b);  // 함수 원형

int main() {
    cout << add(3, 5) << '\n';
    return 0;
}

int add(int a, int b) { // 함수 정의
    return a + b;
}
```

함수 원형의 매개변수 이름은 생략할 수 있다.

```cpp
int add(int, int);
```

다만 이름을 함께 작성하면 각 값의 역할을 이해하기 쉽다.

```cpp
int add(int first, int second);
```

함수 원형은 다음 상황에서 주로 사용한다.

- 함수 정의보다 앞에서 함수를 호출할 때
- 여러 함수가 서로 호출할 때
- 헤더 파일에 외부에서 사용할 함수를 선언할 때

---

# 재귀 함수

## 재귀란?

함수가 자기 자신을 다시 호출하는 것을 재귀(Recursion)라고 한다.

재귀는 큰 문제를 같은 구조의 더 작은 문제로 나눌 수 있을 때 유용하다.

재귀 함수에는 반드시 다음 두 요소가 필요하다.

| 구성 요소 | 의미 |
| --- | --- |
| 기저 조건 | 더 이상 자기 자신을 호출하지 않고 즉시 답을 반환하는 조건 |
| 재귀 단계 | 더 작은 문제를 해결하기 위해 자기 자신을 다시 호출하는 부분 |

---

## 팩토리얼 예제

팩토리얼은 다음과 같이 정의한다.

```text
n! = n × (n - 1) × ... × 2 × 1
0! = 1
```

재귀 함수로 구현하면 다음과 같다.

```cpp
#include <iostream>

using namespace std;

long long factorial(int number) {
    if (number <= 1) {
        return 1;                         // 기저 조건
    }

    return number * factorial(number - 1); // 재귀 단계
}

int main() {
    cout << factorial(4) << '\n';
    return 0;
}
```

실행 결과:

```text
24
```

호출이 진행되는 과정:

```text
factorial(4)
= 4 × factorial(3)
= 4 × 3 × factorial(2)
= 4 × 3 × 2 × factorial(1)
= 4 × 3 × 2 × 1
```

반환되는 과정:

```text
factorial(1) → 1 반환
factorial(2) → 2 × 1 = 2 반환
factorial(3) → 3 × 2 = 6 반환
factorial(4) → 4 × 6 = 24 반환
```

### 재귀 함수 설계 원칙

- 기저 조건을 반드시 작성한다.
- 재귀 호출의 인수는 기저 조건에 가까워져야 한다.
- 각 호출이 어떤 더 작은 문제를 해결하는지 명확해야 한다.

기저 조건이 없거나 입력값이 기저 조건에 가까워지지 않으면 호출이 계속 쌓여 프로그램이 비정상 종료될 수 있다.

---

## 재귀를 반복문으로 바꾸기

재귀 호출을 단계별로 펼치면 반복되는 계산 구조를 찾을 수 있다. 이 과정을 바탕으로 재귀 함수를 반복문으로 바꿀 수 있다.

```cpp
long long factorial(int number) {
    long long result = 1;

    for (int i = 1; i <= number; i++) {
        result *= i;
    }

    return result;
}
```

두 구현은 같은 값을 계산하지만 실행 방식은 다르다.

| 재귀 | 반복문 |
| --- | --- |
| 함수가 자기 자신을 호출한다. | 하나의 함수 안에서 반복한다. |
| 문제 구조를 직관적으로 표현할 수 있다. | 호출에 필요한 추가 메모리가 적다. |
| 호출이 너무 깊으면 스택이 부족해질 수 있다. | 단순 반복 문제에서 일반적으로 효율적이다. |

---

## 상호 재귀

두 개 이상의 함수가 서로를 호출하는 형태를 상호 재귀(Mutual Recursion)라고 한다.

```text
chicken() → egg() → chicken() → ...
```

서로를 호출하는 함수는 상대 함수의 정보를 호출 전에 알아야 하므로 함수 원형이 필요하다.

```cpp
#include <iostream>
#include <string>

using namespace std;

string chicken(int generation);
string egg(int generation);

string chicken(int generation) {
    if (generation == 0) {
        return "Chicken!";
    }

    return egg(generation - 1);
}

string egg(int generation) {
    if (generation == 0) {
        return "Egg!";
    }

    return chicken(generation - 1);
}

int main() {
    int generation;

    cout << "시작 세대를 입력하세요: ";
    cin >> generation;
    cout << chicken(generation) << '\n';

    return 0;
}
```

---

# 함수와 변수의 스코프

## 스코프란?

스코프(Scope)는 이름을 사용하여 변수나 함수에 접근할 수 있는 코드의 범위이다.

이름은 일반적으로 선언된 지점부터 해당 범위의 끝까지 사용할 수 있다.

| 종류 | 선언 위치 | 접근 가능한 범위 |
| --- | --- | --- |
| 지역 변수 | 함수 내부 | 선언 지점부터 함수 끝까지 |
| 블록 변수 | 중괄호 `{ }` 내부 | 선언 지점부터 해당 블록 끝까지 |
| 전역 변수 | 모든 함수의 바깥 | 선언 지점부터 파일의 해당 범위 끝까지 |

---

## 블록 스코프

중괄호 `{ }`로 묶인 영역을 블록(Block)이라고 한다. 블록 안에서 선언한 변수는 해당 블록 안에서만 사용할 수 있다.

```cpp
#include <iostream>

using namespace std;

int main() {
    int y = 10;

    {
        int a = y;
        cout << a << '\n'; // 사용 가능
    }

    // cout << a << '\n'; // 오류: a는 블록 밖에 존재하지 않음
    return 0;
}
```

중첩 블록의 변수도 자신이 선언된 블록과 그 안쪽 블록에서만 사용할 수 있다.

```cpp
void printValues() {
    for (int j = 0; j < 10; j++) {
        int k = j * 10;

        {
            int m = j + k;
            cout << j << ", " << k << ", " << m << '\n';
        }

        // cout << m; // 오류
    }

    // cout << j; // 오류
    // cout << k; // 오류
}
```

---

## 지역 변수와 전역 변수

### 지역 변수

함수 안에서 선언한 변수이다.

```cpp
void calculate() {
    int result = 10;
}
```

- 해당 함수 안에서만 접근할 수 있다.
- 함수가 호출될 때 만들어지고 함수가 끝나면 일반적으로 사라진다.
- 서로 다른 함수는 같은 이름의 지역 변수를 가질 수 있다.

### 전역 변수

모든 함수의 바깥에서 선언한 변수이다.

```cpp
bool debugMode = true;

void printDebugMessage() {
    if (debugMode) {
        cout << "Debug mode\n";
    }
}
```

전역 변수는 여러 함수에서 접근하거나 변경할 수 있지만, 값이 어디에서 바뀌었는지 추적하기 어려워질 수 있다. 필요한 경우가 아니라면 지역 변수와 함수의 매개변수를 우선 사용하는 편이 좋다.

---

## 함수 이름의 스코프

파일의 네임스페이스 범위에서 선언하거나 정의한 함수는 선언 이후부터 호출할 수 있다.

```cpp
int main() {
    cout << add(2, 3); // add가 아직 선언되지 않았다면 오류
}

int add(int a, int b) {
    return a + b;
}
```

함수 정의를 아래에 두고 싶다면 `main`보다 위에 함수 원형을 작성한다.

```cpp
int add(int a, int b);
```

---

# 저장 기간

## 스코프와 저장 기간의 차이

스코프는 **코드에서 이름을 사용할 수 있는 범위**이고, 저장 기간(Storage Duration)은 **변수가 메모리에 존재하는 기간**이다.

| 구분 | 질문 |
| --- | --- |
| 스코프 | 이 이름을 어디에서 사용할 수 있는가? |
| 저장 기간 | 이 변수가 언제 생성되고 언제 사라지는가? |

일반적인 지역 변수는 함수나 블록에 들어올 때 생성되고 빠져나갈 때 사라진다. 전역 변수는 프로그램 실행 동안 존재한다.

---

## 정적 지역 변수 `static`

지역 변수에 `static`을 붙이면 함수 호출이 끝나도 값이 유지된다. 초기화는 프로그램 실행 중 한 번만 이루어진다.

```cpp
#include <iostream>

using namespace std;

int countCalls() {
    static int count = 0;
    count++;
    return count;
}

int main() {
    cout << countCalls() << '\n';
    cout << countCalls() << '\n';
    cout << countCalls() << '\n';

    return 0;
}
```

실행 결과:

```text
1
2
3
```

`count`의 스코프는 `countCalls` 함수 내부로 제한되지만, 저장된 값은 다음 함수 호출까지 유지된다.

---

## `extern`

`extern`은 변수가 다른 위치에 정의되어 있음을 컴파일러에 알리는 선언에 사용한다.

```cpp
extern double globalValue;
```

일반적으로 여러 소스 파일에서 하나의 전역 변수를 공유해야 할 때 사용한다. `extern` 선언과 별도로 실제 저장 공간을 만드는 정의가 한 곳에 있어야 한다.

```cpp
double globalValue = 3.14;
```

전역 상태는 프로그램의 흐름을 복잡하게 만들 수 있으므로 필요한 범위에서 제한적으로 사용한다.

### 현대 C++에서의 참고 사항

- `auto`는 현재 자료형을 자동으로 추론하는 키워드로 사용한다.
- `register` 저장 지정자는 현대 C++에서 사용하지 않는다.
- 지역 변수의 기본 저장 기간을 이해하기 위해 `auto`나 `register`를 직접 작성할 필요는 없다.

---

# 함수 라이브러리

## 표준 라이브러리란?

C++ 표준 라이브러리는 입출력, 문자열, 수학 계산 등 자주 필요한 기능을 미리 제공한다.

라이브러리 함수를 사용할 때 내부 구현을 모두 알 필요는 없지만 다음 내용은 알아야 한다.

- 함수가 어떤 작업을 하는가?
- 어떤 인수를 전달해야 하는가?
- 어떤 값을 반환하는가?
- 사용하려면 어떤 헤더가 필요한가?

헤더는 전처리기 지시문 `#include`로 포함한다.

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <cmath>
```

| 헤더 | 주요 기능 |
| --- | --- |
| `<iostream>` | 콘솔 입력과 출력 |
| `<string>` | 문자열 |
| `<vector>` | 크기를 조절할 수 있는 배열 형태의 컨테이너 |
| `<cmath>` | 수학 함수 |
| `<ctime>` | 시간 관련 기능 |

현대 C++에서는 C 스타일 헤더인 `<math.h>`보다 `<cmath>`를 권장한다.

---

## `<cmath>`의 주요 함수

| 함수 | 기능 | 예시 결과 |
| --- | --- | --- |
| `ceil(x)` | `x`보다 작지 않은 가장 가까운 정숫값 | `ceil(3.2)` → `4.0` |
| `floor(x)` | `x`보다 크지 않은 가장 가까운 정숫값 | `floor(3.8)` → `3.0` |
| `fabs(x)` | 실수의 절댓값 | `fabs(-2.5)` → `2.5` |
| `sqrt(x)` | 제곱근 | `sqrt(16.0)` → `4.0` |
| `exp(x)` | 자연상수 `e`의 `x`제곱 | `exp(1.0)` → 약 `2.71828` |
| `log(x)` | 자연로그 | `log(exp(1.0))` → 약 `1.0` |
| `log10(x)` | 밑이 10인 로그 | `log10(100.0)` → `2.0` |

```cpp
#include <cmath>
#include <iostream>

using namespace std;

int main() {
    double number = 16.0;

    cout << sqrt(number) << '\n';
    cout << ceil(3.2) << '\n';
    cout << floor(3.8) << '\n';

    return 0;
}
```

수학 함수에는 입력 범위가 있다. 예를 들어 실수 범위에서 `sqrt`에는 음수를, `log`에는 0 이하의 값을 전달하지 않는다.

---

# 네임스페이스

## 네임스페이스가 필요한 이유

네임스페이스(Namespace)는 같은 이름의 변수, 함수, 클래스가 서로 충돌하지 않도록 이름을 구역별로 나누는 기능이다.

```cpp
namespace game {
    int score = 100;
}

namespace exam {
    int score = 90;
}
```

두 변수의 이름은 모두 `score`이지만 서로 다른 네임스페이스에 있으므로 충돌하지 않는다.

범위 지정 연산자 `::`를 사용해 소속을 지정한다.

```cpp
#include <iostream>

using namespace std;

namespace game {
    int score = 100;
}

namespace exam {
    int score = 90;
}

int main() {
    cout << game::score << '\n';
    cout << exam::score << '\n';
    return 0;
}
```

---

## `std` 네임스페이스

`std`는 C++ 표준 라이브러리의 이름이 들어 있는 네임스페이스이다.

```text
std::cout
std::cin
std::string
std::vector
```

`using namespace std;`를 선언하면 현재 범위에서 `std` 안의 이름을 한정자 없이 사용할 수 있다.

```cpp
#include <iostream>

using namespace std;

int main() {
    cout << "Hello\n";
    return 0;
}
```

즉, `cout`은 `std`에 있는 `cout`을 가리킬 수 있게 된다. 이름을 복사하는 것이 아니라, 한정하지 않은 이름을 찾을 때 `std`의 이름도 사용할 수 있게 하는 것이다.

규모가 큰 프로그램에서는 서로 다른 라이브러리의 같은 이름이 충돌할 수 있으므로 필요한 이름만 가져오는 방법도 사용한다.

```cpp
using std::cout;
using std::string;
```

---

# 상수와 `const`

## `const` 변수

변수를 선언할 때 `const`를 붙이면 초기화 이후 값을 변경할 수 없다.

```cpp
const double factor = 5.0 / 9.0;
const double offset = 32.0;
```

상수는 선언과 동시에 초기화해야 한다.

```cpp
const int maxStudents = 30;
```

값을 변경하려 하면 컴파일 오류가 발생한다.

```cpp
const int maxStudents = 30;
// maxStudents = 40; // 오류: const 변수는 변경할 수 없음
```

화씨 온도를 섭씨 온도로 바꾸는 예시:

```cpp
#include <iostream>

using namespace std;

int main() {
    const double factor = 5.0 / 9.0;
    const double offset = 32.0;

    double fahrenheit = 68.0;
    double celsius = (fahrenheit - offset) * factor;

    cout << celsius << '\n';
    return 0;
}
```

`const`를 사용하면 다음 장점이 있다.

- 변경하면 안 되는 값을 코드에 명확히 표시할 수 있다.
- 실수로 값을 변경하는 코드를 컴파일 단계에서 발견할 수 있다.
- 상수의 의미를 이름으로 표현하여 가독성을 높일 수 있다.
- 컴파일러의 최적화에 도움이 될 수 있다.

---

# 자주 하는 실수

## 함수 정의 전에 선언하지 않고 호출

```cpp
int main() {
    cout << add(2, 3); // add의 선언이 위에 없다면 오류
}
```

해결 방법: 함수 정의를 위로 옮기거나 함수 원형을 먼저 작성한다.

```cpp
int add(int a, int b);
```

## 반환형과 반환값이 맞지 않음

```cpp
int printMessage() {
    cout << "Hello\n";
    // int 반환형이지만 반환값이 없음
}
```

값을 반환하지 않는 함수라면 `void`를 사용한다.

```cpp
void printMessage() {
    cout << "Hello\n";
}
```

## 값 전달인데 원본이 바뀔 것으로 예상

```cpp
void change(int number) {
    number = 100;
}
```

일반 매개변수에는 값이 복사되므로 호출한 쪽의 원본 변수는 바뀌지 않는다.

## 재귀 함수에 기저 조건이 없음

```cpp
int countdown(int number) {
    return countdown(number - 1);
}
```

호출을 멈출 조건이 없으므로 정상적으로 종료할 수 없다.

## 블록 밖에서 지역 변수를 사용

```cpp
{
    int value = 10;
}

// cout << value; // 오류
```

## `const` 변수의 값을 변경

```cpp
const int limit = 100;
// limit = 200; // 오류
```

---

# 최종 정리

- 함수는 **반환형, 이름, 매개변수, 함수 본문**으로 구성된다.
- 호출 시 전달한 인수는 일반 매개변수에 복사되며, 이를 값에 의한 전달이라고 한다.
- `void`는 반환값이 없는 함수를 나타내고 `return`은 함수 실행을 종료한다.
- 함수 원형은 함수의 이름, 반환형, 매개변수 자료형을 컴파일러에 미리 알린다.
- 재귀 함수에는 반드시 기저 조건과 문제를 더 작게 만드는 재귀 단계가 있어야 한다.
- 스코프는 이름을 사용할 수 있는 범위이고, 저장 기간은 변수가 메모리에 존재하는 기간이다.
- `static` 지역 변수는 함수 호출이 끝나도 값을 유지한다.
- 표준 라이브러리는 헤더를 포함하여 사용하며 수학 함수에는 `<cmath>`를 사용한다.
- 네임스페이스는 같은 이름의 충돌을 방지하고 `std`는 표준 라이브러리의 네임스페이스이다.
- `const`는 초기화 후 변경할 수 없는 값을 선언할 때 사용한다.

