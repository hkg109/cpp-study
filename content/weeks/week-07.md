# 템플릿

정수 두 개를 교환하는 함수와 실수 두 개를 교환하는 함수는 자료형만 다르고 하는 일은 같습니다. 이번에는 그 공통 부분을 한 번 적고, 컴파일러가 사용할 자료형에 맞춰 함수를 만들도록 합니다.

## 수업 목표와 진행 순서

**먼저 알아둘 것:** [2주차 함수](/lectures/week-02), [3주차 참조](/lectures/week-03), [5주차 클래스](/lectures/week-05)입니다. 아래 스택의 빈 상태 처리는 [6주차 예외](/lectures/week-06)를 사용합니다.

- `T`가 바뀌어도 같은 일을 하는 함수 템플릿을 만듭니다.
- 자료형을 추론하는 호출과 직접 지정하는 호출을 구분합니다.
- `Box<int>`의 객체와 `Box<string>`의 객체를 읽고 사용합니다.

**권장 60분:** 함수 교환 예제 20분 → 자료형 추론 10분 → 클래스 템플릿 15분 → 특수화 5분 → 함께 풀기·확인 10분. 함수 선택의 세부 규칙, static, 고정 크기 스택과 템플릿 재귀는 보충입니다. 시험 대비 재귀는 별도 20분을 잡아 추적하세요.

> [!EXAMPLE]
> **발표 시작:** `swapValues(int&, int&)`의 int를 모두 double로 바꾸면 무엇이 달라지는지 물어보세요. 교환 순서는 그대로입니다. 두 버전에서 자료형 자리만 T로 바꿔 하나의 틀로 만드는 것이 출발점입니다. 전체 프로그램은 별도 실행하고, 함수·클래스 정의는 main 밖, 실행문은 main 안에 둡니다.

## 학습 흐름

```text
함수 템플릿 → 자료형 추론과 명시적 지정 → 일반 함수와의 우선순위
        ↓
클래스 템플릿 → 비자료형 매개변수 (int N)
        ↓
템플릿 특수화 template<> → 템플릿 재귀 Factorial<N>, Factorial<0>
```

> [!EXAM]
> 기말 족보에는 ① **원본 값을 바꾸는 함수 템플릿 `change` 작성**, ② **`Factorial<5>`의 출력과 `Factorial<0>`의 역할 설명**, ③ **템플릿 특수화**가 나옵니다.

| 기말 대비 수업 | 범위 | 2025 기말 | 2018~2023 기말 |
|---|---|---|---|
| 4회 · 템플릿 | 1~4절 전체 | 없음 | 문제 17~19 |

> [!TRAP]
> 2025 기말에 템플릿 문제가 없었다고 템플릿을 건너뛰면 안 됩니다. 2018~2023 기말에는 `change` 함수 템플릿, `Factorial<N>`, 템플릿 특수화가 꾸준히 나왔습니다.

---

## 1. 함수 템플릿

자료형만 다르고 코드가 같은 함수를 **하나의 틀**로 씁니다. 컴파일러가 호출할 때의 자료형으로 실제 함수를 **만들어 냅니다(인스턴스화)**.

```cpp
#include <iostream>
#include <string>
using namespace std;

template <typename T>          // typename 대신 class도 같은 뜻
void change(T& a, T& b) {      // 원본을 바꾸려면 참조 매개변수
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    int a = 1, b = 2;
    change(a, b);              // T = int
    cout << a << ' ' << b << '\n';

    double x = 1.5, y = 2.5;
    change(x, y);              // T = double
    cout << x << ' ' << y << '\n';

    string s = "hi", t = "yo";
    change(s, t);              // T = string
    cout << s << ' ' << t << '\n';
    return 0;
}
```

출력은 `2 1`, `2.5 1.5`, `yo hi` 세 줄입니다. T는 값을 담는 변수가 아니라 **자료형이 들어갈 자리**입니다. `change(a, b)`에서는 두 인수가 int여서 T를 int로 정하고, `change(x, y)`에서는 double로 정합니다. 실행 중 T에 숫자를 대입하는 것이 아닙니다.

