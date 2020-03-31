import request from 'request';
import fs from 'fs';
import _path from 'path';
import $ from './object_type';
import Deasync from 'deasync';

class ImageDownload {

    constructor(url, filename, path = process.cwd()) {
        this.url = url;
        const extname =  _path.extname(url) ? _path.extname(url) : '.png';
        filename = _path.extname(filename) ? filename : filename + extname;
        this.file = _path.join(path, filename);
        this.writeStream = fs.createWriteStream(this.file);
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
        const http = request(this.options);
        http.pipe(this.writeStream);
        http.on('end', function() {
            if ($.isFunction(callback.success)) {
                callback.success();
            } else {
                console.log('文件下载成功~')
            }
        });
        http.on('error', function(err) {
            if ($.isFunction(callback.error)) {
                callback.error();
            } else {
                console.log("错误信息:" + err)
            }
        })
        http.on("finish", function() {
            this.writeStream.end();
            if ($.isFunction(callback.end)) {
                callback.end();
            } else {
                console.log("文件写入成功");
            }
        });
    }

    downloadSync(callback = { end: null, error: null, success: null }) {
        let end = false;
        const http = request(this.options);
        http.pipe(this.writeStream);
        http.on('end', function() {
            if ($.isFunction(callback.success)) {
                callback.success();
            } else {
                console.log('文件下载成功~')
            }
            end = true;
        });
        http.on('error', function(err) {
            if ($.isFunction(callback.error)) {
                callback.error();
            } else {
                console.log("错误信息:" + err)
            }
            end = true;
        })
        http.on("finish", function() {
            this.writeStream.end();
            if ($.isFunction(callback.end)) {
                callback.end();
            } else {
                console.log("文件写入成功");
            }
            end = true;
        });
        while(!end) {
            Deasync.sleep(100)
        }
    }
}

export default ImageDownload;