# 클래스 고급 기능과 예외 처리

## 학습 흐름

```text
static 멤버 (클래스가 공유) · static 지역 변수 → this 포인터와 *this 반환
        ↓
friend → 파일 분리 → 연산자 오버로딩 (멤버 / 비멤버, 전위 / 후위 ++)
        ↓
try / throw / catch → catch 선택 규칙 → 재던지기 throw;
        ↓
예외 전파와 스택 풀기 → 표준 예외
```

> [!EXAM]
> 기말 족보에서 예외 문제가 **가장 많습니다**. 같은 코드에 `throw`하는 값의 자료형만 바꿔(`double`, `int`, `char`, `bool`, `"K"`) 출력을 묻습니다. **catch는 자료형이 정확히 맞아야 받는다**는 규칙 하나로 모두 풀립니다.

| 기말 대비 수업 | 범위 | 2025 기말 | 2018~2023 기말 |
|---|---|---|---|
| 3회 · static, this, friend, 연산자 | 1~5절 | 문제 1 b) | — |
| 4회 · 예외 처리 | 6~9절 | 문제 4, 5 | 문제 10~16 |

---

## 1. static 멤버

| | 일반 멤버 | static 멤버 |
|---|---|---|
| 데이터 | 객체마다 하나씩 | **클래스 전체에 하나** (모든 객체가 공유) |
| 정의 | 클래스 안 | 클래스 안에 선언 + **클래스 밖에 정의** `int Player::count = 0;` |
| 함수 호출 | `obj.f()` | `Player::f()` (객체 없이도 가능) |
| `this` | 있음 | **없음** → 일반 멤버를 직접 쓸 수 없음 |

```cpp
class Player {
    static int count;
public:
    Player()  { count++; }
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

함수 안에서 `static`으로 선언한 지역 변수는 **처음 실행될 때 한 번만 초기화**되고, 함수가 끝나도 사라지지 않아 다음 호출에서 이전 값을 이어서 씁니다. 일반 지역 변수는 호출마다 새로 만들어집니다.

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

## 4. 클래스 파일 분리

```cpp
// Counter.h — 선언
#ifndef COUNTER_H          // 헤더 가드: 여러 번 포함되는 것을 막음
#define COUNTER_H
class Counter {
    int value;
public:
    Counter(int initial);
    void increase();
    int getValue() const;
};
#endif

// Counter.cpp — 구현 (클래스이름:: 으로 소속 표시)
#include "Counter.h"
Counter::Counter(int initial) : value(initial) {}
void Counter::increase() { value++; }
int Counter::getValue() const { return value; }
```

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
Num& operator++()    { ++v; return *this; }                     // 전위 ++n: 증가 후 자기 자신
Num  operator++(int) { Num old = *this; ++v; return old; }      // 후위 n++: int는 구분용 더미
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
> 2. 자료형이 **정확히 같아야** 합니다. `int`↔`double`, `char`→`int`, `bool`→`int` 같은 **일반 변환은 일어나지 않습니다**.
> 3. 예외: 파생 클래스 예외는 **기반 클래스 catch**(`catch (const exception& e)`)로 받을 수 있습니다.
> 4. `"K"` 같은 문자열 리터럴은 `const char*` 자료형입니다. `char`, `int`로는 받지 못합니다.
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

## 핵심 정리

1. static 데이터 멤버는 클래스에 하나이고 클래스 밖에서 정의한다. static 함수에는 this가 없다.
2. static 지역 변수는 처음 한 번만 초기화되고, 호출이 끝나도 값이 남는다.
3. `*this`를 **참조로** 반환해야 같은 객체에 연결 호출이 된다. 값으로 반환하면 복사본이다.
4. friend는 멤버가 아니며 상속되지 않는다.
5. 왼쪽 피연산자가 내 클래스가 아니면(`2 * p`, `cout << p`) 비멤버로 오버로딩한다. 후위 ++는 `operator++(int)`.
6. catch는 위에서부터 **처음 맞는 하나**만, 자료형이 정확히 같아야 한다(파생→기반만 허용). `"K"`는 `const char*`.
7. 처리 후에는 try-catch 다음 문장으로 간다. `throw;`는 같은 예외를 호출한 쪽으로 다시 던진다.
8. 맞는 catch가 없으면 호출한 쪽으로 전파되고, 빠져나가는 함수의 지역 객체는 역순으로 소멸한다.
9. try와 catch 사이에는 문장을 넣을 수 없고, `catch (...)`는 마지막에 둔다.
