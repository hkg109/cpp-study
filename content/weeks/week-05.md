# 클래스와 객체지향 프로그래밍

지금까지는 점수 목록과 처리 함수를 따로 만들었습니다. 이제 데이터와 그 데이터를 다루는 함수를 하나로 묶습니다. ‘점수는 0~100’ 같은 규칙을 객체가 스스로 지키게 만드는 것이 출발점입니다.

## 수업 목표와 진행 순서

**먼저 알아둘 것:** 함수, 참조, 포인터입니다. [4주차](/lectures/week-04)의 ‘객체의 수명이 끝난 뒤 주소를 쓰면 안 된다’를 떠올리세요.

- 클래스라는 자료형과 그 자료형으로 만든 객체를 구분합니다.
- 생성자로 초기 상태를 만들고 공개 메서드로 상태를 바꿉니다.
- 상속, 가상 함수, 오버라이딩을 실제 호출 결과로 구분합니다.

**권장 70분:** 클래스·객체 15분 → 생성자·소멸자 10분 → 캡슐화 실습 20분 → 상속·가상 함수 20분 → 확인 5분. 시간이 짧으면 캡슐화까지 한 번, 상속 이후를 다음 시간에 진행하세요. 추상 클래스는 보충입니다.

> [!EXAMPLE]
> **발표 시작 질문:** 점수 변수에 150을 넣지 못하게 하려면 어디에서 막아야 할까요? 먼저 자유롭게 수정하는 객체를 보여 주고, 값을 바꾸는 입구를 메서드로 제한해 봅니다. 예제마다 클래스 정의가 다르므로 전체 프로그램은 각각 별도 파일로 실행합니다.

## 이번에 연결할 개념

~~~text
클래스로 새로운 자료형 설계
        ↓
객체마다 속성과 상태 저장
        ↓
메서드로 객체의 행동 정의
        ↓
생성자와 소멸자로 생명 주기 관리
        ↓
캡슐화로 올바른 사용 방법 강제
        ↓
상속과 오버라이딩으로 기능 확장
        ↓
가상 함수로 다형성 구현
~~~

| 개념 | 핵심 역할 |
|---|---|
| 클래스 | 데이터와 기능을 하나의 자료형으로 묶음 |
| 객체 | 클래스를 바탕으로 만들어진 실제 값 |
| 캡슐화 | 내부 상태를 보호하고 공개된 기능으로만 접근 |
| 생성자 | 객체가 만들어질 때 초기 상태를 설정 |
| 소멸자 | 객체가 사라질 때 정리 작업을 수행 |
| 상속 | 기존 클래스의 특성을 물려받아 확장 |
| 다형성 | 같은 호출이 실제 객체에 따라 다르게 동작 |

---

## 클래스와 객체

> [!DEFINITION]
> 클래스는 관련 있는 데이터와 함수를 하나로 묶어 만든 사용자 정의 자료형입니다. 클래스로 선언한 실제 변수를 객체라고 합니다.

~~~cpp
#include <iostream>
#include <string>
using namespace std;

class Student {
public:
    string name;
    int score;

    void introduce() {
        cout << name << ": " << score << '\n';
    }
};

int main() {
    Student first;
    first.name = "Jisuk";
    first.score = 95;
    first.introduce();
    return 0;
}
~~~

Student는 설계도이고 first는 그 설계도로 만든 객체입니다. 점 연산자를 사용하면 객체의 멤버에 접근할 수 있습니다.

클래스 정의의 마지막 `};`에는 세미콜론이 필요합니다. `first.introduce()`는 **first 객체의 데이터로** 함수를 실행한다는 뜻입니다. `Student`를 정의하기만 해서는 자기소개가 출력되지 않습니다.

## 속성과 메서드

> [!DEFINITION]
> 클래스 안의 변수는 속성 또는 데이터 멤버라고 부릅니다. 클래스 안의 함수는 메서드 또는 멤버 함수라고 부릅니다.

