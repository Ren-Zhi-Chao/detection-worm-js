/**
 * 工作节点基类
 * url：https://gist.github.com/Zodiase/af44115098b20d69c531
 */
class AbstractWorker {
  constructor() {
    if (this.constructor === AbstractWorker) {
      throw new Error('Can not construct abstract class.');
    }
    if (this.task === AbstractWorker.prototype.task) {
      throw new Error('Please implement abstract method foo.');
    }
    const { parentPort } = require('worker_threads');
    parentPort.on('message', value => {
      // 转发消息给主线程
      parentPort.postMessage({ response: this.task(value), input: value })
    })
  }
  task() {
    throw new Error('Do not call abstract method task from child.');
  }
}

module.exports = AbstractWorker;