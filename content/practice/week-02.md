---
title: 함수, 재귀, 스코프
description: ''
week: 2
order: 1
published: true
---

2주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 직사각형 계산기

**난이도:** 중하

### 요구사항

- `int area(int width, int height)` 함수를 작성합니다.
- `int perimeter(int width, int height)` 함수를 작성합니다.
- 너비와 높이를 입력받아 두 함수를 호출하고 반환값을 출력합니다.

### 입력

한 줄에 두 양의 정수 `width`, `height`가 주어집니다.

### 출력

직사각형의 넓이와 둘레를 각각 한 줄에 출력합니다.

### 입력 예시

```text
5 3
```

### 출력 예시

```text
넓이: 15
둘레: 16
```

<Answer>

```cpp title="rectangle.cpp" showLineNumbers
#include <iostream>

using namespace std;

int area(int width, int height) {
    return width * height;
}

int perimeter(int width, int height) {
    return 2 * (width + height);
}

int main() {
    int width;
    int height;
    cin >> width >> height;

    cout << "넓이: " << area(width, height) << '\n';
    cout << "둘레: " << perimeter(width, height) << '\n';

    return 0;
}
```

</Answer>

---

## Q2. 소수 개수 세기

**난이도:** 중

### 요구사항

- `main` 함수 앞에 `bool isPrime(int number)` 함수 원형을 선언합니다.
- 실제 함수 정의는 `main` 함수 뒤에 작성합니다.
- `n`개의 정수를 입력받고 각 값에 `isPrime` 함수를 호출하여 소수의 개수를 구합니다.
- 매개변수는 값으로 전달합니다.

### 입력

첫째 줄에 정수 `n`, 둘째 줄에 `n`개의 정수가 주어집니다.

### 출력

입력값 중 소수의 개수를 출력합니다.

### 입력 예시

```text
6
2 4 5 9 11 15
```

### 출력 예시

```text
3
```

<Answer>

```cpp title="prime_counter.cpp" showLineNumbers
#include <iostream>

using namespace std;

bool isPrime(int number);

int main() {
    int n;
    cin >> n;

    int count = 0;
    for (int i = 0; i < n; i++) {
        int number;
        cin >> number;
        if (isPrime(number)) {
            count++;
        }
    }

    cout << count << '\n';
    return 0;
}

bool isPrime(int number) {
    if (number <= 1) {
        return false;
    }

    for (int divisor = 2; divisor <= number / divisor; divisor++) {
        if (number % divisor == 0) {
            return false;
        }
    }

    return true;
}
```

</Answer>

---

## Q3. 재귀로 자릿수 합 구하기

**난이도:** 중상

### 요구사항

- 재귀 함수 `int digitSum(int number)`를 작성합니다.
- 한 자리 수를 처리하는 기저 조건을 작성합니다.
- 반복문을 사용하거나 입력값을 문자열로 변환하지 않습니다.

### 입력

0 이상의 정수 `number`가 주어집니다. `0 <= number <= 2,000,000,000`입니다.

### 출력

모든 자리 숫자의 합을 출력합니다.

### 입력 예시

```text
50291
```

### 출력 예시

```text
17
```

<Answer>

```cpp title="recursive_digit_sum.cpp" showLineNumbers
#include <iostream>

using namespace std;

int digitSum(int number) {
    if (number < 10) {
        return number;
    }

    return number % 10 + digitSum(number / 10);
}

int main() {
    int number;
    cin >> number;

    cout << digitSum(number) << '\n';

    return 0;
}
```

</Answer>

---

## Q4. 재귀로 최대공약수와 최소공배수 구하기

**난이도:** 상

### 요구사항

- 유클리드 호제법을 사용한 재귀 함수 `long long gcd(long long a, long long b)`를 작성합니다.
- `gcd`를 호출하는 별도의 `long long lcm(long long a, long long b)` 함수를 작성합니다.
- 함수 내부에서 입력값을 변경하지 않습니다.
- 최소공배수는 `long long` 범위를 넘지 않는다고 가정합니다.

### 입력

한 줄에 두 양의 정수 `a`, `b`가 주어집니다.

### 출력

최대공약수와 최소공배수를 각각 한 줄에 출력합니다.

### 입력 예시

```text
48 180
```

### 출력 예시

```text
최대공약수: 12
최소공배수: 720
```

<Answer>

```cpp title="gcd_lcm.cpp" showLineNumbers
#include <iostream>

using namespace std;

long long gcd(const long long a, const long long b) {
    if (b == 0) {
        return a;
    }

    return gcd(b, a % b);
}

long long lcm(const long long a, const long long b) {
    return a / gcd(a, b) * b;
}

int main() {
    long long a;
    long long b;
    cin >> a >> b;

    cout << "최대공약수: " << gcd(a, b) << '\n';
    cout << "최소공배수: " << lcm(a, b) << '\n';

    return 0;
}
```

</Answer>

---

## Q5. 하노이 탑

**난이도:** 최상

### 요구사항

- 재귀 함수를 사용하여 `n`개의 원판을 기둥 `A`에서 기둥 `B`를 거쳐 기둥 `C`로 옮깁니다.
- 모든 이동을 `원판 X: A -> C` 형식으로 출력합니다.
- 전체 이동 횟수를 계산하는 별도의 재귀 함수를 작성합니다.
- 전역 변수는 사용하지 않습니다.

### 입력

정수 `n`이 주어집니다. `1 <= n <= 10`입니다.

### 출력

첫째 줄에 전체 이동 횟수를 출력하고, 이후 각 원판의 이동을 순서대로 출력합니다.

### 입력 예시

```text
3
```

### 출력 예시

```text
이동 횟수: 7
원판 1: A -> C
원판 2: A -> B
원판 1: C -> B
원판 3: A -> C
원판 1: B -> A
원판 2: B -> C
원판 1: A -> C
```

<Answer>

```cpp title="tower_of_hanoi.cpp" showLineNumbers
#include <iostream>

using namespace std;

long long countMoves(int n) {
    if (n == 1) {
        return 1;
    }

    return 2 * countMoves(n - 1) + 1;
}

void moveDisks(int n, char from, char auxiliary, char to) {
    if (n == 1) {
        cout << "원판 1: " << from << " -> " << to << '\n';
        return;
    }

    moveDisks(n - 1, from, to, auxiliary);
    cout << "원판 " << n << ": " << from << " -> " << to << '\n';
    moveDisks(n - 1, auxiliary, from, to);
}

int main() {
    int n;
    cin >> n;

    cout << "이동 횟수: " << countMoves(n) << '\n';
    moveDisks(n, 'A', 'B', 'C');

    return 0;
}
```

</Answer>
