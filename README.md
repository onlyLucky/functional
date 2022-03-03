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

[纯函数](src/pure_function.js)

<blockquote>
  纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。
</blockquote>

下面的案例可以帮助我们认识纯函数

```js
let xs = [1,2,3,4,5];

// 纯函数
xs.slice(0,3) //=>[1,2,3]

xs.slice(0,3) //=>[1,2,3]

//  不纯
xs.splice(0,3) //=>[1,2,3]
xs.splice(0,3) //=>[4,5]
```
两个函数的作用并无二致——但是注意,slice 符合纯函数的定义是因为对相同的输入它保证能返回相同的输出,splice可观察到的副作用是这个数组永久地改变了

下面还有一个案例，是函数更改全局变量的处理

```js
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
```
在不纯的版本中，checkAge 的结果将取决于 minimum 这个可变变量的值,它引入了外部的环境，从而增加了认知负荷


<blockquote>
1. 输入值之外的因素能够左右 checkAge 的返回值，不仅让它变得不纯，而且导致每次我们思考整个软件的时候都痛苦不堪<br>
2. 使用纯函数的形式，函数就能做到自给自足。
</blockquote>


我们也可以让 minimum 成为一个不可变（immutable）对象，这样就能保留纯粹性，因为状态不会有变化。要实现这个效果，必须得创建一个对象，然后调用 Object.freeze 方法：

```js
// 冻结外部变量
let immutableState = Object.freeze({
  minimum: 21
});
```

### 副作用可能包括

**由于使用外部的可变因素，导致该函数掺杂了本身不可控的因素**

<blockquote>副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。</blockquote>

---
副作用可能包含，但不限于：

- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态

.........等等

只要是跟函数外部环境发生的交互就都是副作用，函数式编程的哲学就是假定副作用是造成不正当行为的主要原因

如果函数需要跟外部事物打交道，那么就无法保证是纯函数这一点了

### 使用纯函数理由

#### 可缓存性（Cacheable）
纯函数总能够根据输入来做缓存。实现缓存的一种典型方式是 memoize 技术

```js
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
```

值得注意的一点是，**可以通过延迟执行的方式把不纯的函数转换为纯函数**：


```js
// 通过延迟执行的方式把不纯的函数转换为纯函数
let pureHttpCall = memoize((url,params)=>{
  return ()=> {
    return $.getJSON(url,params)
  }
})
```
我们并没有真正发送 http 请求——只是返回了一个函数，当调用它的时候才会发请求。这个函数之所以有资格成为纯函数，是因为它总是会根据相同的输入返回相同的输出：给定了 url 和 params 之后，它就只会返回同一个发送 http 请求的函数。

不过很快我们就会学习一些技巧来发掘它的用处


#### 可移植性／自文档化（Portable / Self-Documenting）

<blockquote>
纯函数是完全自给自足的，它需要的所有东西都能轻易获得<br>
纯函数的依赖很明确，因此更易于观察和理解
</blockquote>

```js
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
```

通过强迫“注入”依赖，或者把它们当作参数传递，我们的应用也更加灵活

<blockquote>面向对象语言的问题是，它们永远都要随身携带那些隐式的环境。你只需要一个香蕉，但却得到一个拿着香蕉的大猩猩...以及整个丛林</blockquote>


#### 可测试性（Testable）

<blockquote>
纯函数让测试更加容易<br>
只需简单地给函数一个输入，然后断言输出就好了<br>
Quickcheck——一个为函数式环境量身定制的测试工具
</blockquote>

#### 合理性（Reasonable）

总之代码书写的”河狸“

纯函数最大的好处是引用透明性

如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的，那么我们就说这段代码是引用透明的。

**由于纯函数总是能够根据相同的输入返回相同的输出，所以它们就能够保证总是返回同一个结果，这也就保证了引用透明性**。

等式推导带来的分析代码的能力对重构和理解代码非常重要。事实上，我们重构海鸥程序使用的正是这项技术：利用加和乘的特性

#### 并行代码

我们可以并行运行任意纯函数。因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态

并行代码在服务端 js 环境以及使用了 web worker 的浏览器那里是非常容易实现的，因为它们使用了线程

不过出于对非纯函数复杂度的考虑，当前主流观点还是避免使用这种并行

如果手头没有一些工具，那么纯函数程序写起来就有点费力,下面是一个curry 的新工具


## 柯里化 curry 

[柯里化](src/curry.js)

> curry: 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

```js
let add = function(x){
  return function(y){
    return x+y;
  }
}

let increment = add(1);
let addTen = add(10);
increment(2) // 3
addTen(10) //20
```
调用 add 之后，返回的函数就通过闭包的方式记住了 add 的第一个参数。如果想使用一次性调用的话实在烦琐。这时候就可以使用curry帮助我们。


```js
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
```
表明的是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。
这里需要使用 npm install lodash 安装 lodash


curry 函数用起来非常得心应手，每天使用它对我来说简直就是一种享受。它堪称手头必备工具，能够让函数式编程不那么繁琐和沉闷。



## 代码组合

[代码组合](src/compose.js)
下面这就是 组合（compose，以下将称之为组合）

```js
let compose = function (f,g) {
  return function(x){
    return f(g(x))
  }
}
```
将两个函数进行组合之后形成了新的函数，下面是组合函数的使用方法

