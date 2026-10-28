# 클래스와 객체지향 프로그래밍

## 학습 흐름

```text
클래스와 객체 → 접근 지정자 (public / protected / private)
        ↓
생성자 · 멤버 초기화 목록 · 소멸자 → 호출 순서
        ↓
복사 생성자와 얕은 / 깊은 복사 → const 멤버 함수
        ↓
상속 → 상속 종류별 접근 표 → 오버라이딩과 가리기
        ↓
virtual과 다형성 → 가상 소멸자 → 추상 클래스
```

> [!EXAM]
> 기말 족보의 클래스 문제는 세 가지입니다. ① **접근 가능 여부 O/X 표**, ② **virtual 유무에 따른 출력**, ③ **조건에 맞는 클래스 작성**(char 배열 멤버, getter/setter, 기본 생성자, protected 상속). 이 단원의 예제는 이 셋에 맞춰져 있습니다.

| 기말 대비 수업 | 범위 | 2025 기말 | 2018~2023 기말 |
|---|---|---|---|
| 2회 · 클래스 기본과 작성 문제 | 1~5절, 8절 | 문제 2 | 문제 1~6 |
| 3회 · 상속, virtual | 6~7절 | 문제 3 | 문제 7~9, 20 |

---

## 1. 클래스와 객체

```cpp
class Student {               // 설계도 (새 자료형)
public:
    int number;
    char name[20];

    void print() const {      // 멤버 함수(메서드)
        cout << number << ' ' << name << '\n';
    }
};                            // 세미콜론 필수

Student s;                    // 객체
s.number = 1;                 // 점 연산자로 멤버 접근
Student* p = &s;
p->print();                   // 포인터는 -> 사용 ((*p).print()와 같음)
```

- `class`의 기본 접근은 **private**, `struct`의 기본 접근은 **public**입니다.
- 멤버 함수는 같은 객체의 다른 멤버를 이름만으로 씁니다.

---

## 2. 접근 지정자

| 지정자 | 같은 클래스 멤버 함수 | 파생 클래스 멤버 함수 | 클래스 밖(`main` 등) |
|---|:---:|:---:|:---:|
| `public` | O | O | O |
| `protected` | O | O (조건 있음) | X |
| `private` | O | **X** | X |

### 다른 객체를 통한 접근 (O/X 표의 함정)

접근 권한은 **클래스 단위**입니다. 같은 클래스의 멤버 함수라면 **다른 객체의 private 멤버**에도 접근할 수 있습니다. 반면 `protected`는 파생 클래스에서 **자기 클래스(또는 그 파생) 객체를 통할 때만** 접근할 수 있습니다.

```cpp
class A {
public:    int x; A* pa;
protected: int y;
private:   int z;
};
class B : public A { public: A objA; };
class C : public B { public: C* pc; B objB; };
```

각 클래스의 **멤버 함수 안에서** 쓸 수 있는지:

| 표현 | in A | in B | in C | 이유 |
|---|:---:|:---:|:---:|---|
| `x` | O | O | O | public 상속된 public |
| `y` | O | O | O | 자기(상속받은) protected |
| `z` | O | X | X | private는 A만 |
| `objA.x` | X | O | O | A에는 `objA` 멤버가 없음 |
| `objA.y` | X | **X** | **X** | 다른 A 객체의 protected는 파생 클래스에서 불가 |
| `objA.z` | X | X | X | private |
| `pa->y` | O | **X** | **X** | A 안에서는 다른 A 객체의 protected·private도 OK |
| `pa->z` | **O** | X | X | 같은 클래스면 다른 객체의 private도 OK |
| `objB.y` | X | X | **X** | C 안이라도 B 객체를 통한 protected는 불가 |
| `pc->y` | X | X | **O** | C 안에서 C 객체를 통하면 가능 |
| `pc->z` | X | X | X | private |

> [!TRAP]
> - "멤버가 그 클래스에 **선언되어 있는가**"를 먼저 보세요. `objA`는 B의 멤버이므로 A의 멤버 함수에서는 쓸 수 없습니다(X).
> - 파생 클래스에서 `y`(자신이 물려받은 것)는 O지만, `objA.y`(별도 A 객체의 것)는 X입니다.

> [!EXAM]
> 2018~2023 기말 문제 1~3이 이 O/X 표 유형입니다. 칸마다 "① 그 클래스에 그 이름이 있는가 → ② 접근 지정자 → ③ 어떤 객체를 통해 접근하는가" 순서로 판단하세요.

