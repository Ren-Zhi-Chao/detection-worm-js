import request from 'request';
import fs from 'fs';
import _path from 'path';
import $ from './object_type';
import Deasync from 'deasync';

const SUCCESS = `
    状态：文件下载成功~
    地址：URL
    文件名：FILENAME
`;
const ERROR = `
    下载异常：TYPE
    地址：URL
    文件名：FILENAME
`;
const WRITE = `
    状态：文件写入成功
    地址：URL
    文件名：FILENAME
`;

class ImageDownload {

    // logger: ERROR 打印异常，ALL 打印所有，WRITE 写入log文件（地址同`path`）
    constructor({ url, filename, path, logger }) {
        path = path ? path : process.cwd();
        this.logger = logger ? logger : 'ALL';
        this.url = url;
        const extname =  _path.extname(url) ? _path.extname(url) : '.png';
        filename = filename ? (_path.extname(filename) ? filename : filename + extname) : url.substring(url.lastIndexOf('/') + 1);
        this.file = _path.join(path, filename);
        this.writeStream = fs.createWriteStream(this.file);
    }

    vailOptions() {
        if (!this.options) this.setOptions().init();
    }

    setOptions(options = { method: 'get', headers: { referer: this.url } }) {
        this.options = options;
        return this;
    }

    init() {
        if ($.isMap(this.options)) {
            this.options.url = this.url;
        } else {
            this.options = { url: this.url };
        }
        return this;
    }

    download(callback = { end: null, error: null, success: null }) {
        this.vailOptions();
        const http = request(this.options);
        http.pipe(this.writeStream);
        const that = this;
        http.on('end', function() {
            if ($.isFunction(callback.success)) {
                callback.success();
            } else {
                if (that.logger === 'ALL') console.log(SUCCESS.replace(/URL/g, that.url).replace(/FILENAME/g, that.file));
            }
        });
        http.on('error', function(err) {
            if ($.isFunction(callback.error)) {
                callback.error();
            } else {
                if (that.logger === 'ALL' || logger === 'ERROR') console.error(ERROR.replace(/URL/g, that.url).replace(/FILENAME/g, that.file).replace(/TYPE/g, err.code));
            }
        })
        http.on("finish", function() {
            this.writeStream.end();
            if ($.isFunction(callback.end)) {
                callback.end();
            } else {
                if (that.logger === 'ALL') console.log(WRITE.replace(/URL/g, that.url).replace(/FILENAME/g, that.file));
            }
        });
    }

    downloadSync(callback = { end: null, error: null, success: null }) {
        this.vailOptions();
        let end = false;
        const http = request(this.options);
        const that = this;
        http.pipe(this.writeStream);
        http.on('end', function() {
            if ($.isFunction(callback.success)) {
                callback.success();
            } else {
                if (that.logger === 'ALL') console.log(SUCCESS.replace(/URL/g, that.url).replace(/FILENAME/g, that.file));
            }
            end = true;
        });
        http.on('error', function(err) {
            if ($.isFunction(callback.error)) {
                callback.error();
            } else {
                if (that.logger === 'ALL' || logger === 'ERROR') console.error(ERROR.replace(/URL/g, that.url).replace(/FILENAME/g, that.file).replace(/TYPE/g, err.code));
            }
            end = true;
        })
        http.on("finish", function() {
            this.writeStream.end();
            if ($.isFunction(callback.end)) {
                callback.end();
            } else {
                if (that.logger === 'ALL') console.log(WRITE.replace(/URL/g, that.url).replace(/FILENAME/g, that.file));
            }
            end = true;
        });
        while(!end) {
            Deasync.sleep(100)
        }
    }
}

export default ImageDownload;

// new Class('必填', '可选', '可选').setOptions().init();