```js
let toUpperCase = function(x){return x.toUpperCase()}
let exclaim = function(x){return x+'!'}

let shout = compose(exclaim,toUpperCase)

shout("Send in this clowns") //=> "SEND IN THE CLOWNS!"
```
让代码从右向左运行，而不是由内而外运行,下面我们来看一个顺序很重要的例子：

```js
let head = function(x) { return x[0]; };
let reverse = reduce(function(acc, x){ return [x].concat(acc); }, []);
let last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);//=> 'uppercut'
```
reverse 反转列表，head 取列表中的第一个元素；虽然它性能不高。这个组合中函数的执行顺序应该是显而易见的。尽管我们可以定义一个从左向右的版本，但是**从右向左执行更加能够反映数学上的含义**

```js
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
```

这个特性就是**结合律**，符合结合律意味着不管你是把 g 和 h 分到一组，还是把 f 和 g 分到一组都不重要。

> 1. 前面的例子中我们必须要写两个组合才行，但既然组合是符合结合律的，我们就可以只写一个
>
> 2. 而且想传给它多少个函数就传给它多少个，然后让它自己决定如何分组。
>
> 3. 运用结合律能为我们带来强大的灵活性，还有对执行结果不会出现意外的那种平和心态。至于稍微复杂些的可变组合,而且你也可以在类似 lodash、underscore 以及 ramda 这样的类库中找到它们的常规定义。
> 4. 结合律的一大好处是任何一个函数分组都可以被拆开来，然后再以它们自己的组合方式打包在一起
> 5. 关于如何组合，并没有标准的答案——我们只是以自己喜欢的方式搭乐高积木罢了。通常来说，最佳实践是让组合可重用，就像 last 和 angry 那样

### pointfree 模式

指的是，永远不必说出你的数据。函数无须提及将要操作的数据是什么样的。一等公民的函数、柯里化（curry）以及组合协作起来非常有助于实现这种模式。

```js
// 非 pointfree，因为提到了数据：name
var initials = function (name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('. ');
};

// pointfree
var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

initials("hunter stockton thompson");
// 'H. S. T'
```
> 1. pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。
> 2. 并非所有的函数式代码都是 pointfree 的,可以使用它的时候就使用，不能使用的时候就用普通函数


### 范畴学

> 范畴学（category theory）是数学中的一个抽象分支，能够形式化诸如集合论（set theory）、类型论（type theory）、群论（group theory）以及逻辑学（logic）等数学分支中的一些概念。


下图是一些相同的概念分别在不同理论下的形式：
[![bCTyss.png](https://s4.ax1x.com/2022/02/23/bCTyss.png)](https://imgtu.com/i/bCTyss)

在范畴学中，有一个概念叫做...范畴。有着以下这些组件（component）的搜集（collection）就构成了一个范畴：

1. 对象的搜集
> 对象就是数据类型，常我们把数据类型视作所有可能的值的一个集合（set）,把类型当作集合对待是有好处的，因为我们可以利用集合论（set theory）处理类型。
2. 态射的搜集
> 态射是标准的、普通的纯函数。
3. 态射的组合
> 本章介绍组合,compose 函数是符合结合律的，这并非巧合，结合律是在范畴学中对任何组合都适用的一个特性。

```js
var g = function(x){ return x.length; };
var f = function(x){ return x === 4; };
var isFourLetterWord = compose(f, g);
```
4. identity 这个独特的态射

下面是一个名为 id 的实用函数,这个函数接受随便什么输入然后原封不动地返回它：

```js
var id = function(x){ return x; };
```
这到底哪里有用了？id 函数跟组合一起使用简直完美。下面这个特性对所有的一元函数（unary function）（一元函数：只接受一个参数的函数） f 都成立：
```js
// identity
compose(id, f) == compose(f, id) == f;
// true
```
> 这就是实数的单位元（identity property），慢慢理解它的无用性。很快我们就会到处使用 id 了

---
> 1. 组合像一系列管道那样把不同的函数联系在一起，数据就可以也必须在其中流动——毕竟纯函数就是输入对输出，所以打破这个链条就是不尊重输出，就会让我们的应用一无是处。
> 2. 组合是高于其他所有原则的设计原则，这是因为组合让我们的代码简单而富有可读性。另外**范畴学将在应用架构、模拟副作用和保证正确性方面扮演重要角色**。

## 示例应用

### 声明式代码

在这里我们需要转变理念，从命令式转变为声明式

以SQL为例，我们不需要如何去搜索查找筛选某个数据，不用考虑取数据的方式，以后数据库升级也好，数据库引擎优化也好，就不需要更改查询语句。我们可以有多种方式解析一个表达式并得到相同的结果。

下面用一个例子对比一下

```js
// 命令式
let makes = [];
for (i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}


// 声明式
let makes = cars.map(function(car){ return car.make; });
```
命令式的循环要求你必须先实例化一个数组，而且执行完这个实例化语句之后，解释器才继续执行后面的代码。然后再直接迭代 cars 列表，手动增加计数器，把各种零零散散的东西都展示出来...实在是直白得有些露骨。

使用 map 的版本是一个表达式，它对执行顺序没有要求。而且，map 函数如何进行迭代，返回的数组如何收集，都有很大的自由度。它指明的是做什么，不是怎么做。因此，它是正儿八经的声明式代码。




---

**相关资料**

- Fowler书籍 的《重构》
- 1970 年的电影 Love Story 