| `change(a, b)`의 문장 | a | b | temp |
| --- | --- | --- | --- |
| 호출 직후 | 1 | 2 | 아직 없음 |
| `T temp = a;` | 1 | 2 | 1 |
| `a = b;` | 2 | 2 | 1 |
| `b = temp;` | 2 | 1 | 1 |

교환 순서는 3주차와 같습니다. 새로 배울 부분은 자료형 이름을 매개변수처럼 받는 `template <typename T>`입니다.

> [!TRAP]
> - 매개변수를 `T a, T b`(값)로 쓰면 **복사본만 바뀌어** 원본이 그대로입니다. 족보 문제의 "원본 값이 바뀌도록"은 `T&`를 쓰라는 뜻입니다.
> - `T&`로 받으면 리터럴은 넘길 수 없습니다: `change(1, 2)`는 컴파일 오류입니다.

### 자료형 추론과 명시적 지정

```cpp
template <typename T>
T maximum(T a, T b) { return a > b ? a : b; }
```

`조건 ? 참일 때 값 : 거짓일 때 값`은 조건 연산자입니다. 여기서는 a가 b보다 크면 a를, 아니면 b를 반환합니다. 익숙한 `if / else`로 같은 계산을 작성해도 됩니다.

| 호출 | T | 결과 |
|---|---|---|
| `maximum(3, 7)` | int | 7 |
| `maximum('a', 'b')` | char | b |
| `maximum(3, 4.5)` | int? double? | **컴파일 오류** (T 하나에 서로 다른 자료형) |
| `maximum<double>(3, 4.5)` | double (명시) | 4.5 |
| `maximum<int>(3, 4.9)` | int (명시) | **4** (4.9가 int로 잘림) |
| `maximum(string("apple"), string("banana"))` | string | banana (사전순) |

> [!TRAP]
> 위처럼 두 매개변수가 같은 T를 요구할 때 int와 double을 자동 산술 변환으로 하나의 T에 맞추지 않습니다. `maximum(3, 4.5)`와 `change(i, d)`는 서로 다른 T가 추론되어 오류입니다. 값을 받는 maximum은 `<double>`로 지정하면 변환할 수 있지만, 원본의 참조를 받는 change는 같은 방법으로 해결할 수 없습니다.

## 2. 클래스 템플릿

`Box<int>`는 int를 저장하는 자료형이고 `Box<string>`은 문자열을 저장하는 다른 자료형입니다. 클래스에서 멤버의 자료형을 T로 둔다는 점 외에는 5주차의 생성자·멤버 함수 규칙이 같습니다.

```cpp
template <typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
    void set(T v) { value = v; }
};

Box<int> bi(3);              // 자료형을 <>로 지정
Box<string> bs("cpp");

template <typename T1, typename T2>
class Pair {
public:
    T1 first;
    T2 second;
    Pair(T1 a, T2 b) : first(a), second(b) {}
};
Pair<string, int> p("age", 20);
```

- `Box<int>`와 `Box<double>`은 **서로 다른 클래스**입니다.
- 클래스 밖에서 멤버 함수를 정의할 때는 `template <typename T> T Box<T>::get() const { … }`처럼 다시 템플릿 머리를 씁니다.
- C++14까지는 `Box<int>`처럼 자료형을 반드시 써야 합니다. (C++17부터는 `Box b(3);`처럼 생략도 가능)

## 3. 템플릿 특수화

특정 자료형에 대해서만 **다른 구현**을 줄 때 `template <>`를 씁니다.

```cpp
template <typename T>
class Printer {
public:
    void print(T v) { cout << "value " << v << '\n'; }
};

template <>                     // bool일 때만 따로
class Printer<bool> {
public:
    void print(bool v) { cout << (v ? "yes" : "no") << '\n'; }
};

Printer<int>().print(5);        // value 5
Printer<bool>().print(true);    // yes
```

---

## 함께 풀기: 자료형만 바꿔 같은 코드 사용하기