> [!QUIZ]
> 위 A, B, C 정의에서 아래 표현을 각 클래스의 멤버 함수 안에서 쓸 수 있으면 O, 없으면 X를 쓰시오.
>
> | 표현 | in A | in B | in C |
> |---|:---:|:---:|:---:|
> | `y` |  |  |  |
> | `z` |  |  |  |
> | `objA.x` |  |  |  |
> | `objA.y` |  |  |  |
> | `pa->z` |  |  |  |
> | `objB.x` |  |  |  |
> | `pc->y` |  |  |  |

> [!ANSWER]
> | 표현 | in A | in B | in C |
> |---|:---:|:---:|:---:|
> | `y` | O | O | O |
> | `z` | O | X | X |
> | `objA.x` | X | O | O |
> | `objA.y` | X | X | X |
> | `pa->z` | O | X | X |
> | `objB.x` | X | X | O |
> | `pc->y` | X | X | O |
>
> 모든 칸은 컴파일러로 확인한 결과입니다.

---

## 3. 생성자와 소멸자

| | 생성자 | 소멸자 |
|---|---|---|
| 이름 | 클래스 이름 | `~클래스이름` |
| 반환형 | 없음 (`void`도 안 씀) | 없음 |
| 매개변수 | 가질 수 있음, 오버로딩 가능 | **없음**, 하나만 |
| 호출 시점 | 객체가 만들어질 때 자동 | 객체가 사라질 때 자동 |

### 기본 생성자 규칙

- 생성자를 **하나도 안 만들면** 컴파일러가 기본 생성자를 만들어 줍니다.
- 매개변수 있는 생성자를 **하나라도 만들면** 기본 생성자는 자동으로 생기지 않습니다. 그러면 `P a;`와 `P arr[3];`은 **컴파일 오류**입니다.

```cpp
class P {
    int x;
public:
    P(int v) : x(v) {}
};
P a;          // 컴파일 오류: P() 없음
P b(3);       // OK
```

`P a;`를 쓰려면 `P() : x(0) {}`를 따로 선언하거나 `P(int v = 0)`처럼 기본 인자를 줍니다.

### 멤버 초기화 목록

```cpp
class Player {
    string name;
    int hp;
    const int id;          // const 멤버와 참조 멤버는 초기화 목록에서만 초기화 가능
public:
    Player(string n, int h, int i) : name(n), hp(h), id(i) {}
};
```

> [!TRAP]
> 멤버는 초기화 목록에 **적힌 순서가 아니라 클래스에 선언된 순서**대로 초기화됩니다.

### 호출 순서 (시험 최빈출)

```text
생성: 기반 클래스 → 멤버 객체(선언 순서) → 자기 생성자 본문
소멸: 정확히 반대  (자기 소멸자 본문 → 멤버(선언 역순) → 기반)
```

