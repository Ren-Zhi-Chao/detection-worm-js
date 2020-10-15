const { AsyncResource } = require('async_hooks');
const { EventEmitter } = require('events');
const { Worker } = require('worker_threads');

const kTaskInfo = Symbol('kTaskInfo');

// ====== 绝对变量key ======
// 工作池
const _WORKER_POOL = Symbol('_workers');
// 空闲池
const _FREE_WORKER_POOL = Symbol('_freeWorkers');
// 任务绑定事件
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');
// ====== 绝对变量key ======

/**
 * Worker进程监听器
 */
class WorkerListener extends AsyncResource {
  constructor(callback) {
    super('WorkerListener')
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();
  }
}

/**
 * 线程池
 */
class WorkerPool extends EventEmitter {

  /**
   * 构造函数
   * @param {*} maxListenerNum  最大监听器数量
   * @param {*} workerOption 入参同`setWorkerOption`方法
   * @param {*} threadNum 线程池储量
  */
  constructor({ maxListenerNum, workerOption, threadNum } = { }) {
    super();
    if (workerOption) this.setWorkerOption(workerOption);
    this.setMaxListeners(maxListenerNum || 1000);
    this._threadNum = threadNum;
  }

  // ====== 一些相关参数取回 ======
  get threadNum() {
    return this[_WORKER_POOL].length;
  }

  get freeThreadNum() {
    return this[_FREE_WORKER_POOL].length;
  }

  get workerOption() {
    return this._workerOption;
  }
  // ====== 一些相关参数取回 ======

  /**
   * 设置Worker配置项
   * http://nodejs.cn/api/worker_threads.html#worker_threads_new_worker_filename_options
   * @param {*} workerOption Worker配置项 { filename: 同filename属性, options: options }
   */
  setWorkerOption({ filename, options }) {
    this._workerOption = { filename, options };
    return this;
  }

  /**
   * 创建线程池
   * @param {Number} num 启动线程数量
   */
  start(num) {
    num = num || this._threadNum || 0;
    // 工作池
    this[_WORKER_POOL] = [ ];
    // 空闲池
    this[_FREE_WORKER_POOL] = [ ];
    for (let i = 0; i < num; i++) {
      this.addNewWorker();
    }
    return this;
  }

  /**
   * 关闭线程池
   */
  close() {
    this[_WORKER_POOL].forEach(worker => worker.terminate());
  }

  /**
   * 重启线程池
   */
  restart() {
    this.createPool(this.threadNum);
  }

  /**
   * 添加一个Worker
   */
  addNewWorker() {
    const worker = new Worker(this._workerOption.filename, this._workerOption.options);
    worker.on('message', result => {
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this[_FREE_WORKER_POOL].push(worker);
      this.emit(kWorkerFreedEvent);
    })
    worker.on('error', err => {
      // 监听回调通知
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // 移除错误的worker任务
      this[_WORKER_POOL].splice(this[_WORKER_POOL].indexOf(worker), 1);
      // 创建新的进程
      this.addNewWorker();
      this.emit(kWorkerFreedEvent);
    })
    this[_WORKER_POOL].push(worker);
    this[_FREE_WORKER_POOL].push(worker);
    // 目前未发现有什么用 TODO
    this.emit(kWorkerFreedEvent);
  }

  /**
   * 执行任务
   * @param {*} param 方法参数
   * @param {*} callback 回调函数
   */
  run(param, callback) {
    // 如果没有空闲的连接池，则绑定一个once（只执行一次的事件），用于重新调用当前任务；
    // 其他位置的 `this.emit` 只是为了防止在连接池满了的情况时，重新调用
    if (this[_FREE_WORKER_POOL].length === 0) {
      // Q: 操作的话，如果执行任务数大于线程池数量，则会创建很多方法绑定，为什么不在绑定新事件时将之前的清空
      // A: 清空掉的话任务会消失，这么做可以理解为创建了一个任务队列，每一次`this.emit`时触发N多任务，但都会判断线程池，从而达到任务正常进行
      // Q: 如果队列后面的进来后，会不会出现重复绑定任务，而出现多次执行情况？
      // A: 按照现在看来，有可能，还未进行测试和解决！
      // A: 延迟测试后，不会重复执行：const time = Math.floor(Math.random() * 10); Deasync.sleep(time * 1000);
      this.once(kWorkerFreedEvent, () => this.run(param, callback));
      return;
    }
    const worker = this[_FREE_WORKER_POOL].pop();
    worker[kTaskInfo] = new WorkerListener(callback);
    worker.postMessage(param);
  }
}

module.exports = WorkerPool