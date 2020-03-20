const class2type = {},
  types =
    "Null, Undefined, String, Number, Array, Object, Boolean, Date, Function, RegExp, Symbol, Set",
  UnEffectiveStr = ["null", "undefined"];

types.split(", ").forEach(str => (class2type["[object " + str + "]"] = str));

function type(obj) {
  return class2type[Object.prototype.toString.call(obj)] || "Object";
}

function isNull(obj) {
  return type(obj) === "Null";
}

function isUndefined(obj) {
  return type(obj) === "Undefined";
}

function isString(obj) {
  return type(obj) === "String";
}

function isNumber(obj) {
  return type(obj) === "Number";
}

function isArray(obj) {
  return type(obj) === "Array";
}

function isObject(obj) {
  return type(obj) === "Object";
}

function isBoolean(obj) {
  return type(obj) === "Boolean";
}

function isDate(obj) {
  return type(obj) === "Date";
}

function isFunction(obj) {
  return type(obj) === "Function";
}

function isRegExp(obj) {
  return type(obj) === "RegExp";
}

function isSymbol(obj) {
  return type(obj) === "Symbol";
}

function isSet(obj) {
  return type(obj) === "Set";
}

function trim(obj) {
  obj = String(obj);
  return obj.replace(/(^\s*)|(\s*$)/g, "");
}

function array_remove(array, value) {
  const index = findIndex(array, value);
  if (index > -1) array.splice(index, 1);
  return array;
}

function findIndex(array, value) {
  return array.findIndex(item => value === item);
}

function mapReplace(map, replace) {
  if (isObject(map) && isObject(require)) {
    const mapKeys = Object.keys(map);
    const replKeys = Object.keys(replace);
    replKeys
      .filter(key => mapKeys.includes(key))
      .map(key => (map[key] = replace[key]));
  }
  return map;
}

function effective(obj) {
  if (
    !isNull(obj) &&
    !isUndefined(obj) &&
    trim(obj).length > 0 &&
    !UnEffectiveStr.includes(obj.toString().toLowerCase())
  ) {
    return true;
  }
  return false;
}

function isNotNullOrUndefined(obj) {
  return !(isUndefined(obj) || isNull(obj))
}

// 合并map，如果key相同，设置为是否替换
function mergeMap(map1, map2, replace = false) {
  const ids = Object.keys(map1);
  ids.push(...Object.keys(map2));
  const set = new Set(ids);
  const result = { };
  set.forEach(key => {
    const has1 = map1.hasOwnProperty(key);
    const has2 = map2.hasOwnProperty(key);
    if (has1 && has2 && replace) {
      result[key] = map2[key];
    } else if (has1 && has2 && !replace) {
      result[key] = map1[key];
      result[`${key}2`] = map2[key];
    } else if (has1 && !has2) {
      result[key] = map1[key];
    } else if (!has1 && has2) {
      result[key] = map2[key];
    }
  })
  return result;
}

function mergeArray(...list) {
  const res = [];
  list.forEach(row => res.push(...row));
  const set = new Set(res);
  return [...set];
}

// 解析字符串中url
function httpString(s) {
  var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  //var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
  //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
  var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  //var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
  //v = v.replace(reg, "<a href='$1$2'>$1$2</a>"); //这里的reg就是上面的正则表达式
  //s = s.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
  // 👇 const reg = /(http[s]?:\/\/([\w-]+.)+(:\d{1,5})?(\/[\w-\.\/\?%&=]*)?)/gim;
  // 👆 str.replace(reg, (res) =>  console.log(res))
  s = s.match(reg);
  return (s)
}

// 返回一个url
function httpString1(s) {
  const result = httpString(s);
  return result ? result[0] : null;
}

//.slice(0, 1)
export default {
  type: type,
  isNull: isNull,
  isUndefined: isUndefined,
  isString: isString,
  isNumber: isNumber,
  isArray: isArray,
  isMap: isObject,
  isBoolean: isBoolean,
  isDate: isDate,
  isFunction: isFunction,
  isRegExp: isRegExp,
  isSymbol: isSymbol,
  isSet: isSet,
  effective: effective,
  trim: trim,
  array_remove: array_remove,
  findIndex: findIndex,
  mapReplace: mapReplace,
  isNotNU: isNotNullOrUndefined,
  mergeMap: mergeMap,
  httpString: httpString,
  httpString1: httpString1,
  mergeArray: mergeArray
};