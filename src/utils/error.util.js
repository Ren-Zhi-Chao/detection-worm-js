const ErrorType = {
    'NIL': { code: 1000, msg: '空异常。' },
    'ETIMEDOUT': { code: 1001, msg: '网络请求超时。' },
    'XPATH_XML': { code: 1002, msg: 'XPATH注册器xml输入为空。' },
    'XPATH_PARSE': { code: 1003, msg: 'XPath解析失败。'},
    'ECONNREFUSED': { code: 1004, msg: '地址访问被拒绝。' },
    'CHREEIO_XML': { code: 1005, msg: 'Chreeio解析失败。' }
}

class Error {

    constructor(options = { }) {
        Object.keys(options).forEach(key => ErrorType[key] = options[key]);
    }

    error({ code } = { code: 'NIL' }) {
        const value = ErrorType[code.toUpperCase()];
        console.error(`Error: { code: ${value.code}, message: ${value.msg} }`);
        process.exit(value.code);
    }
}

export default Error;
export {
    ErrorType
}