---
title: 포인터와 동적 메모리 실습
description: 주소, 포인터, C 문자열과 동적 메모리를 적용하는 다섯 문제입니다.
week: 4
order: 1
published: true
---

4주차 강의노트에서 배운 내용을 활용하여 다음 다섯 문제를 순서대로 풀어보세요.

## Q1. 포인터로 값 바꾸기

**난이도:** 중하

### 요구사항

- 정수의 주소를 받는 doubleValue 함수를 작성합니다.
- 역참조를 사용하여 원본 값을 두 배로 만듭니다.
- nullptr이 전달되면 아무 작업도 하지 않습니다.

### 입력

정수 하나가 주어집니다.

### 출력

두 배가 된 값을 출력합니다.

### 입력 예시

~~~text
21
~~~

### 출력 예시

~~~text
42
~~~

<Answer>

~~~cpp title="double_value.cpp" showLineNumbers
#include <iostream>
using namespace std;

void doubleValue(int* value) {
    if (value != nullptr) {
        *value *= 2;
    }
}

int main() {
    int number;
    cin >> number;
    doubleValue(&number);
    cout << number << '\n';
    return 0;
}
~~~

</Answer>

---

## Q2. 포인터로 배열 뒤집기

**난이도:** 중

### 요구사항

- 배열의 시작 주소와 크기를 받는 reverseArray 함수를 작성합니다.
- 대괄호 연산자 대신 포인터 연산과 역참조를 사용합니다.
- 추가 배열을 만들지 않습니다.

### 입력

첫째 줄에 n, 둘째 줄에 n개의 정수가 주어집니다. n은 100 이하입니다.

### 출력

뒤집힌 배열을 출력합니다.

### 입력 예시

~~~text
5
1 2 3 4 5
~~~

### 출력 예시

~~~text
5 4 3 2 1
~~~

<Answer>

~~~cpp title="reverse_pointer.cpp" showLineNumbers
#include <iostream>
using namespace std;

void reverseArray(int* values, int size) {
    int* left = values;
    int* right = values + size - 1;

    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;
        left++;
        right--;
    }
}

int main() {
    int n;
    int values[100];
    cin >> n;

    for (int* current = values; current < values + n; current++) {
        cin >> *current;
    }

    reverseArray(values, n);

    for (int* current = values; current < values + n; current++) {
        cout << *current << (current + 1 == values + n ? '\n' : ' ');
    }
    return 0;
}
~~~

</Answer>

---

## Q3. C 문자열 단어 수

**난이도:** 중상

### 요구사항

- 공백을 포함한 한 줄을 char 배열에 입력받습니다.
- const char 포인터를 받는 countWords 함수를 작성합니다.
- 연속된 공백은 하나의 구분으로 처리합니다.
- string 클래스는 사용하지 않습니다.

### 입력

영문과 공백으로 이루어진 한 줄이 주어집니다.

### 출력

문장의 단어 수를 출력합니다.

### 입력 예시

~~~text
C plus plus is fun
~~~

### 출력 예시

~~~text
5
~~~

<Answer>

~~~cpp title="c_string_words.cpp" showLineNumbers
#include <iostream>
using namespace std;

int countWords(const char* text) {
    int count = 0;
    bool insideWord = false;

    while (*text != '\0') {
        if (*text != ' ' && !insideWord) {
            count++;
            insideWord = true;
        } else if (*text == ' ') {
            insideWord = false;
        }
        text++;
    }
    return count;
}

int main() {
    char text[201];
    cin.getline(text, 201);
    cout << countWords(text) << '\n';
    return 0;
}
~~~

</Answer>

---

## Q4. 동적 배열 합치기

**난이도:** 상

### 요구사항

- 크기가 다른 두 동적 배열을 입력받습니다.
- 두 배열을 이어 붙인 새 동적 배열을 반환하는 merge 함수를 작성합니다.
- 사용이 끝난 모든 동적 배열을 delete[]로 해제합니다.

### 입력

각 배열에 대해 크기와 원소가 차례로 주어집니다.

### 출력

합쳐진 배열을 출력합니다.

### 입력 예시

