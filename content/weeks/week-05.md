# 클래스와 객체지향 프로그래밍

## 전체 학습 흐름

~~~text
클래스로 새로운 자료형 설계
        ↓
객체마다 속성과 상태 저장
        ↓
메서드로 객체의 행동 정의
        ↓
캡슐화로 올바른 사용 방법 강제
        ↓
생성자와 소멸자로 생명 주기 관리
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

클래스는 관련 있는 데이터와 함수를 하나로 묶어 만든 사용자 정의 자료형입니다. 클래스로 선언한 실제 변수를 객체라고 합니다.

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

## 속성과 메서드

클래스 안의 변수는 속성 또는 데이터 멤버라고 부릅니다. 클래스 안의 함수는 메서드 또는 멤버 함수라고 부릅니다.

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

## 캡슐화

캡슐화는 객체의 내부 상태를 숨기고, 클래스가 허용한 방법으로만 값을 읽거나 바꾸게 만드는 원칙입니다.

~~~cpp
class BankAccount {
private:
    int balance;

public:
    BankAccount(int initialBalance) : balance(initialBalance) {
    }

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    bool withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    int getBalance() const {
        return balance;
    }
};
~~~

private 멤버는 클래스 밖에서 직접 접근할 수 없습니다. public 메서드가 잘못된 값을 차단하므로 객체가 항상 유효한 상태를 유지하기 쉬워집니다.

### const 멤버 함수

객체의 상태를 바꾸지 않는 메서드 뒤에는 const를 붙일 수 있습니다.

~~~cpp
int getBalance() const {
    return balance;
}
~~~

const 객체는 const 멤버 함수만 호출할 수 있습니다.

## 생성자와 소멸자

생성자는 객체가 만들어질 때 자동으로 호출됩니다. 클래스 이름과 같고 반환 자료형을 쓰지 않습니다.

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

소멸자는 객체의 수명이 끝날 때 자동으로 호출됩니다. 클래스 이름 앞에 물결표를 붙이고 매개변수와 반환값을 사용하지 않습니다.

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

## 상속

상속은 기존 클래스의 멤버를 바탕으로 새로운 클래스를 만드는 기능입니다.

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

생성할 때는 기반 클래스 생성자가 먼저 호출되고 파생 클래스 생성자가 나중에 호출됩니다. 소멸할 때는 반대 순서입니다.

## 오버라이딩

파생 클래스가 기반 클래스와 같은 형태의 메서드를 다시 정의하는 것을 오버라이딩이라고 합니다.

~~~cpp
class Animal {
public:
    void speak() const {
        cout << "Animal sound\n";
    }
};

class Dog : public Animal {
public:
    void speak() const {
        cout << "Woof\n";
    }
};
~~~

Dog 객체에서 speak를 호출하면 Dog의 메서드가 실행됩니다. 하지만 기반 클래스 포인터를 사용한 호출까지 실제 객체에 맞게 바꾸려면 가상 함수가 필요합니다.

## 다형성과 가상 함수

다형성은 하나의 기반 클래스 인터페이스로 여러 파생 객체를 다루면서 각 객체에 맞는 동작을 실행하는 성질입니다.

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

다형적으로 사용할 기반 클래스의 소멸자는 virtual로 선언해야 기반 클래스 포인터로 파생 객체를 삭제할 때 전체 소멸 과정이 실행됩니다.

## 추상 클래스

구현 없이 규칙만 제공할 함수는 순수 가상 함수로 선언할 수 있습니다.

~~~cpp
class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};
~~~

순수 가상 함수가 하나라도 있는 클래스는 직접 객체를 만들 수 없는 추상 클래스가 됩니다. 파생 클래스는 해당 함수를 구현해야 합니다.

## 핵심 정리

- 클래스는 속성과 메서드를 묶어 새로운 자료형을 만듭니다.
- private와 public을 구분하면 객체의 상태를 안전하게 보호할 수 있습니다.
- 생성자와 소멸자는 객체의 시작과 끝을 관리합니다.
- 상속은 기존 클래스의 기능을 재사용하고 확장합니다.
- virtual과 override를 사용하면 기반 클래스 인터페이스로 다형성을 구현할 수 있습니다.
