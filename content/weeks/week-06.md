# 클래스 고급 기능과 예외 처리

클래스를 한 파일에서 사용해 봤다면, 이제 선언과 구현을 나누고 실패를 호출자에게 전달해 봅니다. 특히 오류로 함수가 중간에 끝나도 지역 객체가 어떻게 정리되는지 확인합니다.

## 수업 목표와 진행 순서

**먼저 알아둘 것:** [5주차](/lectures/week-05)의 생성자·소멸자·`const` 멤버 함수와 [3주차](/lectures/week-03)의 참조입니다.

- 헤더·구현·사용 파일의 역할을 나누고 함께 빌드합니다.
- `throw → catch` 흐름에서 실행되는 줄과 건너뛰는 줄을 찾습니다.
- 예외 전파 중 소멸자가 실행되는 순서를 설명합니다.

**권장 70분:** `this` 복습 10분 → 파일 분리 15분 → 예외 처리·전파 20분 → 정리 순서 실습 20분 → 확인 5분. `static`, `friend`, 연산자 오버로딩은 독립된 보충 주제입니다.

> [!EXAMPLE]
> **발표 시작 질문:** 나눗셈 함수가 0으로 나누라는 요청을 받으면 어떤 숫자를 반환해야 할까요? 0도 정상적인 나눗셈 결과일 수 있습니다. 이번에는 결과와 실패 전달을 나누는 예외 방식을 배웁니다. 예제의 클래스들은 각각 별도 예제이며 하나의 파일에 모두 합치지 않습니다.

## 이번에 연결할 개념

~~~text
this 포인터로 현재 객체 구분
        ↓
선언과 구현을 파일로 분리
        ↓
예외를 던지고 처리
        ↓
예외 전파와 스택 풀기 이해
~~~

| 개념 | 핵심 역할 |
|---|---|
| static 멤버 | 모든 객체가 하나의 값을 공유 |
| friend | 지정한 함수나 클래스에 private 접근 권한 부여 |
| this 포인터 | 현재 메서드를 호출한 객체를 가리킴 |
| 파일 분리 | 클래스 선언과 구현, 사용 코드를 나눔 |
| 연산자 오버로딩 | 객체에 자연스러운 연산 문법 제공 |
| 예외 | 정상 흐름으로 처리하기 어려운 오류 전달 |
| 스택 풀기 | 예외가 처리 지점을 찾으며 지역 객체를 정리 |

---

## this 포인터

> [!DEFINITION]
> 일반 멤버 함수 안의 this는 현재 함수를 호출한 객체의 주소를 담고 있습니다.

~~~cpp
class Counter {
private:
    int value;

public:
    Counter(int value) {
        this->value = value;
    }

    Counter& add(int amount) {
        this->value += amount;
        return *this;
    }

    int getValue() const {
        return this->value;
    }
};
~~~

매개변수와 멤버의 이름이 같을 때 this 화살표로 멤버임을 분명히 할 수 있습니다. *this는 현재 객체 자체이므로 객체의 참조를 반환해 메서드 호출을 연결할 수도 있습니다.

`this->value`는 객체 안의 멤버이고 오른쪽 `value`는 매개변수입니다. `value = value;`만 쓰면 매개변수를 자기 자신에게 대입해서 멤버가 초기화되지 않습니다. 생성자에서는 5주차처럼 `Counter(int value) : value(value) {}`라는 초기화 목록도 사용할 수 있습니다.

~~~cpp
Counter counter(0);
counter.add(3).add(5);
~~~

처음 0 → 3을 더해 3 → 같은 객체를 반환 → 5를 더해 8이 됩니다. `Counter&`는 새 복사본이 아니라 현재 객체의 참조를 반환한다는 뜻입니다.

static 멤버 함수에는 현재 객체가 없으므로 this 포인터도 없습니다.

## 클래스 파일 분리

클래스가 커지면 선언, 구현, 사용 코드를 파일로 나누는 것이 좋습니다.

### Counter.h

~~~cpp
#ifndef COUNTER_H
#define COUNTER_H

class Counter {
private:
    int value;

public:
    Counter(int initialValue);
    void increase();
    int getValue() const;
};

#endif
~~~

