---
title: 입출력, 자료형, 연산자
description: ''
week: 0
order: 1
published: true
---

0주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 학생 정보 출력하기

**난이도:** 중하

### 요구사항

- 학생의 이름, 나이, 하루 목표 공부 시간을 입력받습니다.
- 입력받은 값을 출력 예시와 같은 형식으로 출력합니다.
- 이름에는 공백이 없다고 가정합니다.

### 입력

한 줄에 문자열 `name`과 두 정수 `age`, `hours`가 공백으로 구분되어 주어집니다.

### 출력

학생의 이름, 나이, 목표 공부 시간을 각각 한 줄에 출력합니다.

### 입력 예시

```text
Alex 20 3
```

### 출력 예시

```text
이름: Alex
나이: 20
공부 시간: 3
```

<Answer>

```cpp title="student_profile.cpp" showLineNumbers
#include <iostream>
#include <string>

using namespace std;

int main() {
    string name;
    int age;
    int hours;

    cin >> name >> age >> hours;

    cout << "이름: " << name << '\n';
    cout << "나이: " << age << '\n';
    cout << "공부 시간: " << hours << '\n';

    return 0;
}
```

</Answer>

---

## Q2. 사칙연산 보고서

**난이도:** 중

### 요구사항

- 두 정수 `a`, `b`를 입력받습니다.
- 두 수의 합, 차, 곱, 정수 몫, 나머지를 출력합니다.
- `b`는 0이 아니라고 가정합니다.

### 입력

한 줄에 두 정수 `a`, `b`가 공백으로 구분되어 주어집니다.

### 출력

합, 차, 곱, 몫, 나머지를 정해진 순서대로 출력합니다.

### 입력 예시

```text
17 5
```

### 출력 예시

```text
합: 22
차: 12
곱: 85
몫: 3
나머지: 2
```

<Answer>

```cpp title="arithmetic_report.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int a;
    int b;

    cin >> a >> b;

    cout << "합: " << a + b << '\n';
    cout << "차: " << a - b << '\n';
    cout << "곱: " << a * b << '\n';
    cout << "몫: " << a / b << '\n';
    cout << "나머지: " << a % b << '\n';

    return 0;
}
```

</Answer>

---

## Q3. 시간 변환기

**난이도:** 중상

### 요구사항

- 0 이상의 전체 초를 입력받습니다.
- 전체 초를 시, 분, 초로 변환합니다.
- 정수 나눗셈과 나머지 연산자를 사용합니다.

### 입력

정수 `totalSeconds`가 주어집니다. `0 <= totalSeconds <= 1,000,000`입니다.

### 출력

변환한 시, 분, 초를 공백으로 구분하여 출력합니다.

### 입력 예시

```text
7384
```

### 출력 예시

```text
2 3 4
```

<Answer>

```cpp title="time_converter.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int totalSeconds;
    cin >> totalSeconds;

    int hours = totalSeconds / 3600;
    int remainingSeconds = totalSeconds % 3600;
    int minutes = remainingSeconds / 60;
    int seconds = remainingSeconds % 60;

    cout << hours << ' ' << minutes << ' ' << seconds << '\n';

    return 0;
}
```

</Answer>

---

## Q4. 가중 점수 판정하기

**난이도:** 상

### 요구사항

- 과제, 중간고사, 기말고사 점수를 입력받습니다.
- 각 점수에 `20%`, `30%`, `50%`를 적용하여 가중 점수를 계산합니다.
- 계산 결과는 `double` 자료형에 저장합니다.
- 가중 점수와 60점 이상 여부를 `true` 또는 `false`로 출력합니다.
- 논리값 출력에는 `boolalpha`를 사용합니다.

### 입력

한 줄에 세 실수 `assignment`, `midterm`, `finalScore`가 주어집니다.

### 출력

가중 점수와 통과 여부를 각각 한 줄에 출력합니다.

### 입력 예시

```text
80 70 90
```

### 출력 예시

```text
가중 점수: 82
통과: true
```

<Answer>

```cpp title="weighted_score.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    double assignment;
    double midterm;
    double finalScore;

    cin >> assignment >> midterm >> finalScore;

    double weightedScore = assignment * 0.2
                         + midterm * 0.3
                         + finalScore * 0.5;
    bool passed = weightedScore >= 60.0;

    cout << "가중 점수: " << weightedScore << '\n';
    cout << boolalpha << "통과: " << passed << '\n';

    return 0;
}
```

</Answer>

---

## Q5. 네 자리 수 분석기

**난이도:** 최상

### 요구사항

- 네 자리 양의 정수를 입력받습니다.
- 정수 나눗셈과 나머지 연산자만 사용하여 네 자리 숫자를 각각 분리합니다.
- 각 자리 숫자를 역순으로 출력합니다.
- 각 자리 숫자의 합과 곱을 출력합니다.
- 첫째 자리와 넷째 자리가 같고 둘째 자리와 셋째 자리가 같으면 `true`, 아니면 `false`를 출력합니다.
- 입력값을 문자열로 변환하지 않습니다.

### 입력

정수 `number`가 주어집니다. `1000 <= number <= 9999`입니다.

### 출력

뒤집은 숫자, 각 자리의 합과 곱, 회문 여부를 출력합니다.

### 입력 예시

```text
1221
```

### 출력 예시

```text
뒤집은 숫자: 1221
합: 6
곱: 4
회문: true
```

<Answer>

```cpp title="number_analyzer.cpp" showLineNumbers
#include <iostream>

using namespace std;

int main() {
    int number;
    cin >> number;

    int thousands = number / 1000;
    int hundreds = number / 100 % 10;
    int tens = number / 10 % 10;
    int ones = number % 10;

    int sum = thousands + hundreds + tens + ones;
    int product = thousands * hundreds * tens * ones;
    bool palindrome = thousands == ones && hundreds == tens;

    cout << "뒤집은 숫자: "
         << ones << tens << hundreds << thousands << '\n';
    cout << "합: " << sum << '\n';
    cout << "곱: " << product << '\n';
    cout << boolalpha << "회문: " << palindrome << '\n';

    return 0;
}
```

</Answer>