~~~cpp
class Rectangle {
public:
    int width;
    int height;

    int area() {
        return width * height;
    }

    bool isSquare() {
        return width == height;
    }
};
~~~

메서드는 자신을 호출한 객체의 속성을 바로 사용할 수 있습니다.

~~~cpp
Rectangle shape;
shape.width = 5;
shape.height = 3;
cout << shape.area() << '\n';
~~~

객체마다 속성은 따로 저장됩니다. 한 객체의 width를 바꿔도 다른 객체의 width는 바뀌지 않습니다.

예를 들어 `Rectangle first{5, 3}; Rectangle second{2, 2};`를 만든 뒤 `first.width = 10;`으로 바꿔도 `second.width`는 2입니다. `first.area()`는 30, `second.area()`는 4가 됩니다. **자료형은 같아도 상태는 객체마다 따로**입니다.

## 생성자와 소멸자

> [!DEFINITION]
> 생성자는 객체가 만들어질 때 자동으로 호출됩니다. 클래스 이름과 같고 반환 자료형을 쓰지 않습니다.

~~~cpp
class Player {
private:
    string name;
    int health;

public:
    Player(string playerName, int initialHealth)
        : name(playerName), health(initialHealth) {
    }

    void show() const {
        cout << name << ' ' << health << '\n';
    }
};
~~~

콜론 뒤의 멤버 초기화 목록은 멤버가 생성되는 순간 값을 설정합니다.

`name(playerName)`은 멤버 `name`의 초기값을 매개변수 `playerName`으로 정한다는 뜻입니다. 생성자에는 `void`도 붙이지 않습니다. 생성자는 반환값을 받아 쓰는 일반 함수와 달리 객체의 시작 상태를 준비합니다.

~~~cpp
Player player("Knight", 100);
~~~

### 생성자 오버로딩

매개변수 구성이 다르면 생성자를 여러 개 만들 수 있습니다.

~~~cpp
class Point {
private:
    int x;
    int y;

public:
    Point() : x(0), y(0) {
    }

    Point(int xValue, int yValue) : x(xValue), y(yValue) {
    }
};
~~~

### 소멸자

> [!DEFINITION]
> 소멸자는 객체의 수명이 끝날 때 자동으로 호출됩니다. 클래스 이름 앞에 물결표를 붙이고 매개변수와 반환값을 사용하지 않습니다.

~~~cpp
class Trace {
public:
    Trace() {
        cout << "객체 생성\n";
    }

    ~Trace() {
        cout << "객체 소멸\n";
    }
};
~~~

지역 객체는 자신이 선언된 블록을 벗어날 때 소멸합니다. 직접 관리하는 동적 메모리나 파일 같은 자원이 있다면 소멸자에서 정리할 수 있습니다.

~~~cpp
int main() {
    cout << "Before\n";
    {
        Trace object;
        cout << "Inside\n";
    }
    cout << "After\n";
}
~~~

출력 순서는 `Before → 객체 생성 → Inside → 객체 소멸 → After`입니다. 지역 객체에는 직접 소멸자를 호출하지 않습니다. `string`과 `vector` 멤버도 자기 소멸자가 자동으로 정리하므로 모든 클래스에 별도 정리 코드를 쓸 필요는 없습니다.

## 캡슐화

> [!DEFINITION]
> 캡슐화는 객체의 내부 상태를 숨기고, 클래스가 허용한 방법으로만 값을 읽거나 바꾸게 만드는 원칙입니다.

~~~cpp
class Score {
private:
    int value;

public:
    Score(int initialValue) : value(0) {
        setValue(initialValue);
    }

    bool setValue(int newValue) {
        if (newValue < 0 || newValue > 100) {
            return false;
        }
        value = newValue;
        return true;
    }

    int getValue() const {
        return value;
    }
};
~~~

private 멤버는 클래스 밖에서 직접 접근할 수 없습니다. public 메서드가 잘못된 값을 차단하므로 객체가 항상 유효한 상태를 유지하기 쉬워집니다.

