# 템플릿

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
template <typename T>          // typename 대신 class도 같은 뜻
void change(T& a, T& b) {      // 원본을 바꾸려면 참조 매개변수
    T temp = a;
    a = b;
    b = temp;
}

int a = 1, b = 2;
change(a, b);                  // T = int
double x = 1.5, y = 2.5;
change(x, y);                  // T = double
string s = "hi", t = "yo";
change(s, t);                  // T = string
```

> [!TRAP]
> - 매개변수를 `T a, T b`(값)로 쓰면 **복사본만 바뀌어** 원본이 그대로입니다. 족보 문제의 "원본 값이 바뀌도록"은 `T&`를 쓰라는 뜻입니다.
> - `T&`로 받으면 리터럴은 넘길 수 없습니다: `change(1, 2)`는 컴파일 오류입니다.

### 자료형 추론과 명시적 지정

```cpp
template <typename T>
T maximum(T a, T b) { return a > b ? a : b; }
```

| 호출 | T | 결과 |
|---|---|---|
| `maximum(3, 7)` | int | 7 |
| `maximum('a', 'b')` | char | b |
| `maximum(3, 4.5)` | int? double? | **컴파일 오류** (T 하나에 서로 다른 자료형) |
| `maximum<double>(3, 4.5)` | double (명시) | 4.5 |
| `maximum<int>(3, 4.9)` | int (명시) | **4** (4.9가 int로 잘림) |
| `maximum(string("apple"), string("banana"))` | string | banana (사전순) |

> [!TRAP]
> 템플릿 자료형 추론은 **변환을 하지 않습니다**. `int`와 `double`을 섞으면 T를 정할 수 없어 오류입니다. `change(i, d)`(int와 double)도 마찬가지입니다.

### 일반 함수가 있으면 일반 함수가 먼저

```cpp
template <typename T> void show(T) { cout << "T "; }
void show(int) { cout << "int "; }

show(1);        // int  ← 정확히 맞는 일반 함수 우선
show(1.0);      // T
show('a');      // T    ← char는 템플릿이 정확히 맞음
show<int>(1);   // T    ← <>를 쓰면 템플릿을 강제
```

### 자료형마다 다른 함수가 만들어진다

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

## 2. 클래스 템플릿

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

### 비자료형 매개변수

템플릿 매개변수로 **정수 상수**를 받을 수 있습니다. 컴파일할 때 정해지므로 배열 크기로도 쓸 수 있습니다.

```cpp
template <typename T, int N>
class Stack {
    T data[N];
    int top = 0;
public:
    bool push(T v) { if (top == N) return false; data[top++] = v; return true; }
    T pop() { return data[--top]; }
    int size() const { return top; }
};

Stack<int, 3> st;
cout << st.push(1) << st.push(2) << st.push(3) << st.push(4);   // 1110
cout << ' ' << st.pop() << st.pop() << ' ' << st.size();        // 32 1
```

---

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

## 4. 템플릿 재귀: Factorial

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

## 핵심 정리

1. 함수 템플릿은 호출한 자료형마다 별도의 함수가 만들어진다(static 변수도 따로).
2. 원본을 바꾸는 템플릿은 `T&` 매개변수. 리터럴은 넘길 수 없다.
3. 자료형 추론은 변환하지 않는다. 서로 다른 자료형을 섞으면 `<double>`처럼 명시한다.
4. 정확히 맞는 일반 함수가 템플릿보다 우선한다. `f<int>()`는 템플릿을 강제한다.
5. 클래스 템플릿은 `Box<int>`처럼 자료형을 지정한다. `int N` 같은 상수 매개변수도 가능하다.
6. `template <>` 특수화로 특정 자료형만 다르게 구현한다.
7. `Factorial<0>`은 템플릿 재귀의 기저 조건이다. 없으면 컴파일 오류(인스턴스화 깊이 초과).
