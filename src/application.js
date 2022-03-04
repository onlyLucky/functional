/*
 * @Author: pink
 * @Date: 2022-03-03 23:41:29
 * @LastEditors: pink
 * @LastEditTime: 2022-03-04 22:21:14
 * @Description: 实例应用
 */
// 命令式
let makes = [];
for (i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}


// 声明式
let makes = cars.map(function(car){ return car.make; });


// 命令式
var authenticate = function(form) {
  var user = toUser(form);
  return logIn(user);
};

// 声明式
var authenticate = compose(logIn, toUser);