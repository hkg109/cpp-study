---
title: 클래스 고급 기능과 예외 처리 실습
description: ''
week: 6
order: 1
published: true
---

6주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 객체 수 세기

**난이도:** 중하

### 요구사항

- 생성된 객체 수를 공유하는 static 멤버를 작성합니다.
- 생성자에서 수를 늘리고 소멸자에서 줄입니다.
- static 메서드로 현재 객체 수를 확인합니다.

### 입력

별도의 입력은 없습니다.

### 출력

각 블록에서 살아 있는 객체 수를 출력합니다.

### 출력 예시

~~~text
1
3
1
~~~

<Answer>

~~~cpp title="object_counter.cpp" showLineNumbers
#include <iostream>
using namespace std;

class Counter {
private:
    static int count;

public:
    Counter() {
        count++;
    }

    ~Counter() {
        count--;
    }

    static int getCount() {
        return count;
    }
};

int Counter::count = 0;

int main() {
    Counter first;
    cout << Counter::getCount() << '\n';
    {
        Counter second;
        Counter third;
        cout << Counter::getCount() << '\n';
    }
    cout << Counter::getCount() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q2. 연결 가능한 문자열

**난이도:** 중

### 요구사항

- Text 클래스에 문자열을 저장합니다.
- append 메서드가 *this의 참조를 반환하게 작성합니다.
- 여러 append 호출을 연결한 결과를 출력합니다.

### 입력

공백 없는 문자열 세 개가 주어집니다.

### 출력

세 문자열을 하이픈으로 연결하여 출력합니다.

### 입력 예시

~~~text
C plus plus
~~~

### 출력 예시

~~~text
C-plus-plus
~~~

<Answer>

~~~cpp title="chainable_text.cpp" showLineNumbers
#include <iostream>
#include <string>
using namespace std;

class Text {
private:
    string value;

public:
    Text(string value) : value(value) {
    }

    Text& append(const string& part) {
        value += part;
        return *this;
    }

    string getValue() const {
        return value;
    }
};

int main() {
    string first;
    string second;
    string third;
    cin >> first >> second >> third;

    Text text(first);
    text.append("-").append(second).append("-").append(third);
    cout << text.getValue() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q3. 분수 연산자 오버로딩

**난이도:** 중상

### 요구사항

- Fraction 클래스에 분자와 분모를 저장합니다.
- 덧셈 연산자와 동등 비교 연산자를 오버로딩합니다.
- 출력 연산자는 friend 함수로 작성합니다.
- 결과 분수는 최대공약수로 약분합니다.

### 입력

두 분수의 분자와 분모가 주어집니다.

### 출력

두 분수의 합을 기약분수 형태로 출력합니다.

### 입력 예시

~~~text
1 3
1 6
~~~

### 출력 예시

~~~text
1/2
~~~

<Answer>

~~~cpp title="fraction_operators.cpp" showLineNumbers
#include <iostream>
using namespace std;

int gcd(int left, int right) {
    while (right != 0) {
        int remainder = left % right;
        left = right;
        right = remainder;
    }
    return left;
}

class Fraction {
private:
    int numerator;
    int denominator;

    void reduce() {
        int divisor = gcd(numerator < 0 ? -numerator : numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;
    }

public:
    Fraction(int numerator, int denominator)
        : numerator(numerator), denominator(denominator) {
        reduce();
    }

    Fraction operator+(const Fraction& other) const {
        return Fraction(
            numerator * other.denominator + other.numerator * denominator,
            denominator * other.denominator
        );
    }

    bool operator==(const Fraction& other) const {
        return numerator == other.numerator && denominator == other.denominator;
    }

    friend ostream& operator<<(ostream& out, const Fraction& fraction);
};

ostream& operator<<(ostream& out, const Fraction& fraction) {
    out << fraction.numerator << '/' << fraction.denominator;
    return out;
}

int main() {
    int firstNumerator;
    int firstDenominator;
    int secondNumerator;
    int secondDenominator;
    cin >> firstNumerator >> firstDenominator;
    cin >> secondNumerator >> secondDenominator;

    Fraction first(firstNumerator, firstDenominator);
    Fraction second(secondNumerator, secondDenominator);
    cout << first + second << '\n';
    return 0;
}
~~~

</Answer>

---

## Q4. 안전한 나눗셈 계산기

**난이도:** 상

### 요구사항

- 0으로 나누려 하면 invalid_argument 예외를 던집니다.
- 입력을 읽지 못하면 runtime_error 예외를 던집니다.
- main 함수에서 exception의 const 참조로 예외를 처리합니다.

### 입력

두 실수가 주어집니다.

### 출력

정상 입력이면 나눗셈 결과를, 오류가 발생하면 오류 메시지를 출력합니다.

### 입력 예시

~~~text
10 0
~~~

### 출력 예시

~~~text
오류: 0으로 나눌 수 없습니다.
~~~

<Answer>

~~~cpp title="safe_division.cpp" showLineNumbers
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
        double left;
        double right;
        if (!(cin >> left >> right)) {
            throw runtime_error("숫자를 입력해야 합니다.");
        }
        cout << divide(left, right) << '\n';
    } catch (const exception& error) {
        cout << "오류: " << error.what() << '\n';
    }
    return 0;
}
~~~

</Answer>

---

## Q5. 예외 안전 계좌 이체

**난이도:** 최상

### 요구사항

- Account 클래스는 음수 입금과 잔액을 초과하는 출금에 예외를 던집니다.
- transfer 함수는 출금 후 입금 과정에서 오류가 발생하면 원래 잔액으로 복구합니다.
- 예외가 main까지 전파되도록 하고 최종 잔액을 항상 출력합니다.
- 지역 객체의 소멸 순서를 확인할 수 있는 로그 클래스를 사용합니다.

### 입력

두 계좌의 초기 잔액과 이체 금액이 주어집니다.

### 출력

성공 여부와 두 계좌의 최종 잔액을 출력합니다.

### 입력 예시

~~~text
1000 500 1200
~~~

### 출력 예시

~~~text
이체 실패: 잔액이 부족합니다.
1000 500
~~~

<Answer>

~~~cpp title="exception_safe_transfer.cpp" showLineNumbers
#include <iostream>
#include <stdexcept>
using namespace std;

class Account {
private:
    int balance;

public:
    Account(int balance) : balance(balance) {
        if (balance < 0) {
            throw invalid_argument("초기 잔액이 올바르지 않습니다.");
        }
    }

    void deposit(int amount) {
        if (amount < 0) {
            throw invalid_argument("입금액이 올바르지 않습니다.");
        }
        balance += amount;
    }

    void withdraw(int amount) {
        if (amount < 0) {
            throw invalid_argument("출금액이 올바르지 않습니다.");
        }
        if (amount > balance) {
            throw runtime_error("잔액이 부족합니다.");
        }
        balance -= amount;
    }

    int getBalance() const {
        return balance;
    }
};

void transfer(Account& from, Account& to, int amount) {
    from.withdraw(amount);
    try {
        to.deposit(amount);
    } catch (...) {
        from.deposit(amount);
        throw;
    }
}

int main() {
    int firstBalance;
    int secondBalance;
    int amount;
    cin >> firstBalance >> secondBalance >> amount;

    try {
        Account first(firstBalance);
        Account second(secondBalance);

        try {
            transfer(first, second, amount);
            cout << "이체 성공\n";
        } catch (const exception& error) {
            cout << "이체 실패: " << error.what() << '\n';
        }

        cout << first.getBalance() << ' ' << second.getBalance() << '\n';
    } catch (const exception& error) {
        cout << "계좌 생성 실패: " << error.what() << '\n';
    }
    return 0;
}
~~~

</Answer>
