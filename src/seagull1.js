/*
 * @Author: pink
 * @Date: 2022-02-16 10:24:24
 * @LastEditors: pink
 * @LastEditTime: 2022-02-16 11:09:36
 * @Description: 海鸥函数式处理
 */

let add = function(x, y){
  return x+y
}

let multiply = function(x, y){
  return x*y
}

let flock_a = 4
let flock_b = 2
let flock_c = 0

let result = add(multiply(flock_b,add(flock_a, flock_c)),multiply(flock_a,flock_b))

// 原有代码
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// 应用同一律，去掉多余的加法操作（add(flock_a, flock_c) == flock_a）
let res1 = add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// 再应用分配律
let res2 =  multiply(flock_b, add(flock_a, flock_a));

console.log(result,res1,res2)//16