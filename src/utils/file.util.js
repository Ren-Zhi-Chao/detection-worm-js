const _path = require('path');
const _join = _path.join;
const fs = require('fs');

/**
 * @param startPath  起始目录文件夹路径
 * @param relative 相对的路径
 * @returns {Array}
 */
function findSync(startPath, relative) {
    let result = [];
    function finder(path) {
        const files = fs.readdirSync(path);
        files.forEach((val) => {
            let fPath = _join(path, val);
            let stats = fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath);
        });
    }
    finder(startPath);
    if (relative) result = result.map(row => _path.relative(relative, row))
    return result;
}

export default {
    findSync
}