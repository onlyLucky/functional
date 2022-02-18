/*
 * @Author: pink
 * @Date: 2022-02-18 09:12:29
 * @LastEditors: pink
 * @LastEditTime: 2022-02-18 13:33:38
 * @Description: 纯函数
 */

const { json } = require("stream/consumers");

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

// 可缓存性
let memoize = function(f){
  let cache = {}

  return function(){
    let arg_str = JSON.stringify(arguments)
    cache[arg_str] = cache[arg_str] || f.apply(f,arguments)
    return cache[arg_str]
  }
}

let squareNumber = memoize((x)=>{return x*x})

squareNumber(4) //=>16

squareNumber(4) //=>16 // 从缓存中读取输入值为 4 的结果

squareNumber(5) //=>25

squareNumber(5) //=>25 // 从缓存中读取输入值为 4 的结果

// 通过延迟执行的方式把不纯的函数转换为纯函数
let pureHttpCall = memoize((url,params)=>{
  return ()=> {
    return $.getJSON(url,params)
  }
})

/* 
  可移植性／自文档化
*/

// 下面为展示逻辑的一份伪代码

// 不纯
let signUp = function(attrs){
  let user = saveUser(attrs)
  welcomeUser(user)
}

let saveUser = (attrs)=>{
  let user = Db.save(attrs)
  // ...
}

let welcomeUser = ()=> {
  //Email(user,...)
  //...
}

// 纯

let pureSignUp = (Db,Email,attrs)=>{
  return ()=>{
    let user = saveUser(Db,attrs)
    welcomeUser(Email,user)
  }
}

let saveUser = function(Db, attrs) {
  // ...
};

let welcomeUser = function(Email, user) {
  // ...
};

// 函数透明性
let Immutable = require('immuteable');

let decrementHP = function(play){
  return player.set('hp',player.hp-1)
}

let isSameTeam = function(player1,player2){
  return player1.team === player2.team
}

let punch = function(player,target){
  if(isSameTeam(player,target)){
    return target
  }else{
    return decrementHP(target)
  }
}

let jobe = Immutable.Map({name:'Jobe', hp: 20, team: 'red'})
let michael = Immutable.Map({name:'michael',hp: 20, team: 'green'})

punch(jobe, michael) //=> Immutable.Map({name:"Michael", hp:19, team: "green"})