### Counter.cpp

~~~cpp
#include "Counter.h"

Counter::Counter(int initialValue) : value(initialValue) {
}

void Counter::increase() {
    value++;
}

int Counter::getValue() const {
    return value;
}
~~~

### main.cpp

~~~cpp
#include <iostream>
#include "Counter.h"
using namespace std;

int main() {
    Counter counter(10);
    counter.increase();
    cout << counter.getValue() << '\n';
    return 0;
}
~~~

세 파일을 같은 폴더에 저장합니다. 헤더에는 클래스 선언을, cpp 파일에는 메서드 구현을 둡니다. 헤더 가드는 같은 번역 단위에서 클래스 정의가 중복 포함되는 것을 막습니다.

~~~sh
g++ -std=c++17 -Wall -Wextra main.cpp Counter.cpp -o counter
~~~

Windows PowerShell에서는 `./counter.exe`, macOS·Linux에서는 `./counter`를 실행합니다. 출력은 11입니다. **`#include "Counter.h"`만으로 Counter.cpp가 함께 빌드되지는 않습니다.** main.cpp만 빌드하면 선언은 알아도 구현을 찾지 못해 링크 오류가 날 수 있습니다. `Counter::increase`의 `::`는 이 함수가 Counter의 멤버임을 나타냅니다.

## 예외 처리

> [!DEFINITION]
> 예외는 함수가 정상적으로 결과를 만들 수 없는 상황을 호출자에게 전달하는 방법입니다.

~~~cpp
#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double left, double right) {
    if (right == 0) {
        throw invalid_argument("0으로 나눌 수 없습니다.");
    }
    return left / right;
}

int main() {
    try {
        cout << divide(10, 2) << '\n';
        cout << divide(10, 0) << '\n';
        cout << "This line is skipped\n";
    } catch (const invalid_argument& error) {
        cout << error.what() << '\n';
    }
    return 0;
}
~~~

throw는 예외를 발생시키고, try는 예외가 생길 수 있는 코드를 감쌉니다. catch는 자료형이 맞는 예외를 받아 처리합니다.

출력은 첫 줄 5, 다음 줄 `0으로 나눌 수 없습니다.`입니다. 실패한 호출은 값을 반환하지 않고 적절한 `catch`로 이동합니다. 그래서 `This line is skipped`는 출력되지 않습니다. 처리 후에는 `catch` 다음 문장으로 계속 진행할 수 있습니다.

표준 예외 객체에는 invalid_argument, out_of_range, runtime_error 등이 있습니다. 예외는 불필요한 복사를 피하고 다형성을 보존하기 위해 const 참조로 받는 것이 일반적입니다.

## 예외 전파

> [!DEFINITION]
> 현재 함수에서 예외를 처리하지 않으면 호출한 함수 쪽으로 전달됩니다.

~~~cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int readPositive() {
    int value = 0;
    if (!(cin >> value) || value <= 0) {
        throw invalid_argument("양수를 입력해야 합니다.");
    }
    return value;
}

void run() {
    cout << readPositive() << '\n';
}

int main() {
    try {
        run();
    } catch (const exception& error) {
        cout << error.what() << '\n';
    }
}
~~~

readPositive와 run에 catch가 없어도 main의 catch가 예외를 처리할 수 있습니다. 어느 곳에서도 처리하지 않으면 프로그램이 종료됩니다.

입력 3이면 3을 출력합니다. 입력 0, 음수 또는 숫자가 아닌 문자열이면 `readPositive → run → main의 catch` 순서로 실패가 전달됩니다. 예외를 처리한 뒤 실패한 입력문으로 저절로 돌아가 재시도하지는 않습니다.

## 스택 풀기

> [!DEFINITION]
> 예외가 전파될 때 실행을 끝내는 함수들의 지역 객체가 역순으로 소멸합니다. 이 과정을 스택 풀기라고 합니다.

~~~cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class Guard {
private:
    string name;

public:
    Guard(string name) : name(name) {
        cout << name << " 생성\n";
    }

    ~Guard() {
        cout << name << " 정리\n";
    }
};

void work() {
    Guard guard("work");
    throw runtime_error("작업 실패");
}

