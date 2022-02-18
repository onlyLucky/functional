/*
 * @Author: pink
 * @Date: 2022-02-18 09:12:29
 * @LastEditors: pink
 * @LastEditTime: 2022-02-18 10:51:17
 * @Description: 纯函数
 */

let xs = [1,2,3,4,5];

// 纯函数
xs.slice(0,3) //=>[1,2,3]

xs.slice(0,3) //=>[1,2,3]

//  不纯
xs.splice(0,3) //=>[1,2,3]
xs.splice(0,3) //=>[4,5]


// 不纯的
let minimum = 21;

let checkAge = function(age) {
  return age >= minimum;
};


// 纯的
let checkAgePure = function(age) {
  let minimumPure = 21;
  return age >= minimumPure;
};


// 冻结外部变量
let immutableState = Object.freeze({
  minimum: 21
});
