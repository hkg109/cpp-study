---
title: 클래스와 객체지향 프로그래밍 실습
description: ''
week: 5
order: 1
published: true
---

5주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 직사각형 클래스

**난이도:** 중하

### 요구사항

- width와 height를 private 속성으로 갖는 Rectangle 클래스를 작성합니다.
- 생성자로 두 속성을 초기화합니다.
- 넓이와 둘레를 반환하는 const 메서드를 작성합니다.

### 입력

너비와 높이가 주어집니다.

### 출력

넓이와 둘레를 각각 한 줄에 출력합니다.

### 입력 예시

~~~text
5 3
~~~

### 출력 예시

~~~text
넓이: 15
둘레: 16
~~~

<Answer>

~~~cpp title="rectangle_class.cpp" showLineNumbers
#include <iostream>
using namespace std;

class Rectangle {
private:
    int width;
    int height;

public:
    Rectangle(int width, int height) : width(width), height(height) {
    }

    int area() const {
        return width * height;
    }

    int perimeter() const {
        return 2 * (width + height);
    }
};

int main() {
    int width;
    int height;
    cin >> width >> height;

    Rectangle rectangle(width, height);
    cout << "넓이: " << rectangle.area() << '\n';
    cout << "둘레: " << rectangle.perimeter() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q2. 안전한 은행 계좌

**난이도:** 중

### 요구사항

- 잔액을 private으로 관리하는 BankAccount 클래스를 작성합니다.
- 양수만 입금할 수 있고 잔액보다 큰 금액은 출금할 수 없습니다.
- 입금과 출금 명령을 처리한 뒤 최종 잔액을 출력합니다.

### 입력

첫째 줄에 초기 잔액과 명령 수가 주어집니다. 이어지는 각 줄에는 D 또는 W와 금액이 주어집니다.

### 출력

실패한 출금마다 출금 실패를 출력하고 마지막에 최종 잔액을 출력합니다.

### 입력 예시

~~~text
1000 3
D 500
W 300
W 2000
~~~

### 출력 예시

~~~text
출금 실패
잔액: 1200
~~~

<Answer>

~~~cpp title="bank_account.cpp" showLineNumbers
#include <iostream>
using namespace std;

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

int main() {
    int initialBalance;
    int commandCount;
    cin >> initialBalance >> commandCount;
    BankAccount account(initialBalance);

    for (int i = 0; i < commandCount; i++) {
        char command;
        int amount;
        cin >> command >> amount;
        if (command == 'D') {
            account.deposit(amount);
        } else if (!account.withdraw(amount)) {
            cout << "출금 실패\n";
        }
    }

    cout << "잔액: " << account.getBalance() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q3. 학생 성적부

**난이도:** 중상

### 요구사항

- 이름과 점수 vector를 속성으로 갖는 Student 클래스를 작성합니다.
- 점수를 추가하는 메서드와 평균을 반환하는 const 메서드를 작성합니다.
- 여러 학생을 vector에 저장하고 평균이 가장 높은 학생을 출력합니다.

### 입력

학생 수가 주어지고, 각 학생마다 이름, 점수 개수, 점수들이 주어집니다.

### 출력

평균이 가장 높은 학생의 이름과 평균을 소수점 첫째 자리까지 출력합니다.

### 입력 예시

~~~text
2
Jisuk 3 90 80 100
Jungjae 2 95 98
~~~

### 출력 예시

~~~text
Jungjae 96.5
~~~

<Answer>

~~~cpp title="student_records.cpp" showLineNumbers
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Student {
private:
    string name;
    vector<int> scores;

public:
    Student(string name) : name(name) {
    }

    void addScore(int score) {
        scores.push_back(score);
    }

    double average() const {
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        return static_cast<double>(sum) / scores.size();
    }

    string getName() const {
        return name;
    }
};

int main() {
    int n;
    cin >> n;
    vector<Student> students;

    for (int i = 0; i < n; i++) {
        string name;
        int count;
        cin >> name >> count;
        Student student(name);
        for (int j = 0; j < count; j++) {
            int score;
            cin >> score;
            student.addScore(score);
        }
        students.push_back(student);
    }

    const Student* best = &students[0];
    for (const Student& student : students) {
        if (student.average() > best->average()) {
            best = &student;
        }
    }

    cout << fixed << setprecision(1);
    cout << best->getName() << ' ' << best->average() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q4. 직원 급여 계산

**난이도:** 상

### 요구사항

- Employee 기반 클래스에 이름과 가상 함수 calculatePay를 선언합니다.
- SalariedEmployee와 HourlyEmployee가 급여 계산을 오버라이딩합니다.
- 기반 클래스 포인터 vector를 순회하며 각 직원의 급여를 출력합니다.

### 입력

직원 수가 주어집니다. S 직원은 이름과 월급, H 직원은 이름과 시급과 근무 시간이 주어집니다.

### 출력

각 직원의 이름과 계산된 급여를 입력 순서대로 출력합니다.

### 입력 예시

~~~text
2
S Mina 3000
H Alex 20 120
~~~

### 출력 예시

~~~text
Mina 3000
Alex 2400
~~~

<Answer>

~~~cpp title="employee_pay.cpp" showLineNumbers
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Employee {
protected:
    string name;

public:
    Employee(string name) : name(name) {
    }

    virtual int calculatePay() const = 0;

    string getName() const {
        return name;
    }

    virtual ~Employee() = default;
};

class SalariedEmployee : public Employee {
private:
    int salary;

public:
    SalariedEmployee(string name, int salary) : Employee(name), salary(salary) {
    }

    int calculatePay() const override {
        return salary;
    }
};

class HourlyEmployee : public Employee {
private:
    int hourlyRate;
    int hours;

public:
    HourlyEmployee(string name, int hourlyRate, int hours)
        : Employee(name), hourlyRate(hourlyRate), hours(hours) {
    }

    int calculatePay() const override {
        return hourlyRate * hours;
    }
};

int main() {
    int n;
    cin >> n;
    vector<Employee*> employees;

    for (int i = 0; i < n; i++) {
        char type;
        string name;
        cin >> type >> name;
        if (type == 'S') {
            int salary;
            cin >> salary;
            employees.push_back(new SalariedEmployee(name, salary));
        } else {
            int rate;
            int hours;
            cin >> rate >> hours;
            employees.push_back(new HourlyEmployee(name, rate, hours));
        }
    }

    for (const Employee* employee : employees) {
        cout << employee->getName() << ' ' << employee->calculatePay() << '\n';
    }

    for (Employee* employee : employees) {
        delete employee;
    }
    return 0;
}
~~~

</Answer>

---

## Q5. 도형 관리 시스템

**난이도:** 최상

### 요구사항

- Shape 추상 클래스에 area와 name 순수 가상 함수를 선언합니다.
- Circle과 Rectangle 클래스를 구현합니다.
- 입력된 모든 도형의 넓이 합과 가장 넓은 도형의 종류를 출력합니다.
- 기반 클래스 소멸자를 virtual로 선언합니다.

### 입력

도형 수가 주어집니다. C 뒤에는 반지름, R 뒤에는 너비와 높이가 주어집니다.

### 출력

전체 넓이와 가장 넓은 도형의 이름을 출력합니다. 넓이는 소수점 둘째 자리까지 표시합니다.

### 입력 예시

~~~text
3
C 2
R 3 4
C 1
~~~

### 출력 예시

~~~text
전체 넓이: 27.71
가장 넓은 도형: Circle
~~~

<Answer>

~~~cpp title="shape_manager.cpp" showLineNumbers
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double radius) : radius(radius) {
    }

    double area() const override {
        return 3.141592 * radius * radius;
    }

    string name() const override {
        return "Circle";
    }
};

class Rectangle : public Shape {
private:
    double width;
    double height;

public:
    Rectangle(double width, double height) : width(width), height(height) {
    }

    double area() const override {
        return width * height;
    }

    string name() const override {
        return "Rectangle";
    }
};

int main() {
    int n;
    cin >> n;
    vector<Shape*> shapes;

    for (int i = 0; i < n; i++) {
        char type;
        cin >> type;
        if (type == 'C') {
            double radius;
            cin >> radius;
            shapes.push_back(new Circle(radius));
        } else {
            double width;
            double height;
            cin >> width >> height;
            shapes.push_back(new Rectangle(width, height));
        }
    }

    double total = 0;
    const Shape* largest = shapes[0];
    for (const Shape* shape : shapes) {
        total += shape->area();
        if (shape->area() > largest->area()) {
            largest = shape;
        }
    }

    cout << fixed << setprecision(2);
    cout << "전체 넓이: " << total << '\n';
    cout << "가장 넓은 도형: " << largest->name() << '\n';

    for (Shape* shape : shapes) {
        delete shape;
    }
    return 0;
}
~~~

</Answer>