int main() {
    try {
        work();
    } catch (const exception& error) {
        cout << error.what() << '\n';
    }
    return 0;
}
~~~

work에서 예외가 발생해도 guard의 소멸자가 호출됩니다. 자원을 객체의 생성자에서 확보하고 소멸자에서 해제하면 정상 종료와 예외 발생 모두에서 안전하게 정리할 수 있습니다.

출력은 `work 생성 → work 정리 → 작업 실패` 순서입니다. catch에서 오류를 출력하기 **전에** work의 지역 객체가 정리됩니다. 이처럼 자원 정리를 객체 수명에 맡기는 방식을 **RAII**라고 합니다. `vector`와 `unique_ptr`가 같은 원리를 사용합니다. 원시 포인터 변수만 사라지는 것으로는 `new`로 할당한 대상이 자동 해제되지 않습니다.

소멸자에서는 예외를 밖으로 던지지 않는 것이 중요합니다. 이미 다른 예외로 스택을 푸는 중에 소멸자에서 새 예외가 나오면 프로그램이 즉시 종료될 수 있습니다.

## 함께 풀기: 정리 순서 예측하기

마지막 전체 예제의 `work`에서 `Guard guard("work");`를 두 줄 `Guard first("first"); Guard second("second");`로 바꿉니다. 나머지 코드는 유지합니다.

1. 실행 전에 생성·정리·오류 메시지의 순서를 적습니다.
2. 실행해서 아래 순서와 비교합니다.
3. `throw`를 주석 처리하고 정상 종료해도 지역 객체가 정리되는지 확인합니다.

~~~text
first 생성
second 생성
second 정리
first 정리
작업 실패
~~~

만들어진 객체가 역순으로 정리됩니다. 정상 종료에서도 second, first 순으로 정리되지만 예외가 없으므로 catch의 `작업 실패`는 출력되지 않습니다. 생성이 완료된 지역 객체가 정리 대상이라는 점도 기억하세요.

## 수업을 마치기 전 확인

> [!QUIZ]
> Counter.h를 include한 main.cpp만 빌드했더니 구현을 찾지 못했습니다. 무엇을 빌드에 추가해야 하나요?

> [!ANSWER]
> 메서드 정의가 있는 Counter.cpp도 함께 컴파일·링크해야 합니다. 헤더는 사용법을 알리고 cpp 파일은 실제 구현을 제공합니다. 예제 명령은 `g++ -std=c++17 main.cpp Counter.cpp -o counter`입니다.

> [!QUIZ]
> work에서 예외가 발생하면 catch의 오류 출력과 Guard의 정리 중 무엇이 먼저인가요? 실패한 나눗셈 다음 줄은 실행되나요?

> [!ANSWER]
> work에서 만들어진 Guard가 정리된 뒤 catch가 실행됩니다. 실패한 나눗셈 다음의 try 블록 문장은 건너뜁니다. catch 뒤에서는 계속 실행할 수 있지만 실패한 호출로 자동 복귀하지 않습니다.

**핵심:** 파일 분리는 선언과 구현을 연결하는 일이고, 예외 처리는 실패를 전달하고 정리한 뒤 처리하는 흐름입니다. [6주차 실습](/practice/week-06)에서는 이 두 흐름을 코드에서 찾아보세요. 이어서 [7주차 템플릿](/lectures/week-07)에서 자료형을 바꿔 재사용하는 코드를 배웁니다.

## 보충: 클래스 표현을 확장하는 도구

아래 세 주제는 각각 별도로 연습해도 됩니다. static은 클래스의 공유 정보, friend는 지정한 함수의 내부 접근, 연산자 오버로딩은 객체의 연산 표현을 다룹니다.

## static 멤버

> [!DEFINITION]
> 일반 데이터 멤버는 객체마다 따로 존재하지만 static 데이터 멤버는 클래스 전체가 하나를 공유합니다.

~~~cpp
#include <iostream>
using namespace std;

class Player {
private:
    int score;
    static int passingScore;

public:
    Player(int initialScore) : score(initialScore) {
    }

    bool passed() const {
        return score >= passingScore;
    }

    static int getPassingScore() {
        return passingScore;
    }
};

