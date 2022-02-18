# 函数式编程

简单的来说，函数式编程是一种编程范式，遵循函数式的范式去书写完整的、日常的应用程序，有着优异性能的程序，简洁且易推理的程序，以及不用每次都重新造轮子的程序。将每个部分功能进行解耦，调用不同功能组件


## 简单的例子


下面是一个不是很好的一个面向对象的实践代码

[海鸥程序](src/seagull.js)

```js
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
```

代码的内部可变状态非常难以追踪，而且，最终的答案还是错的！

下面是进行函数式的写法，最后进行了变量命名进行重新命名，将每个功能单独分开出来，是用数学的分配律进行代码简洁

[海鸥函数式处理](src/seagull1.js)

```js
let add = function(x, y){
  return x+y
}

let multiply = function(x, y){
  return x*y
}

let flock_a = 4
let flock_b = 2
let flock_c = 0

// 再应用分配律
multiply(flock_b, add(flock_a, flock_a));
```

<blockquote>由此可见，可以简单粗略的一瞥函数式的一角，可见他的功能颗粒细度</blockquote>

## 一等公民的函数

[一等公民函数](src/citizen.js)

当我们说函数是“一等公民”,其实函数真没什么特殊的，你可以像对待任何其他数据类型一样对待它们——把它们存在数组里，当作参数传递，赋值给变量...等等。

下面有一个例子


```js
const hi = name => `Hi ${name}`;
const greeting = name => hi(name);
```


用一个函数把另一个函数包起来，目的仅仅是延迟执行，真的是非常糟糕的编程习惯。

---

观察一下下面两种写法
```js
// 这行
ajaxCall(json => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = callback => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall // <-- 看，没有括号哦
```

以及下面的两个controller对比

```js
const BlogController = {
  index(posts) { return Views.index(posts); },
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};

const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

<blockquote>原本可以使用简洁的方式展示，为什么要写的那么那么复杂呢，产生不少的垃圾代码,这样做除了徒增代码量，提高维护和检索代码的成本外，没有任何用处</blockquote>


下面是为什么不这么做的原因
---

1.如果一个函数被不必要地包裹起来了，而且**发生了改动**，那么包裹它的那个函数也要做相应的变更。

比如下面函数中的如果更改为要抛出一个err的时候，之前的“胶水”代码也要跟着改

```js
httpGet('/post/2', json => renderPost(json));

//需要添加一个异常

httpGet('/post/2', (json, err) => renderPost(json, err));


//还不如下面的写法
httpGet('/post/2', renderPost);  // renderPost 将会在 httpGet 中调用，想要多少参数都行
```


2.多余的变量命名带来的是一种代码的局限性，特别容易把自己限定在特定的数据上

```js
// 只针对当前的博客
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

// 对未来的项目更友好
const compact = xs => xs.filter(x => x !== null && x !== undefined);
```
相比之下后面的命名相对可重用性相对也更高


<p style="color:red;">注意：</p>

函数式编程一定要非常小心 this 值，如果一个底层函数使用了 this，而且是以一等公民的方式被调用的，相对的话你会和this原型链这些东西纠缠不休了


```js
var fs = require('fs');

// 太可怕了
fs.readFile('freaky_friday.txt', Db.save);

// 好一点点
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```
把 Db 绑定（bind）到它自己身上以后，你就可以随心所欲地调用它的原型链式代码了


虽然this能够提高执行速度，但是还是尽可能地避免使用它，因为在函数式编程中根本用不到它


## 纯函数

<blockquote>
  纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。
</blockquote>