위 생성자는 먼저 0으로 초기화한 뒤 같은 검사 함수를 사용합니다. 초기값이 범위 밖이면 0을 유지하도록 정한 예제입니다. `private` 자체가 0~100을 검사하는 것은 아닙니다. **값을 검사하는 `setValue`와 직접 접근을 막는 `private`가 함께** 규칙을 지킵니다.

~~~cpp
Score score(80);
cout << boolalpha << score.setValue(95) << '\n';  // true
cout << score.setValue(150) << '\n';             // false
cout << score.getValue() << '\n';                // 95
// score.value = 150;  // 컴파일 오류: private 멤버
~~~

| 호출 | 결과 | 저장된 점수 |
| --- | --- | --- |
| `Score score(80)` | 초기 상태 설정 | 80 |
| `setValue(95)` | 허용, true 반환 | 95 |
| `setValue(150)` | 거부, false 반환 | 이전 값 95 유지 |

### const 멤버 함수

객체의 상태를 바꾸지 않는 메서드 뒤에는 const를 붙일 수 있습니다.

~~~cpp
int getValue() const {
    return value;
}
~~~

const 객체는 const 멤버 함수만 호출할 수 있습니다.

## 함께 풀기: 잘못된 점수에서 상태 지키기

위 `Score` 클래스 위에 `#include <iostream>`과 `using namespace std;`를 두고, 아래 `main`을 붙여 하나의 프로그램으로 실행하세요.

~~~cpp
int main() {
    Score first(80);
    Score second(40);
    first.setValue(95);
    bool accepted = first.setValue(150);
    cout << boolalpha << accepted << '\n';
    cout << first.getValue() << ' ' << second.getValue() << '\n';
    return 0;
}
~~~

출력은 `false`와 `95 40`입니다. first의 잘못된 수정이 거절되고 second의 상태도 그대로입니다. 초기값을 -1로 주면 이 예제의 규칙에 따라 0으로 시작합니다. 0과 100은 허용되고 -1과 101은 거절되는지도 확인해 보세요.

**여기서 잠깐:** 클래스 이름·객체 두 개·생성자·읽는 메서드·바꾸는 메서드를 각각 짚을 수 있으면 상속으로 넘어갑니다. 상태를 보호하는 클래스를 만드는 데 상속이 꼭 필요한 것은 아닙니다.

## 상속

> [!DEFINITION]
> 상속은 기존 클래스의 멤버를 바탕으로 새로운 클래스를 만드는 기능입니다.

~~~cpp
class Animal {
protected:
    string name;

public:
    Animal(string name) : name(name) {
    }

    void eat() const {
        cout << name << " eats\n";
    }
};

class Dog : public Animal {
public:
    Dog(string name) : Animal(name) {
    }

    void wagTail() const {
        cout << name << " wags its tail\n";
    }
};
~~~

Animal은 기반 클래스, Dog는 파생 클래스입니다. public 상속에서는 기반 클래스의 public 기능이 파생 클래스에서도 public으로 유지됩니다.

`Dog`는 `Animal`의 한 종류라는 관계입니다. `Dog dog("Coco"); dog.eat(); dog.wagTail();`를 실행하면 물려받은 기능과 새 기능을 모두 사용할 수 있습니다. `protected`는 클래스 내부와 파생 클래스에서 접근할 수 있고, 기반 클래스의 `private` 멤버를 파생 클래스가 직접 읽을 수는 없습니다.

생성할 때는 기반 클래스 생성자가 먼저 호출되고 파생 클래스 생성자가 나중에 호출됩니다. 소멸할 때는 반대 순서입니다.

## 오버라이딩

> [!DEFINITION]
> 오버라이딩은 파생 클래스가 기반 클래스의 **가상 함수**를 같은 호출 형태에 맞춰 다시 구현하는 것입니다. `override`를 붙여 의도와 실제 선언이 맞는지 컴파일러에게 검사받습니다.