int Player::passingScore = 60;

int main() {
    Player first(50);
    Player second(80);
    cout << Player::getPassingScore() << '\n';
    cout << boolalpha << first.passed() << ' ' << second.passed() << '\n';
    return 0;
}
~~~

static 멤버 함수는 객체 없이 클래스 이름으로 호출할 수 있습니다. 객체가 없으므로 일반 데이터 멤버나 this 포인터를 직접 사용할 수 없습니다.

출력은 `60`과 `false true`입니다. 점수는 객체마다 50, 80으로 다르지만 합격 기준은 클래스에 하나입니다. 여기서 `int Player::passingScore = 60;`은 그 공유 변수의 정의입니다. 객체 개수나 복사 횟수를 세는 예제와 달리, 이 값은 객체가 사라져도 줄어들지 않습니다.

## friend

> [!DEFINITION]
> friend 함수나 friend 클래스는 지정한 클래스의 private와 protected 멤버에 접근할 수 있습니다.

~~~cpp
class Box {
private:
    int value;

public:
    Box(int value) : value(value) {
    }

    friend bool hasSameValue(const Box& left, const Box& right);
};

bool hasSameValue(const Box& left, const Box& right) {
    return left.value == right.value;
}
~~~

이 예제의 `hasSameValue`는 멤버 함수가 아니며 `hasSameValue(first, second)`처럼 호출합니다. `friend` 선언은 지정한 함수에 내부 접근을 허용할 뿐 멤버 함수로 만들지 않습니다. 꼭 필요한 함수에만 제한적으로 허용합니다.

## 연산자 오버로딩

> [!DEFINITION]
> 연산자 오버로딩은 객체끼리의 연산 의미를 정의하는 기능입니다.

~~~cpp
class Point {
private:
    int x;
    int y;

public:
    Point(int x, int y) : x(x), y(y) {
    }

    Point operator+(const Point& other) const {
        return Point(x + other.x, y + other.y);
    }

    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }

    int getX() const {
        return x;
    }

    int getY() const {
        return y;
    }
};
~~~

~~~cpp
Point first(1, 2);
Point second(3, 4);
Point sum = first + second;
~~~

연산자의 우선순위, 결합 방향, 피연산자 개수는 바꿀 수 없습니다. 객체에 자연스럽고 예상 가능한 의미가 있을 때만 오버로딩합니다.

### 출력 연산자

왼쪽 피연산자가 ostream이므로 보통 비멤버 friend 함수로 작성합니다.

아래 `Point`는 출력 연산자만 설명하기 위한 별도 클래스 정의입니다. 앞의 Point 정의와 같은 파일에 중복 선언하지 않습니다. 공개된 접근자로 값을 읽을 수 있다면 비멤버 출력 함수에 friend가 꼭 필요한 것은 아닙니다.

~~~cpp
#include <iostream>
using namespace std;

class Point {
private:
    int x;
    int y;

public:
    Point(int x, int y) : x(x), y(y) {
    }

    friend ostream& operator<<(ostream& out, const Point& point);
};

ostream& operator<<(ostream& out, const Point& point) {
    out << '(' << point.x << ", " << point.y << ')';
    return out;
}
~~~

ostream의 참조를 반환하면 cout << first << second처럼 출력을 이어갈 수 있습니다.


## 시험 대비 보충: 공유 상태와 예외 출력 추적

기본 수업 뒤 필요한 주제를 골라 연습합니다. 아래 클래스들은 본문과 다른 독립 예제입니다. `<iostream>`, `<string>`, `<stdexcept>`와 `using namespace std;`가 필요합니다. 각 문제에서 throw의 자료형, 건너뛰는 줄, 선택된 catch, 정리 순서를 따로 적으세요.

## 1. static 멤버

| | 일반 멤버 | static 멤버 |
|---|---|---|
| 데이터 | 객체마다 하나씩 | **클래스 전체에 하나** (모든 객체가 공유) |
| 정의 | 클래스 안 | 이 예제는 클래스 안에 선언 + **클래스 밖에 정의** `int Player::count = 0;` |
| 함수 호출 | `obj.f()` | `Player::f()` (객체 없이도 가능) |
| `this` | 있음 | **없음** → 일반 멤버를 직접 쓸 수 없음 |