- 지역 객체는 블록을 벗어날 때, **생성의 역순**으로 소멸합니다.
- `new`로 만든 객체는 `delete`할 때 소멸합니다. `delete`하지 않으면 소멸자가 불리지 않습니다.
- 전역 객체는 `main` 전에 생성되고 `main`이 끝난 뒤 소멸합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class Part {
>     string n;
> public:
>     Part(string s) : n(s) { cout << "P(" << n << ") "; }
>     ~Part() { cout << "~P(" << n << ") "; }
> };
> class Base {
> public:
>     Base() { cout << "B "; }
>     ~Base() { cout << "~B "; }
> };
> class Derived : public Base {
>     Part p1;
>     Part p2;
> public:
>     Derived() : p2("2"), p1("1") { cout << "D "; }
>     ~Derived() { cout << "~D "; }
> };
>
> int main() {
>     {
>         Derived d;
>         cout << "| ";
>     }
>     cout << "end";
> }
> ```

> [!ANSWER]
> ```text
> B P(1) P(2) D | ~D ~P(2) ~P(1) ~B end
> ```
>
> 기반(B) → 멤버 선언 순서(p1, p2) → 자기 본문(D). 초기화 목록에 `p2`를 먼저 적어도 선언 순서를 따릅니다. 소멸은 정확히 반대입니다.

> [!QUIZ]
> 다음 출력을 쓰시오. (`Trace`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다.)
>
> ```cpp
> Trace g("g");                      // 전역
>
> int main() {
>     cout << "main ";
>     Trace a("a");
>     Trace* p = new Trace("p");
>     {
>         Trace b("b");
>     }
>     delete p;
>     Trace c("c");
>     cout << "end ";
> }
> ```

> [!ANSWER]
> ```text
> g+ main a+ p+ b+ b- p- c+ end c- a- g-
> ```
>
> 전역 `g`는 `main` 전에 생성, 맨 마지막에 소멸합니다. `b`는 블록 끝에서, `p`는 `delete`할 때 소멸합니다. `main`이 끝나면 지역 객체가 생성 역순(c → a)으로 소멸합니다.

---

## 4. 복사 생성자와 얕은 / 깊은 복사

복사 생성자 `T(const T& other)`는 **새 객체를 기존 객체로 초기화할 때** 호출됩니다.

| 코드 | 호출되는 것 |
|---|---|
| `T b = a;` | 복사 생성자 (`=`가 있어도 **초기화**) |
| `T c(a);` | 복사 생성자 |
| `c = b;` (이미 있는 객체) | **대입 연산자** `operator=` |
| `void f(T t)`에 `f(a)` | 복사 생성자 (값 전달) |
| `void f(T& t)`에 `f(a)` | 아무것도 안 불림 (참조) |
| `catch (T e)` | 복사 생성자 |

> [!QUIZ]
> 생성자는 `D `, 복사 생성자는 `C `, 대입 연산자는 `A `를 출력한다. 출력을 쓰시오.
>
> ```cpp
> void byVal(T t) {}
> void byRef(T& t) {}
>
> T a;
> T b = a;
> T c(a);
> c = b;
> byVal(a);
> byRef(a);
> ```

> [!ANSWER]
> `D C C A C`
>
> `T b = a`는 대입이 아니라 복사 **초기화**입니다. `byRef`는 복사하지 않습니다.

### 얕은 복사의 문제

컴파일러가 만든 기본 복사 생성자는 멤버를 **그대로 복사**합니다. 멤버가 포인터면 **주소만** 복사되어 두 객체가 같은 메모리를 공유합니다(얕은 복사). 한쪽을 바꾸면 다른 쪽도 바뀌고, 둘 다 소멸자에서 `delete`하면 **이중 해제**가 됩니다.

```cpp
class Box {
public:
    int* v;
    Box(int x) { v = new int(x); }
    Box(const Box& o) { v = new int(*o.v); }   // 깊은 복사: 새 메모리에 값 복사
    ~Box() { delete v; }
};
```

> [!QUIZ]
> 복사 생성자를 직접 만들지 **않은** `Box`(소멸자도 없음)와 위의 깊은 복사 `Box`에서 각각 출력을 쓰시오.
>
> ```cpp
> Box a(1);
> Box b = a;
> *b.v = 5;
> cout << *a.v << ' ' << (a.v == b.v);
> ```

> [!ANSWER]
> - 기본(얕은) 복사: `5 1` — `a.v`와 `b.v`가 같은 주소입니다.
> - 깊은 복사: `1 0` — `b`는 자기 메모리를 따로 가집니다.

---

## 5. const 멤버 함수

멤버 함수 뒤의 `const`는 "이 함수는 객체를 바꾸지 않는다"는 약속입니다. **const 객체는 const 멤버 함수만** 호출할 수 있습니다.

```cpp
class Cnt {
    int v;
public:
    Cnt(int x = 0) : v(x) {}
    int get() const { return v; }   // OK: 읽기만
    void inc() { v++; }
};
const Cnt k(5);
k.get();      // OK
k.inc();      // 컴파일 오류
```

---

## 6. 상속

```cpp
class Animal {
protected:
    int id;
public:
    Animal() : id(0) { cout << "Animal() "; }
    ~Animal() { cout << "~Animal() "; }
    int getId() const { return id; }
    void setId(int v) { id = v; }
};

