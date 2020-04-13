import $ from '../core/object_type';
import _path from 'path';

const Type = {
    text: 'text()',
    src: '@src',
    style: '@style',
    href: '@href'
}

function StringHandle(express, param) {
    return [ { express: `${express}${express ? '/' : ''}${Type[param] ? Type[param] : param}`, alias: _path.basename(param) } ];
}

function MapHandle(express, param) {
    const alias = param.alias;
    const attr = param.attr ? param.attr : param.alias;
    if ($.isArray(attr)) {
        return [ { alias, handle: param.handle, express: ArrayHandle(express, attr) } ];
    }
    return [ { express: `${express}${express ? '/' : ''}${Type[attr] ? Type[attr] : attr}`, alias, handle: param.handle } ];
}

function ArrayHandle(express, param) {
    const result = [ ];
    param.forEach(row => {
        if ($.isString(row)) {
            result.push(...StringHandle(express, row));
        } else if ($.isMap(row)) {
            result.push(...MapHandle(express, row))
        }
    })
    return result;
}

const Param = (express, param) => {
    const bool = ValidateAttrArray(param);
    if (!bool) {
        if ($.isString(param)) return StringHandle(express, param);
        if ($.isMap(param)) return MapHandle(express, param);
        if ($.isArray(param)) return ArrayHandle(express, param);
    } else {
        return [  ];
    }
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

// 验证是否包含子项
const ValidateAttrArray = (param) => {
    const array = [ ];
    if ($.isMap(param)) {
        array.push(param);
    } else if ($.isArray(param)) {
        array.push(...param)
    } else {
        return false;
    }
    for (let row of array) {
        if ($.isMap(row) && $.isArray(row.attr)) {
            return true;
        }
    }
    return false;
}

export default {
    Param, Result, ResultNoKey, ValidateAttrArray
}