```cpp
class Player {
    static int count;
public:
    Player()  { count++; }
    Player(const Player&) { count++; }
    ~Player() { count--; }
    static int getCount() { return count; }
};
int Player::count = 0;          // 빠뜨리면 링크 오류
```

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> cout << Player::getCount() << ' ';
> Player a;
> {
>     Player b, c;
>     cout << Player::getCount() << ' ';
> }
> cout << Player::getCount() << ' ';
> Player* p = new Player;
> cout << Player::getCount() << ' ';
> delete p;
> cout << Player::getCount();
> ```

> [!ANSWER]
> `0 3 1 2 1`
>
> 블록이 끝나면 `b`, `c`의 소멸자가 `count`를 줄입니다. `new`로 만든 객체도 생성자·소멸자에서 똑같이 세어집니다.

> [!TRAP]
> static 멤버 함수 안에서 일반 멤버 `v`를 쓰면 **컴파일 오류**입니다. 어느 객체의 `v`인지 알 수 없기 때문입니다(this가 없음).

### static 지역 변수

함수 안에서 `static`으로 선언한 지역 변수는 **해당 선언을 처음 실행할 때 한 번만 초기화**되고, 함수가 끝나도 사라지지 않아 다음 호출에서 이전 값을 이어서 씁니다. 일반 지역 변수는 호출마다 새로 만들어집니다.

| | 일반 지역 변수 | `static` 지역 변수 |
|---|---|---|
| 초기화 | 호출할 때마다 | **처음 한 번만** |
| 수명 | 함수가 끝나면 사라짐 | 프로그램이 끝날 때까지 |
| 이름을 쓸 수 있는 곳 | 그 함수 안 | 그 함수 안 (똑같음) |

> [!EXAM]
> 2025 기말 문제 1 b)의 `static int m`이 이 유형입니다. 호출마다 표에 `m`의 값을 이어서 적고, 일반 지역 변수는 매번 초기값부터 다시 시작하세요. `static int m = x;`처럼 매개변수로 초기화해도 **첫 호출의 값으로 한 번만** 초기화됩니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int f(int x) {
>     static int m = x;   // 처음 호출 때 한 번만 초기화
>     int k = x;          // 호출마다 새로 초기화
>     m += k;
>     return m;
> }
>
> int main() {
>     for (int i = 1; i <= 3; i++) cout << f(i) << ' ';
> }
> ```

> [!ANSWER]
> ```text
> 2 4 7
> ```
>
> | 호출 | `m` (호출 전) | `k` | `m` (반환) |
> |---|---:|---:|---:|
> | `f(1)` | 1 (첫 초기화) | 1 | 2 |
> | `f(2)` | 2 | 2 | 4 |
> | `f(3)` | 4 | 3 | 7 |
>
> 두 번째 호출부터 `static int m = x;` 줄은 초기화를 다시 하지 않습니다.

---

## 2. this 포인터

일반 멤버 함수 안의 `this`는 **함수를 호출한 객체의 주소**입니다. `*this`는 그 객체 자체입니다.