~~~text
3
1 2 3
2
8 9
~~~

### 출력 예시

~~~text
1 2 3 8 9
~~~

<Answer>

~~~cpp title="merge_dynamic_arrays.cpp" showLineNumbers
#include <iostream>
using namespace std;

int* merge(const int* first, int firstSize, const int* second, int secondSize) {
    int* result = new int[firstSize + secondSize];

    for (int i = 0; i < firstSize; i++) {
        result[i] = first[i];
    }
    for (int i = 0; i < secondSize; i++) {
        result[firstSize + i] = second[i];
    }
    return result;
}

int main() {
    int firstSize;
    int secondSize;
    cin >> firstSize;
    int* first = new int[firstSize];
    for (int i = 0; i < firstSize; i++) {
        cin >> first[i];
    }

    cin >> secondSize;
    int* second = new int[secondSize];
    for (int i = 0; i < secondSize; i++) {
        cin >> second[i];
    }

    int totalSize = firstSize + secondSize;
    int* result = merge(first, firstSize, second, secondSize);
    for (int i = 0; i < totalSize; i++) {
        cout << result[i] << (i + 1 == totalSize ? '\n' : ' ');
    }

    delete[] first;
    delete[] second;
    delete[] result;
    return 0;
}
~~~

</Answer>

---

## Q5. 동적 행렬 곱셈

**난이도:** 최상

### 요구사항

- 두 행렬의 크기와 원소를 입력받아 동적 이차원 배열로 저장합니다.
- 첫 행렬의 열 수와 둘째 행렬의 행 수가 다르면 계산하지 않습니다.
- 곱셈 결과도 동적으로 할당하고 모든 메모리를 정확히 해제합니다.

### 입력

두 행렬의 행과 열, 각 행렬의 원소가 차례로 주어집니다.

### 출력

곱셈이 가능하면 결과 행렬을 출력하고, 불가능하면 계산 불가를 출력합니다.

### 입력 예시

~~~text
2 3
1 2 3
4 5 6
3 2
7 8
9 10
11 12
~~~

### 출력 예시

~~~text
58 64
139 154
~~~

<Answer>

~~~cpp title="dynamic_matrix.cpp" showLineNumbers
#include <iostream>
using namespace std;

int** createMatrix(int rows, int columns) {
    int** matrix = new int*[rows];
    for (int row = 0; row < rows; row++) {
        matrix[row] = new int[columns] {};
    }
    return matrix;
}

void deleteMatrix(int** matrix, int rows) {
    for (int row = 0; row < rows; row++) {
        delete[] matrix[row];
    }
    delete[] matrix;
}

int main() {
    int firstRows;
    int firstColumns;
    cin >> firstRows >> firstColumns;
    int** first = createMatrix(firstRows, firstColumns);
    for (int row = 0; row < firstRows; row++) {
        for (int column = 0; column < firstColumns; column++) {
            cin >> first[row][column];
        }
    }

    int secondRows;
    int secondColumns;
    cin >> secondRows >> secondColumns;
    int** second = createMatrix(secondRows, secondColumns);
    for (int row = 0; row < secondRows; row++) {
        for (int column = 0; column < secondColumns; column++) {
            cin >> second[row][column];
        }
    }

    if (firstColumns != secondRows) {
        cout << "계산 불가\n";
        deleteMatrix(first, firstRows);
        deleteMatrix(second, secondRows);
        return 0;
    }

    int** result = createMatrix(firstRows, secondColumns);
    for (int row = 0; row < firstRows; row++) {
        for (int column = 0; column < secondColumns; column++) {
            for (int index = 0; index < firstColumns; index++) {
                result[row][column] += first[row][index] * second[index][column];
            }
        }
    }

    for (int row = 0; row < firstRows; row++) {
        for (int column = 0; column < secondColumns; column++) {
            cout << result[row][column] << (column + 1 == secondColumns ? '\n' : ' ');
        }
    }

    deleteMatrix(first, firstRows);
    deleteMatrix(second, secondRows);
    deleteMatrix(result, firstRows);
    return 0;
}
~~~

</Answer>