class Mouse : public Animal {         // public 상속
public:
    Mouse() { cout << "Mouse() "; }   // Animal()이 먼저 자동 호출
    ~Mouse() { cout << "~Mouse() "; }
    void print() const { cout << "id=" << id << ' '; }   // protected라서 접근 가능
};
```

`Mouse m; m.setId(7); m.print();` → `Animal() Mouse() id=7 ` 그리고 블록이 끝나면 `~Mouse() ~Animal()`.

기반 클래스에 기본 생성자가 없으면 파생 클래스 생성자의 초기화 목록에서 **직접 호출**해야 합니다: `Dog(string n) : Animal(n) {}`.

### 상속 종류별 접근 표

기반 클래스 멤버가 파생 클래스 안에서 **어떤 접근 수준이 되는지**:

| 기반 멤버 \ 상속 | `public` 상속 | `protected` 상속 | `private` 상속 |
|---|---|---|---|
| public | public | protected | private |
| protected | protected | protected | private |
| private | 접근 불가 | 접근 불가 | 접근 불가 |

결과 확인(`A`의 `x`: public, `y`: protected, `z`: private / `D : ? A` / `G : public D`):

| 상속 | D 안 `x`, `y` | D 안 `z` | `main`에서 `d.x` | G(손자) 안 `x`, `y` |
|---|:---:|:---:|:---:|:---:|
| public | O | X | **O** | O |
| protected | O | X | **X** | O |
| private | O | X | **X** | **X** |

> [!TRAP]
> - private 멤버는 어떤 상속에서도 파생 클래스가 **직접** 쓸 수 없습니다. 기반의 public getter/setter를 거쳐야 합니다.
> - `class D : A`처럼 상속 지정자를 생략하면 **private 상속**입니다(`struct`면 public).

---

## 7. 오버라이딩, 가리기, 가상 함수

| 용어 | 뜻 |
|---|---|
| 오버로딩 | **같은 범위**에서 이름이 같고 매개변수가 다른 함수 여러 개 |
| 오버라이딩 | 파생 클래스가 기반의 **virtual** 함수를 같은 형태로 다시 정의 |
| 가리기(hiding) | 파생 클래스에 같은 **이름**을 선언하면 기반의 같은 이름 함수가 **모두** 가려짐 |

```cpp
class H  { public: void f(); void f(int); };
class HD : public H { public: void f(int); };   // H의 f()와 f(int)를 모두 가림

HD d;
d.f(1);       // HD::f(int)
d.f();        // 컴파일 오류: H::f()가 가려짐
d.H::f();     // OK: 기반 이름을 직접 지정
```

### virtual: 포인터·참조로 부를 때 실제 객체의 함수

| 호출 방법 | virtual이 아닌 함수 | virtual 함수 |
|---|---|---|
| 객체로 직접 `obj.f()` | 객체의 자료형 | 객체의 자료형 |
| 기반 포인터 `p->f()` / 기반 참조 `r.f()` | **포인터·참조의 자료형**(정적 바인딩) | **실제 객체의 자료형**(동적 바인딩) |
| 기반 **값**으로 복사 `C1 s = obj;` | 기반 | **기반** (잘려서 기반 객체가 됨: 슬라이싱) |

> [!EXAM]
> virtual이 **기반 클래스에** 붙어 있어야 합니다. 기반에는 없고 파생 클래스에서만 `virtual`을 붙이면, **기반 포인터로 부를 때는 여전히 기반 함수**가 실행됩니다. 기반에서 한 번 virtual이면 파생에서 `virtual`을 생략해도 virtual입니다.

> [!EXAM]
> 2025 기말 문제 3과 2018~2023 기말 문제 7~9, 20이 virtual 출력 문제입니다. 호출마다 아래 칸을 채우면 모두 풀립니다.
>
> | 호출 | 포인터 타입 | 실제 객체 | virtual인가 |
> |---|---|---|---|
> | `p->f()` | | | |
>
> virtual이 아니면 **포인터 타입**, virtual이면 **실제 객체**의 함수가 호출됩니다. "virtual인가"는 **포인터 타입 클래스**에서 그 함수가 virtual인지로 판단합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class C1 {
> public:
>     void f() { cout << "C1f "; }
>     virtual void g() { cout << "C1g "; }
> };
> class C2 : public C1 {
> public:
>     void f() { cout << "C2f "; }
>     void g() override { cout << "C2g "; }
> };
>
> C2 obj;
> C1* p = &obj;
> C1& r = obj;
> C1 s = obj;
> p->f(); p->g(); r.f(); r.g(); s.g(); obj.f();
> ```

