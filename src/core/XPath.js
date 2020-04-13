import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import MyError from '../utils/error.util';
import $ from './object_type';
import PAR from '../utils/ParamAndResultHandle';

class XPath {

    constructor(xml, close = false) {
        if (!xml) {
            new MyError({ code: 'XPATH_XML' })
        }
        this._xml = xml;
        this._close = close;
        this._dom = new DOMParser({ 
            errorHandler: {
                warning: () => {}
            } 
        }).parseFromString(xml);
    }

    selector(expression, options, noKey = false) {
        try {
            const param = PAR.Param(expression, options);
            const result = [ ];
            param.forEach(config => {
                if ($.isString(config.express)) {
                    result.push(this.getRowArray(config, noKey));
                }
            })
            if (noKey) {
                return [...PAR.ResultNoKey(result)];
            } else {
                return [...PAR.Result(result)];
            }
        } catch (err) {
            console.log(err)
            new MyError(!this._close).error({ code: 'XPATH_PARSE' });
            return [ ];
        }
    }

    selector1(expression, options, noKey = false) {
        try {
            const result = this.selector(expression, options, noKey);
            return result.length > 0 ? result[0] : { };
        } catch (err) {
            if (!this._close) new MyError().error({ code: 'XPATH_PARSE' });
            return { };
        }
    }

    /**
     * 爬取当前页面中的子页面，参数是否相同域
     */
    Spiderman(_same_area = true) {
        return $.httpString(this._xml);
    }

    getRowArray(config, noKey) {
        const all = xpath.select(config.express, this._dom);
        const rowArray = [ ];
        all.forEach(({ nodeValue }) => { 
            const domResult = config.handle? config.handle(nodeValue) : nodeValue;
            if (!noKey) {
                const rowMap = { };
                rowMap[config.alias] = `${domResult}`;
                rowArray.push(rowMap);
            } else {
                rowArray.push(`${domResult}`);
            }
        })
        return rowArray;
    }
}

export default XPath;