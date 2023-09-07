/////////////////////////////////////////////////////
/*! REParse.js
    Compose a structured data from unstructured text 
    using regex-based pattern matching
    https://github.com/faisalman/re-parse-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
////////////////////////////////////////////////////

type RegexMap = Array<[RegExp[], (string | (string | RegExp | Function)[])[]]>;

interface ResultObj {
    [key: string]: any;
}

export class REParse {

    private regexes: RegexMap | null = null;

    constructor(re?: RegexMap) {
        if (re) {
            this.use(re);
        }
        return this;
    }

    use(re: RegexMap): REParse {
        this.regexes = re;
        return this;
    }

    parse(str: string): ResultObj {
        if (!this.regexes) {
            throw new Error('RegexMap: Expect Array of RegExp');
        }
        let res: ResultObj = {};
        for (const [regs, props] of this.regexes) {
            if (!Array.isArray(regs)) {
                throw new Error('RegexMap: Expect Array of RegExp');
            }
            if (!Array.isArray(props)) {
                throw new Error('RegexMap: Expect Array for Properties Map');
            }
            for (const reg of regs) {
                if (reg instanceof RegExp) {
                    const matches = reg.exec(str);
                    if (matches) {
                        props.forEach((prop, idx) => {
                            const val = matches[idx+1];
                            if (Array.isArray(prop)) {
                                const key = prop[0];
                                if (typeof key !== 'string') {
                                    throw new Error('RegexMap: Expect String Input');
                                }
                                if (prop.length == 2) {
                                    if (typeof prop[1] === 'string') {
                                        res[key] = prop[1];
                                    } else if (typeof prop[1] === 'function') {
                                        res[key] = prop[1].call(res, val);
                                    }
                                } else if (prop.length == 3) {
                                    if (prop[1] instanceof RegExp && 
                                        typeof prop[2] === 'string') {
                                        res[key] = val.replace(prop[1], prop[2]);
                                    } else if (typeof prop[1] === 'function') {
                                        res[key] = prop[1].call(res, val, prop[2]);
                                    }
                                } else if (prop.length == 4) {
                                    if (prop[1] instanceof RegExp && 
                                        typeof prop[2] === 'string' && 
                                        typeof prop[3] === 'function') {
                                        res[key] = (prop[3]).call(res, val.replace(prop[1], prop[2]));
                                    }
                                } else {
                                    res[key] = val;
                                }
                            } else if (typeof prop === 'string') {
                                res[prop] = val;
                            }
                        });
                        if (res) return res;
                    }
                } else {
                    throw new Error('RegexMap: Expect RegExp Instance');
                }
            }
        }
        return res;
    };
}