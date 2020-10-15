# detection-worm-js
请求页面，并使用XPATH语法进行页面解析 ([github](https://github.com/Ren-Zhi-Chao/detection-worm-js#readme))

# 安装
`npm install -S detection-worm-js`

# 引用

> NodeJS
``` javascript
const dwj = require('detection-worm-js');
const Runner = dwj.WebLoader.Runner;
const xpath = dwj.XPath;

Runner("xxxxxx").then(res => {
    const xp = new xpath(res, true);
    const param = [ ];
    console.log(xp.selector(`xpath解析字符串`, param))
})
```

> ES6
``` typescript
import { XPath, WebLoader, ObjectType } from 'detection-worm-js';

WebLoader.Runner("xxxxxx").then(res => {
    const xp = new XPath(res, true);
    const param = [ ];
    console.log(xp.selector(`xpath解析字符串`, param))
})
```
# 方法使用
## 使用`ThreadPool`可以结合`ThreadWorker`类使用： 

main.js：
``` javascript
const { ThreadPool } = require('detection-worm-js');

const workerPool = new ThreadPool().setWorkerOption(
  { filename: './ChildWorker.js' }
).start(5);

for (let i = 1; i <= 100; i++) {
  workerPool.run(i, (err, result) => {
    // 回调函数
  })
}
```

ChildWorker.js：
``` javascript
const { AbstractWorker } = require('detection-worm-js');

class Test extends AbstractWorker {

    // 重写`task`方法
    // @param param是入参
    task(param) {
    }
}

new Test();
```

