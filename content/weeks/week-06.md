# 클래스 고급 기능과 예외 처리

## 전체 학습 흐름

~~~text
static 멤버로 클래스 전체의 정보 공유
        ↓
friend로 제한적인 내부 접근 허용
        ↓
this 포인터로 현재 객체 구분
        ↓
선언과 구현을 파일로 분리
        ↓
연산자 오버로딩으로 객체 표현식 설계
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

## static 멤버

일반 데이터 멤버는 객체마다 따로 존재하지만 static 데이터 멤버는 클래스 전체가 하나를 공유합니다.

~~~cpp
#include <iostream>
using namespace std;

class Player {
private:
    static int count;

public:
    Player() {
        count++;
    }

    ~Player() {
        count--;
    }

    static int getCount() {
        return count;
    }
};

int Player::count = 0;

int main() {
    Player first;
    Player second;
    cout << Player::getCount() << '\n';
    return 0;
}
~~~

static 멤버 함수는 객체 없이 클래스 이름으로 호출할 수 있습니다. 객체가 없으므로 일반 데이터 멤버나 this 포인터를 직접 사용할 수 없습니다.

## friend

friend 함수나 friend 클래스는 지정한 클래스의 private와 protected 멤버에 접근할 수 있습니다.

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

friend는 멤버 함수가 아니며 객체를 통해 호출하지 않습니다. 캡슐화의 경계를 넓히므로 꼭 필요한 함수에만 제한적으로 사용합니다.

## this 포인터

일반 멤버 함수 안의 this는 현재 함수를 호출한 객체의 주소를 담고 있습니다.

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

~~~cpp
Counter counter(0);
counter.add(3).add(5);
~~~

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

헤더에는 클래스의 공개 형태를, cpp 파일에는 메서드 구현을 둡니다. 헤더 가드는 같은 선언이 여러 번 포함되는 것을 막습니다.

## 연산자 오버로딩

연산자 오버로딩은 객체끼리의 연산 의미를 정의하는 기능입니다.

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

## 예외 처리

예외는 함수가 정상적으로 결과를 만들 수 없는 상황을 호출자에게 전달하는 방법입니다.

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
        cout << divide(10, 0) << '\n';
    } catch (const invalid_argument& error) {
        cout << error.what() << '\n';
    }
    return 0;
}
~~~

throw는 예외를 발생시키고, try는 예외가 생길 수 있는 코드를 감쌉니다. catch는 자료형이 맞는 예외를 받아 처리합니다.

표준 예외 객체에는 invalid_argument, out_of_range, runtime_error 등이 있습니다. 예외는 불필요한 복사를 피하고 다형성을 보존하기 위해 const 참조로 받는 것이 일반적입니다.

## 예외 전파

현재 함수에서 예외를 처리하지 않으면 호출한 함수 쪽으로 전달됩니다.

~~~cpp
int readPositive() {
    int value;
    cin >> value;
    if (value <= 0) {
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

## 스택 풀기

예외가 전파될 때 실행을 끝내는 함수들의 지역 객체가 역순으로 소멸합니다. 이 과정을 스택 풀기라고 합니다.

~~~cpp
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
~~~

work에서 예외가 발생해도 guard의 소멸자가 호출됩니다. 자원을 객체의 생성자에서 확보하고 소멸자에서 해제하면 정상 종료와 예외 발생 모두에서 안전하게 정리할 수 있습니다.

소멸자에서는 예외를 밖으로 던지지 않는 것이 중요합니다. 이미 다른 예외로 스택을 푸는 중에 소멸자에서 새 예외가 나오면 프로그램이 즉시 종료될 수 있습니다.

## 핵심 정리

- static 멤버는 객체가 아니라 클래스 전체에 속합니다.
- friend와 this는 클래스 내부 접근을 정교하게 다룰 때 사용합니다.
- 헤더와 구현 파일을 분리하면 클래스의 사용법과 구현을 나눌 수 있습니다.
- 연산자 오버로딩은 객체에 자연스러운 표현식을 제공합니다.
- 예외는 throw, try, catch로 전달하고 처리합니다.
- 스택 풀기 중 지역 객체의 소멸자가 호출되므로 자원을 객체 수명에 맡기는 설계가 안전합니다.