```cpp
class Counter {
    int v;
public:
    Counter(int v) { this->v = v; }                    // 매개변수와 멤버 이름 구분
    Counter& add(int a)    { v += a; return *this; }   // 참조 반환 → 같은 객체로 연결
    Counter addCopy(int a) { v += a; return *this; }   // 값 반환 → 복사본 반환
    int get() const { return v; }
};
```

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> Counter c(0);
> c.add(3).add(5);
> cout << c.get() << ' ';
> c.addCopy(1).addCopy(1);
> cout << c.get();
> ```

> [!ANSWER]
> `8 9`
>
> `add`는 `c` 자신을 참조로 반환하므로 두 번 모두 `c`에 더합니다. `addCopy`는 첫 호출에서 `c`를 9로 만들고 **복사본**을 반환하므로, 두 번째 `addCopy(1)`은 복사본에 더해져 `c`에는 반영되지 않습니다.

---

## 3. friend

`friend`로 지정한 함수(또는 클래스)는 그 클래스의 private·protected 멤버에 접근할 수 있습니다.

- friend 함수는 **멤버 함수가 아닙니다**. `this`가 없고, `obj.f()`가 아니라 `f(obj)`로 호출합니다.
- friend 관계는 **상속되지 않고**, **한쪽 방향**입니다(A가 B를 friend로 지정해도 B가 A를 지정한 것은 아님).

---

## 5. 연산자 오버로딩

```cpp
class Point {
    int x, y;
public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    Point operator+(const Point& o) const { return Point(x + o.x, y + o.y); }  // p + q
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }

    friend Point operator*(int k, const Point& p);                  // 2 * p
    friend ostream& operator<<(ostream& out, const Point& p);       // cout << p
};
Point operator*(int k, const Point& p) { return Point(k * p.x, k * p.y); }
ostream& operator<<(ostream& out, const Point& p) {
    out << '(' << p.x << ", " << p.y << ')';
    return out;                                     // 참조 반환 → cout << a << b 연결
}
```

| 연산 | 형태 | 이유 |
|---|---|---|
| `p + q` | 멤버 `p.operator+(q)` | 왼쪽이 Point |
| `2 * p` | **비멤버** `operator*(2, p)` | 왼쪽이 int라서 멤버로 만들 수 없음 |
| `cout << p` | **비멤버** (보통 friend) | 왼쪽이 `ostream` |

### 전위 ++와 후위 ++

```cpp
class Num {
    int v;
public:
    Num(int value) : v(value) {}
    int get() const { return v; }
    Num& operator++()    { ++v; return *this; }                     // 전위 ++n: 증가 후 자기 자신
    Num  operator++(int) { Num old = *this; ++v; return old; }  // 후위 구분용 int
};
```

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> Num n(5);
> Num a = n++;
> Num b = ++n;
> cout << a.get() << ' ' << b.get() << ' ' << n.get() << '\n';
>
> Point p(1, 2), q(3, 4);
> cout << p + q << ' ' << (p + q == Point(4, 6)) << ' ' << 2 * p;
> ```

> [!ANSWER]
> ```text
> 5 7 7
> (4, 6) 1 (2, 4)
> ```
>
> 후위는 증가 **전** 복사본(5)을, 전위는 증가 **후** 값(7)을 돌려줍니다.

> [!TRAP]
> 연산자 오버로딩으로 **우선순위, 결합 방향, 피연산자 개수는 바꿀 수 없습니다**. 새 연산자를 만들 수도 없고, `::`, `.`, `?:`, `sizeof`는 오버로딩할 수 없습니다.

---

## 6. 예외 처리의 기본

```cpp
try {
    // 예외가 날 수 있는 코드
    throw 값;              // 여기서 즉시 중단 → 맞는 catch로 점프
    // throw 아래 문장은 실행되지 않음
}
catch (int e)    { … }     // 위에서부터 차례로 자료형 검사
catch (double e) { … }
catch (...)      { … }     // 모든 예외 (반드시 마지막)
// catch가 처리하면 try-catch 전체의 "다음 문장"부터 계속
```

> [!EXAM]
> **catch 선택 규칙**
>
> 1. catch를 **위에서부터** 검사해 **처음 맞는 것 하나만** 실행합니다.
> 2. 여기서 다루는 기본 산술 자료형은 **같은 자료형이어야** 합니다. `int`↔`double`, `char`→`int`, `bool`→`int` 같은 **일반 변환은 일어나지 않습니다**.
> 3. 클래스 예외는 파생 클래스에서 기반 클래스의 처리기로 전달될 수 있습니다. 예를 들어 **기반 클래스 catch**(`catch (const exception& e)`)로 받을 수 있습니다.
> 4. `throw "K";`의 문자열 리터럴은 포인터로 변환되어 예외 객체의 자료형이 `const char*`가 됩니다. `char`, `int`로는 받지 못합니다.
> 5. 이 함수에 맞는 catch가 없으면 함수를 즉시 빠져나가 **호출한 곳의 try**에서 다시 찾습니다(전파). 끝까지 없으면 프로그램이 종료됩니다(`terminate`).

### 처리 후 어디로 가는가