1. 첫 전체 예제의 int 변수 두 개를 char 변수 `'A'`, `'B'`로 바꾸고 change를 호출하세요. 출력이 `B A`인지 확인합니다.
2. Box 예제에 `Box<int> first(3); Box<int> second(7);`을 만들고 `first.set(9);`를 실행합니다. first와 second를 출력하면 `9 7`이어야 합니다.
3. `Box<string>`으로 이름을 저장해 보세요. 멤버의 자료형이 달라져도 생성자·get·set 사용법은 같습니다.

> [!QUIZ]
> T는 실행 중 숫자를 넣는 변수인가요? `change(int변수, double변수)`에서 같은 T를 정할 수 있나요?

> [!ANSWER]
> T는 컴파일할 때 정하는 자료형 자리입니다. 이 함수는 두 인수가 같은 T의 참조여야 하므로 int와 double을 섞으면 추론이 실패합니다. 원본 교환이 목적이라 서로 다른 자료형을 억지로 변환해 호출하지 않습니다.

> [!QUIZ]
> `Box<int> first(3); Box<int> second(7);`에서 first.set(9)를 호출하면 second도 9가 되나요? `Box<string>`은 Box<int>와 같은 자료형인가요?

> [!ANSWER]
> second는 7을 유지합니다. 같은 자료형의 객체라도 상태는 따로입니다. Box<string>과 Box<int>는 같은 클래스 템플릿에서 만들어진 서로 다른 자료형입니다.

**발표자 마무리:** change를 다른 자료형에 적용하고 Box의 두 객체를 구분할 수 있으면 기본 목표를 달성한 것입니다. 다음 보충은 한 주제씩 골라 진행하세요.

## 보충: 함수 선택과 자료형별 static

### 보충: 일치 정도가 같으면 일반 함수 우선

```cpp
template <typename T> void show(T) { cout << "T "; }
void show(int) { cout << "int "; }

show(1);        // int  ← 정확히 맞는 일반 함수 우선
show(1.0);      // T
show('a');      // T    ← char는 템플릿이 정확히 맞음
show<int>(1);   // T    ← <>를 쓰면 템플릿을 강제
```

### 보충: 자료형마다 다른 함수가 만들어진다

```cpp
template <typename T>
int counter(T) { static int c = 0; return ++c; }

cout << counter(1) << counter(2) << counter(1.0) << counter('a') << counter(3);
// 출력: 12113
```

