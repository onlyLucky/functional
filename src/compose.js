/*
 * @Author: pink
 * @Date: 2022-02-22 10:13:37
 * @LastEditors: pink
 * @LastEditTime: 2022-02-22 10:29:36
 * @Description: 代码组合
 */

let compose = function (f,g) {
  return function(x){
    return f(g(x))
  }
}


let toUpperCase = function(x){return x.toUpperCase()}
let exclaim = function(x){return x+'!'}

let shout = compose(exclaim,toUpperCase)

shout("Send in this clowns") //=> "SEND IN THE CLOWNS!"

let shoutOut = function(x){
  return exclaim(toUpperCase(x));
};