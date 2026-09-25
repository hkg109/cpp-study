---
title: '참조와 배열, vector 실습'
description: ''
week: 3
order: 1
published: true
---

3주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 두 점수 교환하기

**난이도:** 중하

### 요구사항

- 두 정수를 참조 매개변수로 받는 swapScores 함수를 작성합니다.
- 함수 안에서 두 값을 교환합니다.
- 교환한 결과를 main 함수에서 출력합니다.

### 입력

한 줄에 두 정수가 주어집니다.

### 출력

교환된 두 정수를 공백으로 구분하여 출력합니다.

### 입력 예시

~~~text
70 95
~~~

### 출력 예시

~~~text
95 70
~~~

<Answer>

~~~cpp title="swap_scores.cpp" showLineNumbers
#include <iostream>
using namespace std;

void swapScores(int& first, int& second) {
    int temp = first;
    first = second;
    second = temp;
}

int main() {
    int first;
    int second;
    cin >> first >> second;
    swapScores(first, second);
    cout << first << ' ' << second << '\n';
    return 0;
}
~~~

</Answer>

---

## Q2. 배열 통계

**난이도:** 중

### 요구사항

- 정수 n과 n개의 점수를 배열에 저장합니다.
- 배열을 const 참조로 받는 평균 계산 함수를 작성합니다.
- 최댓값과 평균을 출력합니다.
- n은 100 이하입니다.

### 입력

첫째 줄에 n, 둘째 줄에 n개의 정수가 주어집니다.

### 출력

최댓값과 평균을 각각 한 줄에 출력합니다. 평균은 소수점 첫째 자리까지 표시합니다.

### 입력 예시

~~~text
5
70 85 90 65 100
~~~

### 출력 예시

~~~text
최댓값: 100
평균: 82.0
~~~

<Answer>

~~~cpp title="array_statistics.cpp" showLineNumbers
#include <iomanip>
#include <iostream>
using namespace std;

double average(const int (&scores)[100], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += scores[i];
    }
    return static_cast<double>(sum) / size;
}

int main() {
    int n;
    int scores[100] = {};
    cin >> n;

    for (int i = 0; i < n; i++) {
        cin >> scores[i];
    }

    int maximum = scores[0];
    for (int i = 1; i < n; i++) {
        if (scores[i] > maximum) {
            maximum = scores[i];
        }
    }

    cout << "최댓값: " << maximum << '\n';
    cout << fixed << setprecision(1);
    cout << "평균: " << average(scores, n) << '\n';
    return 0;
}
~~~

</Answer>

---

## Q3. 좌석 예약 현황

**난이도:** 중상

### 요구사항

- 3행 4열의 정수 배열로 좌석을 표현합니다.
- 입력받은 예약 좌표를 1로 변경합니다.
- 모든 예약이 끝난 뒤 좌석표와 남은 좌석 수를 출력합니다.
- 행과 열 번호는 0부터 시작합니다.

### 입력

첫째 줄에 예약 수 n이 주어지고, 다음 n개 줄에 행과 열이 주어집니다.

### 출력

3행 4열 좌석표를 출력한 뒤 남은 좌석 수를 출력합니다.

### 입력 예시

~~~text
3
0 1
1 2
2 3
~~~

### 출력 예시

~~~text
0 1 0 0
0 0 1 0
0 0 0 1
남은 좌석: 9
~~~

<Answer>

~~~cpp title="seat_map.cpp" showLineNumbers
#include <iostream>
using namespace std;

int main() {
    int seats[3][4] = {};
    int n;
    cin >> n;

    for (int i = 0; i < n; i++) {
        int row;
        int column;
        cin >> row >> column;
        seats[row][column] = 1;
    }

    int remaining = 0;
    for (int row = 0; row < 3; row++) {
        for (int column = 0; column < 4; column++) {
            cout << seats[row][column];
            if (column < 3) {
                cout << ' ';
            }
            if (seats[row][column] == 0) {
                remaining++;
            }
        }
        cout << '\n';
    }

    cout << "남은 좌석: " << remaining << '\n';
    return 0;
}
~~~

</Answer>

---

## Q4. 성적 정규화

**난이도:** 상

### 요구사항

- n개의 실수를 vector에 저장합니다.
- 가장 높은 점수를 100점으로 만들도록 모든 점수를 비례 변환합니다.
- 변환 작업은 vector를 참조로 받는 normalize 함수에서 수행합니다.
- 변환된 평균을 소수점 둘째 자리까지 출력합니다.

### 입력

첫째 줄에 n, 둘째 줄에 n개의 양의 실수가 주어집니다.

### 출력

정규화된 점수의 평균을 출력합니다.

### 입력 예시

~~~text
3
40 80 60
~~~

### 출력 예시

~~~text
75.00
~~~

<Answer>

~~~cpp title="normalized_scores.cpp" showLineNumbers
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

void normalize(vector<double>& scores) {
    double maximum = scores[0];
    for (double score : scores) {
        if (score > maximum) {
            maximum = score;
        }
    }

    for (double& score : scores) {
        score = score / maximum * 100.0;
    }
}

int main() {
    int n;
    cin >> n;
    vector<double> scores(n);

    for (double& score : scores) {
        cin >> score;
    }

    normalize(scores);

    double sum = 0;
    for (double score : scores) {
        sum += score;
    }

    cout << fixed << setprecision(2) << sum / scores.size() << '\n';
    return 0;
}
~~~

</Answer>

---

## Q5. 달팽이 배열

**난이도:** 최상

### 요구사항

- n행 n열 vector를 만들고 1부터 n의 제곱까지 시계 방향 달팽이 모양으로 채웁니다.
- 아직 채우지 않은 칸인지 검사하며 방향을 전환합니다.
- n은 1 이상 20 이하입니다.

### 입력

정수 n이 주어집니다.

### 출력

완성된 달팽이 배열을 행 단위로 출력합니다.

### 입력 예시

~~~text
3
~~~

### 출력 예시

~~~text
1 2 3
8 9 4
7 6 5
~~~

<Answer>

~~~cpp title="spiral_matrix.cpp" showLineNumbers
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<vector<int>> board(n, vector<int>(n, 0));
    int row = 0;
    int column = 0;
    int direction = 0;
    int dr[4] = {0, 1, 0, -1};
    int dc[4] = {1, 0, -1, 0};

    for (int value = 1; value <= n * n; value++) {
        board[row][column] = value;
        int nextRow = row + dr[direction];
        int nextColumn = column + dc[direction];

        if (nextRow < 0 || nextRow >= n || nextColumn < 0 || nextColumn >= n
            || board[nextRow][nextColumn] != 0) {
            direction = (direction + 1) % 4;
            nextRow = row + dr[direction];
            nextColumn = column + dc[direction];
        }

        row = nextRow;
        column = nextColumn;
    }

    for (const vector<int>& line : board) {
        for (int i = 0; i < n; i++) {
            cout << line[i] << (i + 1 == n ? '\n' : ' ');
        }
    }
    return 0;
}
~~~

</Answer>
