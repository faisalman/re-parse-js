"use strict";
/*! REParse.js
    Compose a structured data from unstructured text
    using regex-based pattern matching
    https://github.com/faisalman/re-parse-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REParse = void 0;
var REParse = (function () {
    function REParse(remap) {
        this.remap = null;
        if (remap) {
            this.use(remap);
        }
        return this;
    }
    REParse.prototype.use = function (remap) {
        this.remap = remap;
        return this;
    };
    REParse.prototype.parse = function (str) {
        if (!this.remap) {
            throw new Error('REMap not set');
        }
        var res = {};
        for (var _i = 0, _a = this.remap; _i < _a.length; _i++) {
            var _b = _a[_i], regexes = _b[0], mapper = _b[1];
            if (!Array.isArray(regexes)) {
                throw new Error('REMap: Expect Array of RegExp');
            }
            if (!Array.isArray(mapper)) {
                throw new Error('REMap: Expect Array for Properties Map');
            }
            var _loop_1 = function (regex) {
                if (regex instanceof RegExp) {
                    var matches_1 = regex.exec(str);
                    if (matches_1) {
                        mapper.forEach(function (prop, idx) {
                            var val = matches_1[idx + 1];
                            if (Array.isArray(prop)) {
                                var key = prop[0];
                                if (typeof key !== 'string') {
                                    throw new Error('REMap: Expect String Input');
                                }
                                if (prop.length == 2) {
                                    if (typeof prop[1] === 'string') {
                                        res[key] = prop[1];
                                    }
                                    else if (typeof prop[1] === 'function') {
                                        res[key] = prop[1].call(res, val);
                                    }
                                }
                                else if (prop.length == 3) {
                                    if (prop[1] instanceof RegExp &&
                                        typeof prop[2] === 'string') {
                                        res[key] = val.replace(prop[1], prop[2]);
                                    }
                                    else if (typeof prop[1] === 'function') {
                                        res[key] = prop[1].call(res, val, prop[2]);
                                    }
                                }
                                else if (prop.length == 4) {
                                    if (prop[1] instanceof RegExp &&
                                        typeof prop[2] === 'string' &&
                                        typeof prop[3] === 'function') {
                                        res[key] = (prop[3]).call(res, val.replace(prop[1], prop[2]));
                                    }
                                }
                                else {
                                    res[key] = val;
                                }
                            }
                            else if (typeof prop === 'string') {
                                res[prop] = val;
                            }
                        });
                        if (res)
                            return { value: res };
                    }
                }
                else {
                    throw new Error('REMap: Expect RegExp Instance');
                }
            };
            for (var _c = 0, regexes_1 = regexes; _c < regexes_1.length; _c++) {
                var regex = regexes_1[_c];
                var state_1 = _loop_1(regex);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return res;
    };
    ;
    return REParse;
}());
exports.REParse = REParse;
