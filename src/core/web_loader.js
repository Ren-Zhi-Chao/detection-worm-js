import request from 'request';
import MyError from '../utils/error.util';
import { ErrorType } from '../utils/error.util';
import Deasync from 'deasync';

/**
 * Runner 默认参数
 */
const RunnerOptions = {
    // 超时时间
    timeout: 5000,
    // 重试次数
    retry: 5,
    // 等待时间(s)
    waiting: 2,
    // 开启log日志
    log: true
}

/**
 * 读取页面信息主入口
 * @param {*} url 请求路径
 * @param {*} timeout 超时时间
 */
function loadPage(url, timeout = RunnerOptions.timeout ) {
    return new Promise((resolve, reject) => {
        request.get(url, { timeout }, (err, res) => {
            err ? reject(err) : resolve(res.body);
        })
    })
}

/**
 * 读取页面信息主入口(不含异常)
 * @param {*} url 请求路径
 * @param {*} timeout 超时时间
 */
function loadPageNoError(url, timeout) {
    return loadPage(url, timeout).catch(err => new MyError().error(err));
}

/**
 * 执行者
 * @param {*} url 请求路径
 * @param {*} options 配置参数
 */
async function Runner(url, options = { }) {
    Object.keys(RunnerOptions).forEach(key => {
        !options[key] ? options[key] = RunnerOptions[key] : null;
    })
    let webXml = '';
    for (let i = 1; i <= options.retry; i++) {
        console.log(`${i === 1 ? '': `第 ${i} 次连接...`}发起连接请求...请稍候......`)
        webXml = await loadPage(url, options.timeout).catch(() => void 0);
        if (webXml) {
            console.log('获取成功...正在处理返回结果......')
            break;
        }
        console.log(`第 ${i} 次连接失败...${i < options.retry ? `${options.waiting}s后尝试下一次连接`: '终止连接'}......`);
        Deasync.sleep(options.waiting * 1000);
    }
    return webXml;
}

/**
 * 同步运行
 * @param { String } url 
 * @param { 配置项 } options 
 */
function RunnerSync(url, options = { }) {
    Object.keys(RunnerOptions).forEach(key => {
        !options[key] ? options[key] = RunnerOptions[key] : null;
    })
    let webXml = void 0;
    for (let i = 1; i <= options.retry; i++) {
        if (options.log) console.log(`${i === 1 ? '': `第 ${i} 次连接...`}发起连接请求...请稍候...... (预设尝试次数 ${ i } / ${ options.retry } )`)
        webXml = loadPageSync(url, options.timeout);
        if (webXml) {
            if (options.log) console.log('获取成功...正在处理返回结果......')
            break;
        }
        if (options.log) console.log(`第 ${i} 次连接失败...${i < options.retry ? `${options.waiting}s后尝试第 ${ i + 1 } 次连接`: '终止连接'}......`);
        Deasync.sleep(options.waiting * 1000);
    }
    return webXml;
}

/**
 * 同步读取页面信息主入口
 * @param {*} url 请求路径
 * @param {*} timeout 超时时间
 */
function loadPageSync(url, timeout = RunnerOptions.timeout) {
    let end = false;
    let result = void 0;
    request.get(url, { timeout }, (err, res) => {
        if (err) {
            console.error(ErrorType[err.code])
        } else {
            result = res.body;
        }
        end = true;
    })
    while(!end) {
        Deasync.sleep(100);
    }
    return result;
}

export default { loadPage, loadPageNoError, Runner, RunnerSync, loadPageSync };