- catch 블록이 끝나면 그 **try-catch 다음 문장**으로 갑니다. throw 지점으로 돌아가지 않습니다.
- catch 안에서 `throw;`(재던지기)를 하면 **같은 예외를 그대로** 바깥(호출한 쪽)으로 다시 던집니다. 같은 try의 다른 catch로 가지 않습니다.

> [!EXAM]
> 예외 출력 문제는 코드에 화살표를 그리며 풉니다.
>
> ```text
> throw가 일어난 줄 → 그 줄 아래에서 건너뛰는 출력 → 받는 catch → catch 다음 실행 위치
> ```
>
> 2025 기말 문제 4, 5와 2018~2023 기말 문제 10~16이 모두 이 순서로 풀립니다.

> [!QUIZ]
> 아래 `fun`에서 `throw` 줄의 값만 바꿔 실행한다. ① `(double)5.0`, ② `3`, ③ `'c'`, ④ `true`, ⑤ `"K"`일 때 각각 전체 출력을 쓰시오. (출력은 한 줄로 쓴다.)
>
> ```cpp
> void fun() {
>     try {
>         cout << "FA ";
>         throw /* 값 */;
>         cout << "BA ";
>     }
>     catch (int i)  { cout << "FCA " << i << ' '; }
>     catch (char c) { cout << "FCB " << c << ' '; throw; }
>     cout << "BC ";
> }
>
> int main() {
>     try {
>         cout << "A ";
>         fun();
>         cout << "B ";
>     }
>     catch (int i)    { cout << "C " << i << ' '; }
>     catch (double d) { cout << "D " << d << ' '; }
>     catch (...)      { cout << "E "; }
>     cout << "F";
> }
> ```

> [!ANSWER]
> | throw 값 | 출력 | 흐름 |
> |---|---|---|
> | ① `5.0` (double) | `A FA D 5 F` | fun에 double catch 없음 → 전파(BC, B 건너뜀) → main의 double |
> | ② `3` (int) | `A FA FCA 3 BC B F` | fun에서 처리 → fun의 다음 문장 BC → 정상 반환 → B |
> | ③ `'c'` (char) | `A FA FCB c E F` | fun의 char가 받고 `throw;`로 char를 다시 던짐 → main에 char catch 없음 → `...` |
> | ④ `true` (bool) | `A FA E F` | bool은 int로 바뀌지 않음 → 전파 → `...` |
> | ⑤ `"K"` | `A FA E F` | `const char*` → 맞는 catch 없음 → `...` |
>
> 모든 경우 BA는 출력되지 않습니다(throw 아래). 재던지기된 char는 main의 `catch (int)`로도 바뀌지 않습니다.

> [!TRAP]
> catch는 위에서부터 차례로 비교하며 `int`를 `double`로 바꾸는 **산술 변환을 하지 않습니다.** 2025 기말 문제 4에서 다시 던진 `int` 예외가 `catch (double j)`를 지나 `catch (...)`로 가는 이유입니다. 아래 문제가 같은 구조입니다.

> [!QUIZ]
> 다음 출력을 쓰고, `throw;` 이후 예외가 전달되는 경로를 설명하시오.
>
> ```cpp
> void fun() {
>     try {
>         cout << "fun pos A\n";
>         throw (int)4;
>         cout << "fun pos B\n";
>     }
>     catch (int i) {
>         cout << "in catch CA with i:" << i << "\n";
>         throw;
>     }
>     cout << "fun pos C\n";
> }
>
> int main() {
>     try {
>         cout << "main pos A\n";
>         fun();
>         throw (double)2.0;
>         cout << "main pos B\n";
>     }
>     catch (double j) { cout << "in catch CB with j:" << j << "\n"; }
>     catch (...)      { cout << "in catch CC\n"; }
>     cout << "main pos C\n";
> }
> ```

> [!ANSWER]
> ```text
> main pos A
> fun pos A
> in catch CA with i:4
> in catch CC
> main pos C
> ```
>
> `throw;`가 int 4를 main으로 다시 던집니다. 그래서 `fun()` 다음 줄의 `throw (double)2.0`은 **실행되지 않습니다**. main에는 int catch가 없으므로 `catch (...)`가 받고, 처리 후 `main pos C`로 갑니다.

---

