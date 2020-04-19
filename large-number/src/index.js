export default function add(a, b) {
    let i = a.length - 1;
    let j = b.length - 1;
    let result = '', 
        carry = 0; // 进位值
    while (i >= 0 || j >= 0) {
        let x = 0, // 当前值
            y = 0, // 当前值
            sum;
        if (i >= 0) {
            x = a[i] - '0' // 转成数字
            i--;
        }
        if (j >= 0) {
            y = b[j] - '0' // 转成数字
            j--;
        }
        sum = x + y + carry;
        if (sum >= 10) {
            sum -= 10
            carry = 1 // 产生的进位
        } else {
            carry = 0
        }
        result = sum + result
    }
    if (carry) {
        result = carry + result
    }
    return result
}

// add('999', '1')   1000