`counter<int>`, `counter<double>`, `counter<char>`는 **서로 다른 함수**이므로 static 변수도 각각 따로 있습니다. ([강의 6의 static 지역 변수](/lectures/week-06#static-지역-변수)가 자료형마다 하나씩 생긴다고 보면 됩니다.)

> [!QUIZ]
> 위 `maximum`, `show`, `counter`를 사용할 때 출력을 쓰고, 컴파일 오류인 줄을 고르시오.
>
> ```cpp
> cout << maximum(3, 7) << ' ' << maximum<int>(3, 4.9) << ' '
>      << maximum<double>(3, 4.5) << '\n';               // (1)
> cout << maximum(3, 4.5);                                 // (2)
> show(1); show(1.0); show<int>(1);                        // (3)
> cout << '\n' << counter(5) << counter(5.0) << counter(6);  // (4)
> ```

> [!ANSWER]
> (2)는 컴파일 오류입니다(T를 정할 수 없음). 나머지 출력:
>
> ```text
> 7 4 4.5
> int T T
> 112
> ```
>
> (4)는 왼쪽부터 `counter(5)` → `counter<int>`의 첫 호출 1, `counter(5.0)` → `counter<double>`의 첫 호출 1, `counter(6)` → 다시 `counter<int>`이므로 2입니다. 이 줄이 프로그램에서 `counter`를 처음 부른다고 가정합니다. (C++17부터 `cout << a << b`는 왼쪽부터 계산됩니다.)

---


## 보충: 고정 크기 스택

### 보충: 비자료형 매개변수

템플릿 매개변수로 **정수 상수**를 받을 수 있습니다. 컴파일할 때 정해지므로 배열 크기로도 쓸 수 있습니다.

```cpp
#include <stdexcept>

template <typename T, int N>
class Stack {
    static_assert(N > 0, "Stack capacity must be positive");
    T data[N]{};
    int top = 0;
public:
    bool push(T v) { if (top == N) return false; data[top++] = v; return true; }
    T pop() {
        if (top == 0) {
            throw std::out_of_range("Stack is empty");
        }
        return data[--top];
    }
    int size() const { return top; }
};

Stack<int, 3> st;
cout << st.push(1) << st.push(2) << st.push(3) << st.push(4);   // 1110
cout << ' ' << st.pop() << st.pop() << ' ' << st.size();        // 32 1
```

N은 실행 중 입력하는 개수가 아니라 컴파일할 때 정한 최대 용량입니다. `static_assert`는 양수 용량인지 컴파일할 때 검사합니다. push는 가득 찼으면 false를 반환하고, pop은 비었으면 예외를 던지므로 존재하지 않는 요소를 읽지 않습니다. 이 예제의 T는 int나 string처럼 기본 생성할 수 있는 자료형을 사용합니다.

---

## 보충: 템플릿 재귀와 시험 대비

이제부터는 함수 호출의 재귀와 **클래스 정의를 만드는 재귀**를 구분합니다. 기초 수업에서는 change와 Box를 직접 사용할 수 있으면 이 부분을 다음 시간에 진행해도 됩니다.

### 템플릿 재귀: Factorial

컴파일할 때 Factorial<5>부터 Factorial<0>까지 필요한 클래스들의 형태가 정해집니다. 아래 Value는 일반 멤버 함수이므로 값을 구하는 계산은 함수를 호출하는 흐름으로 읽습니다. 클래스 인스턴스화와 실행 중 함수 호출을 구분하세요.

아래 원문 형식은 long을 사용하므로 이 예제에서는 **0~12의 정수 N**으로 제한합니다. 자료형 범위를 넘지 않게 하며, 음수는 계산 대상이 아닙니다.

```cpp
template <long N>
class Factorial {
public:
    long Value(void) { return N * fn_1.Value(); }
private:
    Factorial<N - 1> fn_1;           // 한 단계 작은 클래스를 멤버로 가짐
};

template <>
class Factorial<0> {                 // 특수화 = 재귀의 기저 조건
public:
    long Value(void) { return 1; }
};

Factorial<5> f;
cout << f.Value();                   // 120
```

```text
Factorial<5> 안에 Factorial<4> 안에 … Factorial<1> 안에 Factorial<0>
Value: 5 × 4 × 3 × 2 × 1 × 1 = 120
```

> [!EXAM]
> **`Factorial<0>`의 역할**: 재귀 함수의 **기저 조건**과 같습니다. `Factorial<N>`이 `Factorial<N-1>`을 계속 요구하는데, `N = 0`에서 멈추게 하는 **특수화**입니다. 이것이 없으면 컴파일러가 `Factorial<-1>`, `Factorial<-2>`, …를 끝없이 만들려 해서 **컴파일 오류**(템플릿 인스턴스화 깊이 초과)가 납니다. 실행 중이 아니라 **컴파일 중에** 일어나는 문제입니다.

> [!QUIZ]
> 같은 방식으로 정의한 다음 템플릿의 값을 구하시오.
>
> ```cpp
> template <int N> struct Fib { static const int value = Fib<N - 1>::value + Fib<N - 2>::value; };
> template <> struct Fib<0> { static const int value = 0; };
> template <> struct Fib<1> { static const int value = 1; };
>
> template <int N> struct Pow2 { static const int value = 2 * Pow2<N - 1>::value; };
> template <> struct Pow2<0> { static const int value = 1; };
>
> cout << Fib<6>::value << ' ' << Fib<10>::value << ' ' << Pow2<10>::value;
> ```
>
> `Fib`에서 `Fib<1>` 특수화를 지우면 어떻게 되는가?

> [!ANSWER]
> `8 55 1024`
>
> `Fib<1>`이 없으면 `Fib<1>`이 일반 템플릿으로 만들어져 `Fib<0> + Fib<-1>`을 요구하고, `Fib<-1>`, `Fib<-2>`, …로 끝없이 내려가 **컴파일 오류**가 납니다. 두 칸 전을 쓰는 재귀는 기저 조건이 두 개 필요합니다.

---
