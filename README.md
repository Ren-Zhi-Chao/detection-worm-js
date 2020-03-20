# detection-worm-js
请求页面，并使用XPATH语法进行页面解析 ([github](https://github.com/Ren-Zhi-Chao/detection-worm-js#readme))

# 安装
`npm install -S detection-worm-js`

# 使用

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