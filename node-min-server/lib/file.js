/*
* @des 检测文件是否存在
* @param {Array} static 配置的静态文件地址
* @return Promise
* */
const path = require('path');
const fs = require('fs');
const logError = require('./log');

function isExist(static, file_name) {
    let file_path = '';
    let target = null;

    for (var i = 0; i < static.length; i++) {
        if (target = readdirWrap(path.resolve('./', static[i]))) {
            break
        }
    }

    function readdirWrap(file_path) {
        console.log(file_path)
        let target = null;

        function readdir(file_path) { // 递归检测文件是否存在
            let files = fs.readdirSync(file_path);
            if (Array.isArray(files)) {
                for (var i = 0; i < files.length; i++) {
                    let v = files[i];
                    if (files[i] == file_name) {
                        target = path.resolve(file_path, v)
                        console.log(target)
                        return target;
                    } else {
                        if (fs.statSync(path.resolve(file_path, v)).isDirectory()) {
                            readdir(path.resolve(file_path, v))
                        }
                    }
                }
            } else {
                console.log(files)
            }
        }

        readdir(file_path)
        return target
    }

    return new Promise((resolve, reject) => {
        (function (path) {
            path ? fs.open(path, 'r', (err, fd) => {
                if (err) {
                    logError(err)
                }
                fs.readFile(fd, (err, data) => {
                    resolve(data)
                })
            }) : reject(file_name)
        })(target)
    })
}

module.exports = isExist;