> [!ANSWER]
> ```text
> C1f C2g C1f C2g C1g C2f
> ```
>
> `f`는 virtual이 아니므로 포인터·참조의 자료형(C1)을 따릅니다. `g`는 virtual이라 실제 객체(C2)를 따릅니다. `s`는 C1 **값**으로 복사된 객체라서 C1의 `g`가 불립니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class car {
> public:
>     void showa() { cout << "baseA "; }
>     virtual void showb() { cout << "baseB "; }
> };
> class rcar : public car {
> public:
>     virtual void showa() { cout << "derA "; }
>     void showb() { cout << "derB "; }
> };
>
> car* p = new rcar;
> p->showa();
> p->showb();
> rcar* q = new rcar;
> q->showa();
> ```

> [!ANSWER]
> `baseA derB derA`
>
> | 호출 | 포인터 타입 | 실제 객체 | virtual인가 | 결과 |
> |---|---|---|---|---|
> | `p->showa()` | car | rcar | X (car에서 virtual 아님) | `baseA` |
> | `p->showb()` | car | rcar | O | `derB` |
> | `q->showa()` | rcar | rcar | — | `derA` |
>
> 파생에서 붙인 `virtual`은 기반 포인터로 부를 때 소용없습니다. `showb`는 기반에서 virtual이므로 파생에서 `virtual`을 안 써도 오버라이딩됩니다.

### 가상 소멸자

기반 포인터로 파생 객체를 `delete`하려면 기반 소멸자가 **virtual**이어야 합니다. 아니면 파생 소멸자가 불리지 않습니다(표준상 UB).

```cpp
NB* p = new ND; delete p;   // 소멸자가 virtual 아님 → 보통 "~NB"만 출력
VB* q = new VD; delete q;   // virtual ~VB() → "~VD ~VB"
```

### 추상 클래스

`virtual double area() const = 0;`처럼 `= 0`인 함수를 **순수 가상 함수**라 하고, 하나라도 있으면 **추상 클래스**입니다. 추상 클래스는 객체를 만들 수 없고(`Shape s;` 컴파일 오류), 포인터·참조로만 씁니다. 파생 클래스가 모두 구현해야 객체를 만들 수 있습니다.

---

## 8. 클래스 작성 문제 모범 답안 (족보형)

> [!EXAM]
> 2025 기말 문제 2와 2018~2023 기말 문제 4~6이 클래스 작성 문제입니다. 손으로 써 본 뒤 아래 체크리스트로 채점하세요.

> [!TRAP]
> 채점 체크리스트:
>
> - private 멤버는 `main`에서 직접 바꾸지 않고 setter로 설정했는가
> - 생성자 이름이 클래스와 같고 반환형이 없는가
> - `char title[50]`을 빈 문자열로 만들 때 `title[0] = '\0'`을 썼는가
> - 클래스 선언 끝에 `;`를 붙였는가

> [!QUIZ]
> 다음 조건을 만족하는 `Book` 클래스와 `main`을 작성하시오.
>
> 1. `public`인 `char title[50]`, `private`인 `float price`
> 2. `get_price()`, `set_price()`
> 3. 기본 생성자에서 `price = 0`, `title`은 빈 문자열
> 4. `title`과 `price`를 출력하는 멤버 함수
> 5. `main`에서 객체를 만들고 제목은 `"CPP"`, 가격은 10.0으로 설정해 출력

> [!ANSWER]
> ```cpp
> #include <iostream>
> #include <cstring>
> using namespace std;
>
> class Book {
> public:
>     char title[50];
>
>     Book() : price(0) { title[0] = '\0'; }     // 또는 strcpy(title, "");
>     float get_price() const { return price; }
>     void set_price(float p) { price = p; }
>     void print() const { cout << title << ' ' << price << '\n'; }
>
> private:
>     float price;
> };
>
> int main() {
>     Book b;
>     strcpy(b.title, "CPP");     // 배열은 = 로 대입 불가
>     b.set_price(10.0f);
>     b.print();                  // CPP 10
> }
> ```
>
> `b.price = 10;`은 private이라 컴파일 오류입니다. `float` 10.0은 `cout`에서 `10`으로 출력됩니다.

---

## 핵심 정리

1. `class` 기본 private, `struct` 기본 public.
2. private은 그 클래스만, protected는 파생 클래스도(단, 자기 클래스 객체를 통할 때만), public은 어디서나.
3. 같은 클래스의 멤버 함수는 다른 객체의 private에도 접근할 수 있다.
4. 생성자를 하나라도 만들면 기본 생성자는 자동으로 생기지 않는다.
5. 생성: 기반 → 멤버(선언 순서) → 자신. 소멸은 반대. 지역 객체는 생성 역순으로 소멸.
6. `T b = a;`는 복사 생성자, `c = b;`는 대입 연산자. 값 전달도 복사 생성자.
7. 포인터 멤버의 기본 복사는 얕은 복사다 → 깊은 복사 생성자 필요.
8. 상속: public → 그대로, protected → public이 protected로, private → 모두 private. 생략하면 private 상속.
9. 기반 포인터·참조로 부를 때 virtual이면 실제 객체, 아니면 포인터 자료형의 함수. virtual은 **기반에** 있어야 한다.
10. 다형적 기반 클래스의 소멸자는 virtual로. 순수 가상 함수가 있으면 추상 클래스.
