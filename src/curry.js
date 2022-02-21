/*
 * @Author: pink
 * @Date: 2022-02-21 09:02:19
 * @LastEditors: pink
 * @LastEditTime: 2022-02-21 09:53:19
 * @Description: 柯里化
 */


let add = function(x){
  return function(y){
    return x+y;
  }
}

let increment = add(1);
let addTen = add(10);
increment(2) // 3
addTen(10) //20

let curry = require('lodash').curry;

let match = curry(function(what,str){
  return str.match(what)
})

let replace = curry(function(what, replacement, str){
  return str.replace(what,replacement)
})

let filter = curry(function(f, ary) {
  return ary.filter(f)
})

let map = curry(function(f,ary){
  return ary.map(f)
})

console.log(match(/\s+/g,'hello World'))// [ ' ' ]
console.log(match(/\s+/g)("hello world"))// [ ' ' ]

let hasSpaces = match(/\s+/g)
hasSpaces('hello World') // [ ' ' ]
hasSpaces('hasSpaces') //null

filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]

let findSpaces = filter(hasSpaces)

findSpaces(["tori_spelling", "tori amos"]);
// ["tori amos"]