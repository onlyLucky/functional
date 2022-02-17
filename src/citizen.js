/*
 * @Author: pink
 * @Date: 2022-02-17 10:34:46
 * @LastEditors: pink
 * @LastEditTime: 2022-02-17 14:20:52
 * @Description: 一等公民的函数
 */
const hi = name => `hi ${name}`;

let greeting = name => hi(name);

console.log(hi) //name => `hi ${name}`
console.log(hi('jonas')) // hi jonas


// 另外一种写法
greeting = hi;
greeting("times"); // hi times


//以下代码执行只是展示一种书写样式，读写文件未添加
// 这行
ajaxCall(json => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = callback => ajaxCall(callback);

// ...就等于
const getServerStuff1 = ajaxCall // <-- 看，没有括号哦


const BlogController = {
  index(posts) { return Views.index(posts); },
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};

const BlogController1 = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};

//以下代码执行只是展示一种书写样式，读写文件未添加
httpGet('/post/2', json => renderPost(json));

//需要添加一个异常
httpGet('/post/2', (json, err) => renderPost(json, err));


httpGet('/post/2', renderPost);  // renderPost 将会在 httpGet 中调用，想要多少参数都行


// 只针对当前的博客
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

// 对未来的项目更友好
const compact = xs => xs.filter(x => x !== null && x !== undefined);



//以下代码执行只是展示一种书写样式，读写文件未添加

var fs = require('fs');

// 太可怕了
fs.readFile('freaky_friday.txt', Db.save);

// 好一点点
fs.readFile('freaky_friday.txt', Db.save.bind(Db));