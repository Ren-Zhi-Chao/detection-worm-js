// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

// `.`线转换驼峰
function toHump2(name) {
    return name.replace(/\.(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}


// 驼峰转换下划线
function toLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

// 首字母大写
function firstToUpCase(str) {
    str = str ? str : '';
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

export default {
    toHump, toLine, firstToUpCase, toHump2
}