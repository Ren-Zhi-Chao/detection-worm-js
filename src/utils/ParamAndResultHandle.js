import $ from '../core/object_type';

const Type = {
    text: 'text()',
    src: '@src',
    style: '@style',
    href: '@href'
}

function StringHandle(expression, param) {
    return [ { express: `${expression}/${Type[param] ? Type[param] : param}`, alias: param } ];
}

function MapHandle(expression, param) {
    const alias = param.alias;
    const attr = param.attr ? param.attr : param.alias;
    return [ { express: `${expression}/${Type[attr] ? Type[attr] : attr}`, alias, handle: param.handle } ];
}

function ArrayHandle(expression, param) {
    const result = [ ];
    param.forEach(row => {
        if ($.isString(row)) {
            result.push(...StringHandle(expression, row));
        } else if ($.isMap(row)) {
            result.push(...MapHandle(expression, row))
        }
    })
    return result;
}

const Param = (expression, param) => {
    if ($.isString(param)) return StringHandle(expression, param);
    if ($.isMap(param)) return MapHandle(expression, param);
    if ($.isArray) return ArrayHandle(expression, param);
    return [ ];
}

// [ [ ], [ ], [ ] ] 按照同级合并为 [ ]
const Result = (array = [ ]) => {
    if ( array.length < 1 ) {
        return [ ];
    }
    // 排序，将第一位设置为最长的
    array.sort((first, second) => first.length < second.length)
    const ContentMaxLength = array[0].length;
    const result = [ ];
    for (let i = 0; i < ContentMaxLength; i++) {
        let mergeMap = { };
        array.map(row => {
            const value = $.isNotNU(row[i]) ? row[i]: {  };
            mergeMap = $.mergeMap(mergeMap, value);
        });
        result.push(mergeMap);
    }
    return result;
}

const ResultNoKey = (array = [ ]) => {
   return $.mergeArray(...array)
}

export default {
    Param, Result, ResultNoKey
}