~~~cpp
class Animal {
public:
    virtual void speak() const {
        cout << "Animal sound\n";
    }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() const override {
        cout << "Woof\n";
    }
};
~~~

여기서는 `Animal& animal = dog; animal.speak();`로 호출해도 Dog의 `Woof`가 출력됩니다. 기반의 `virtual`이 실제 객체에 맞는 함수를 고르게 합니다. 비가상 함수를 파생 클래스에서 같은 이름으로 선언하는 것은 이와 같은 오버라이딩이 아니라 이름을 가리는 동작이므로 구분하세요.

## 다형성과 가상 함수

> [!DEFINITION]
> 다형성은 하나의 기반 클래스 인터페이스로 여러 파생 객체를 다루면서 각 객체에 맞는 동작을 실행하는 성질입니다.

~~~cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Animal {
public:
    virtual void speak() const {
        cout << "Animal sound\n";
    }

    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() const override {
        cout << "Woof\n";
    }
};

class Cat : public Animal {
public:
    void speak() const override {
        cout << "Meow\n";
    }
};

int main() {
    Dog dog;
    Cat cat;
    vector<Animal*> animals = {&dog, &cat};

    for (Animal* animal : animals) {
        animal->speak();
    }
    return 0;
}
~~~

virtual이 붙은 함수를 기반 클래스 포인터나 참조로 호출하면 실제 객체의 오버라이딩 함수가 선택됩니다. override는 오버라이딩 의도를 컴파일러가 검사하게 합니다.

출력은 순서대로 `Woof`, `Meow`입니다. `animals`에는 객체 복사본이 아니라 기존 `dog`, `cat`의 주소가 들어 있습니다. `animal->speak()`는 `(*animal).speak()`와 같은 호출 방식입니다. 두 객체가 살아 있는 동안만 주소를 사용하고, 이 주소에 `delete`를 호출하지 않습니다.

다형적으로 사용할 기반 클래스의 소멸자는 virtual로 선언해야 기반 클래스 포인터로 파생 객체를 삭제할 때 전체 소멸 과정이 실행됩니다.

## 핵심 정리

- 클래스는 속성과 메서드를 묶어 새로운 자료형을 만듭니다.
- private와 public을 구분하면 객체의 상태를 안전하게 보호할 수 있습니다.
- 생성자와 소멸자는 객체의 시작과 끝을 관리합니다.
- 상속은 기존 클래스의 기능을 재사용하고 확장합니다.
- virtual과 override를 사용하면 기반 클래스 인터페이스로 다형성을 구현할 수 있습니다.

## 수업을 마치기 전 확인

> [!QUIZ]
> `private: int value;`만 두면 점수가 자동으로 0~100으로 제한되나요? 생성자는 언제 호출되나요?

> [!ANSWER]
> 아닙니다. private는 밖에서 직접 접근하는 것을 막을 뿐입니다. 생성자와 수정 메서드가 유효한 값을 유지해야 합니다. 생성자는 객체를 만들 때 자동으로 호출되어 초기 상태를 준비합니다.

> [!QUIZ]
> 기반 클래스의 가상 함수 `speak() const`를 바꾸려는데 파생 클래스에 `speak()`로 쓰고 override를 붙이면 왜 오류가 나나요?

> [!ANSWER]
> 뒤의 const까지 호출 형태에 맞아야 오버라이딩하기 때문입니다. override가 이 실수를 찾아줍니다. 매개변수만 다른 같은 이름의 함수는 오버로딩이며, 가상 함수를 바꾸는 오버라이딩과 구분합니다.

**발표자 마무리:** 객체별 상태, 유효한 초기화, 가상 함수 호출을 설명할 수 있으면 [6주차](/lectures/week-06)에서 파일 분리와 예외 처리를 연결합니다.

## 보충: 공통 인터페이스만 정하기

