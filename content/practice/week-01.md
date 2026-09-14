---
title: 표현식과 흐름 제어
description: ''
week: 1
order: 1
published: true
---

1주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 수의 부호 판별하기

**난이도:** 중하

### 요구사항

- 정수 하나를 입력받습니다.
- `if`, `else if`, `else`를 사용하여 양수, 음수, 0인지 판별합니다.
- 세 가지 결과 중 하나만 출력합니다.

### 입력

정수 `number` 하나가 주어집니다.

### 출력

양수이면 `양수`, 음수이면 `음수`, 0이면 `0`을 출력합니다.

### 입력 예시

```text
-10
```

### 출력 예시

```text
음수
```

<Answer>

```cpp title="number_sign.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int number;
    cin >> number;

    if (number > 0) {
        cout << "양수\n";
    } else if (number < 0) {
        cout << "음수\n";
    } else {
        cout << "0\n";
    }

    return 0;
}
```

</Answer>

---

## Q2. 학점 계산기

**난이도:** 중

### 요구사항

- 0점부터 100점 사이의 정수 점수를 입력받습니다.
- 90점 이상은 `A`, 80점 이상은 `B`, 70점 이상은 `C`, 60점 이상은 `D`, 나머지는 `F`를 출력합니다.
- 높은 점수 조건부터 순서대로 검사합니다.

### 입력

정수 `score`가 주어집니다. `0 <= score <= 100`입니다.

### 출력

점수에 해당하는 학점을 출력합니다.

### 입력 예시

```text
85
```

### 출력 예시

```text
B
```

<Answer>

```cpp title="letter_grade.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int score;
    cin >> score;

    if (score >= 90) {
        cout << "A\n";
    } else if (score >= 80) {
        cout << "B\n";
    } else if (score >= 70) {
        cout << "C\n";
    } else if (score >= 60) {
        cout << "D\n";
    } else {
        cout << "F\n";
    }

    return 0;
}
```

</Answer>

---

## Q3. 메뉴형 계산기

**난이도:** 중상

### 요구사항

- 연산 번호와 두 정수 `a`, `b`를 입력받습니다.
- `switch`를 사용하여 `1`은 덧셈, `2`는 뺄셈, `3`은 곱셈, `4`는 정수 나눗셈을 수행합니다.
- 연산 번호가 올바르지 않거나 0으로 나누려고 하면 `오류`를 출력합니다.

### 입력

한 줄에 세 정수 `operation`, `a`, `b`가 주어집니다.

### 출력

계산 결과 또는 `오류`를 출력합니다.

### 입력 예시

```text
3 7 6
```

### 출력 예시

```text
42
```

<Answer>

```cpp title="menu_calculator.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int operation;
    int a;
    int b;
    cin >> operation >> a >> b;

    bool valid = true;
    int result = 0;

    switch (operation) {
        case 1:
            result = a + b;
            break;
        case 2:
            result = a - b;
            break;
        case 3:
            result = a * b;
            break;
        case 4:
            if (b == 0) {
                valid = false;
            } else {
                result = a / b;
            }
            break;
        default:
            valid = false;
    }

    if (valid) {
        cout << result << '\n';
    } else {
        cout << "오류\n";
    }

    return 0;
}
```

</Answer>

---

## Q4. 소수 판별하기

**난이도:** 상

### 요구사항

- 정수 `n`을 입력받습니다.
- 반복문을 사용하여 `n`이 소수인지 판별합니다.
- 약수를 발견하면 즉시 반복을 종료합니다.
- 소수는 1보다 크고 양의 약수가 1과 자기 자신뿐인 수입니다.

### 입력

정수 `n`이 주어집니다. `-2,000,000,000 <= n <= 2,000,000,000`입니다.

### 출력

소수이면 `소수`, 아니면 `소수 아님`을 출력합니다.

### 입력 예시

```text
29
```

### 출력 예시

```text
소수
```

<Answer>

```cpp title="prime_test.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int n;
    cin >> n;

    bool isPrime = n > 1;

    for (int divisor = 2; divisor <= n / divisor; divisor++) {
        if (n % divisor == 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        cout << "소수\n";
    } else {
        cout << "소수 아님\n";
    }

    return 0;
}
```

</Answer>

---

## Q5. 은행 명령 처리기

**난이도:** 최상

### 요구사항

- 잔액은 0원에서 시작합니다.
- 명령 문자와 금액을 반복해서 입력받습니다.
- `D` 명령은 입력 금액을 입금합니다.
- `W` 명령은 잔액이 충분할 때만 출금하고, 잔액이 부족하면 `거절`을 출력합니다.
- `B` 명령은 금액을 무시하고 현재 잔액을 출력합니다.
- `Q` 명령은 프로그램을 종료하고 최종 잔액과 성공한 입출금 횟수를 출력합니다.
- 반복문과 `switch`를 사용하며 `main` 이외의 함수는 사용하지 않습니다.

### 입력

각 줄에 명령 문자 `command`와 0 이상의 정수 `amount`가 주어집니다. 마지막 줄은 `Q 0`입니다.

### 출력

`B` 명령에는 현재 잔액을 출력하고, 실패한 출금에는 `거절`을 출력합니다. `Q` 명령 뒤에는 최종 결과를 출력합니다.

### 입력 예시

```text
D 1000
W 300
W 900
B 0
D 200
Q 0
```

### 출력 예시

```text
거절
잔액: 700
최종 잔액: 900
성공한 거래: 3
```

<Answer>

```cpp title="bank_commands.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int balance = 0;
    int successfulTransactions = 0;

    while (true) {
        char command;
        int amount;
        cin >> command >> amount;

        switch (command) {
            case 'D':
                balance += amount;
                successfulTransactions++;
                break;
            case 'W':
                if (amount <= balance) {
                    balance -= amount;
                    successfulTransactions++;
                } else {
                    cout << "거절\n";
                }
                break;
            case 'B':
                cout << "잔액: " << balance << '\n';
                break;
            case 'Q':
                cout << "최종 잔액: " << balance << '\n';
                cout << "성공한 거래: " << successfulTransactions << '\n';
                return 0;
        }
    }
}
```

</Answer>
