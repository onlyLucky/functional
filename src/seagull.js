/*
 * @Author: pink
 * @Date: 2022-02-16 09:34:42
 * @LastEditors: pink
 * @LastEditTime: 2022-02-16 10:06:23
 * @Description: 海鸥程序
 */
let Flock = function(n){
  this.seagulls = n
}

Flock.prototype.conjoin = function(other){
  this.seagulls += other.seagulls
  return this
}

Flock.prototype.breed = function(other){
  this.seagulls = this.seagulls * other.seagulls
  return this
}

let flock_a = new Flock(4)
let flock_b = new Flock(2)
let flock_c = new Flock(0)

let result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls
//  32
console.log(result)