아래는 여러 도형에 같은 area 호출 규칙을 주는 방법입니다. 첫 클래스 수업에서는 객체를 직접 만들 수 있는 클래스부터 충분히 연습하세요.

## 추상 클래스

> [!DEFINITION]
> 구현 없이 규칙만 제공할 함수는 순수 가상 함수로 선언할 수 있습니다.

~~~cpp
class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};
~~~

구현되지 않은 순수 가상 함수가 남아 있는 클래스는 직접 객체를 만들 수 없는 추상 클래스입니다. 파생 클래스의 객체를 만들려면 남아 있는 순수 가상 함수를 모두 구현해야 합니다. 예를 들어 구체적인 사각형 클래스가 `area()`를 구현하도록 사용 규칙을 정하는 것입니다.


## 시험 대비 보충: 접근 권한, 복사, 호출 순서

최신 기말 대비 노트의 추가 연습입니다. 기본 클래스 수업을 마친 뒤 접근 표 → 생성·복사 → 상속 호출 → 클래스 작성 순서로 나누어 진행하세요. 문제마다 독립된 예제이며 `<iostream>`, `<string>`, `<cstring>`과 `using namespace std;`를 사용합니다. char 배열을 쓰는 Book 문제도 보존했습니다.

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
> 접근 가능 여부는 선언 위치·접근 지정자·접근하는 객체의 자료형 순서로 판단합니다.

---

## 보충: 생성자 규칙과 객체 생성 순서

### 기본 생성자 규칙

- 생성자를 **하나도 안 만들면** 컴파일러가 기본 생성자를 만들어 줍니다.
- 사용자가 생성자를 **하나라도 선언하면** 기본 생성자는 자동으로 생기지 않습니다. 그러면 `P a;`와 `P arr[3];`은 **컴파일 오류**입니다.

```cpp
class P {
    int x;
public:
    P(int v) : x(v) {}
};
P a;          // 컴파일 오류: P() 없음
P b(3);       // OK
```

이 예제처럼 P(int)에 기본 인수가 없을 때 `P a;`를 쓰려면 `P() : x(0) {}`를 따로 선언하거나 `P(int v = 0)`처럼 기본 인자를 줍니다.

### 멤버 초기화 목록

```cpp
class Player {
    string name;
    int hp;
    const int id;          // 생성 시 초기화 필요. 멤버 초기화 목록 사용
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
> class Trace {
>     string name;
> public:
>     Trace(string n) : name(n) { cout << name << "+ "; }
>     ~Trace() { cout << name << "- "; }
> };
>
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

이 Box는 복사 생성자·대입 연산자·소멸자를 함께 정의합니다. 대입은 이미 가진 저장 공간에 값을 복사하므로 자기 자신을 대입해도 안전합니다. 실제 값 저장에는 string과 vector처럼 소유권을 관리하는 멤버를 우선 사용합니다.

컴파일러가 만든 기본 복사 생성자는 멤버를 **그대로 복사**합니다. 멤버가 포인터면 **주소만** 복사되어 두 객체가 같은 메모리를 공유합니다(얕은 복사). 한쪽을 바꾸면 다른 쪽도 바뀌고, 둘 다 소멸자에서 `delete`하면 **이중 해제**가 됩니다.

```cpp
class Box {
public:
    int* v;
    Box(int x) { v = new int(x); }
    Box(const Box& o) { v = new int(*o.v); }   // 깊은 복사: 새 메모리에 값 복사
    Box& operator=(const Box& o) { *v = *o.v; return *this; }
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
>
> 얕은 복사 실험은 공유한 메모리를 `delete a.v;`로 한 번만 해제합니다. 깊은 복사 예제는 각 객체의 소멸자가 정리하므로 직접 해제하지 않습니다.

---

## 보충: 상속 종류별 접근

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
> rcar first;
> car* p = &first;
> p->showa();
> p->showb();
> rcar second;
> rcar* q = &second;
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