## 7. try와 catch의 문법 규칙

| 규칙 | 어기면 |
|---|---|
| try 블록 **바로 뒤**에 catch가 와야 함 (사이에 일반 문장 불가) | 컴파일 오류 |
| `catch (...)`는 **마지막** catch여야 함 | 컴파일 오류 |
| 기반 클래스 catch를 파생 클래스 catch보다 **앞에** 두면 파생 catch에 도달할 수 없음 | 컴파일은 됨(경고) |
| catch를 **값**으로 받으면 예외 객체가 **복사**됨 (복사 생성자 호출, 슬라이싱) | 보통 `const 참조`로 받음 |

> [!QUIZ]
> 1. "try 블록과 바로 뒤의 catch 블록 사이에는 일반 실행문을 넣을 수 없다." 참인가 거짓인가?
> 2. `MyErr`가 `runtime_error`의 파생 클래스일 때 출력을 쓰시오.
>
> ```cpp
> class MyErr : public runtime_error {
> public:
>     MyErr(const string& message) : runtime_error(message) {}
> };
>
> try { throw MyErr("boom"); }
> catch (const runtime_error& e) { cout << "RE:" << e.what() << ' '; }
> catch (const exception& e)     { cout << "EX "; }
>
> try { throw MyErr("boom"); }
> catch (const exception& e)     { cout << "EX:" << e.what() << ' '; }
> catch (const runtime_error& e) { cout << "RE "; }
> ```

> [!ANSWER]
> **1.** 참. try 블록 바로 뒤에는 catch가 와야 하며, 사이에 문장을 넣으면 컴파일 오류입니다.
>
> **2.** `RE:boom EX:boom`. 위에서부터 **처음 맞는** catch 하나만 실행됩니다. 두 번째 try에서는 `exception&`이 먼저 받으므로 아래 `runtime_error&`는 실행될 수 없습니다.

---

## 8. 예외 전파와 스택 풀기

예외가 함수를 빠져나갈 때마다 그 함수의 **지역 객체가 생성 역순으로 소멸**합니다(스택 풀기). try 블록 안의 지역 객체도 **catch가 실행되기 전에** 소멸합니다.

> [!QUIZ]
> `G`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다. 출력을 쓰시오.
>
> ```cpp
> class G {
>     string name;
> public:
>     G(string n) : name(n) { cout << name << "+ "; }
>     ~G() { cout << name << "- "; }
> };
>
> void inner() { G g("in");  throw 1; cout << "X"; }
> void outer() { G g("out"); inner(); cout << "Y"; }
>
> int main() {
>     try {
>         G g("main");
>         outer();
>     }
>     catch (int e) { cout << "catch" << e << ' '; }
>     cout << "end";
> }
> ```

> [!ANSWER]
> ```text
> main+ out+ in+ in- out- main- catch1 end
> ```
>
> `X`, `Y`는 실행되지 않습니다. `in`, `out`, `main` 객체가 차례로 소멸한 **뒤에** catch가 실행됩니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class Exception {
> public:
>     int code;
>     Exception(int i) { code = i; }
> };
>
> void foo() {
>     try { throw Exception(1); }
>     catch (Exception e) { cout << e.code; }
> }
> int main() { foo(); }
> ```

> [!ANSWER]
> `1`
>
> 클래스 객체도 던질 수 있습니다. `catch (Exception e)`는 값으로 받으므로 예외 객체가 복사되지만 `code`는 그대로 1입니다.

---

## 9. 표준 예외

`#include <stdexcept>`의 예외는 모두 `exception`을 상속하고, `what()`으로 메시지를 얻습니다.

| 예외 | 대표 상황 |
|---|---|
| `invalid_argument` | 잘못된 인수 |
| `out_of_range` | `vector::at()`의 범위 초과 |
| `runtime_error` | 실행 중 일반 오류 |

```cpp
int safeDiv(int a, int b) {
    if (b == 0) throw invalid_argument("div by zero");
    return a / b;
}
for (int b : {2, 0}) {
    try { cout << safeDiv(10, b) << ' '; }
    catch (const invalid_argument& e) { cout << e.what() << ' '; }
}
// 출력: 5 div by zero
```

---
