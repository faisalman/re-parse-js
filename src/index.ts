/////////////////////////////////////////////////////
/*! REParse.js
    Compose a structured data from unstructured text 
    using regex-based pattern matching
    https://github.com/faisalman/re-parse-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
////////////////////////////////////////////////////

export type REMap = [RegExp[], 
                        (   string |                            // prop = $match 
                            [string, string] |                  // prop = string
                            [string, Function] |                // prop = func($match)
                            [string, Function, any] |           // prop = func($match, arg)
                            [string, RegExp, string] |          // prop = $match.replace(regex, string)
                            [string, RegExp, string, Function]  // prop = func($match.replace(regex, string))
                        )[]
                    ][];

interface REsult {
    [key: string]: any;
}

export class REParse {

    private remap: REMap | null = null;

    constructor(remap?: REMap) {
        if (remap) {
            this.use(remap);
        }
        return this;
    }

    use(remap: REMap): REParse {
        this.remap = remap;
        return this;
    }

    parse(str: string): REsult {
        if (!this.remap) {
            throw new Error('REMap not set');
        }
        let res: REsult = {};
        for (const [regexes, mapper] of this.remap) {
            if (!Array.isArray(regexes)) {
                throw new Error('REMap: Expect Array of RegExp');
            }
            if (!Array.isArray(mapper)) {
                throw new Error('REMap: Expect Array for Properties Map');
            }
            for (const regex of regexes) {
                if (regex instanceof RegExp) {
                    const matches = regex.exec(str);
                    if (matches) {
                        mapper.forEach((prop, idx) => {
                            const val = matches[idx+1];
                            if (Array.isArray(prop)) {
                                const key = prop[0];
                                if (typeof key !== 'string') {
                                    throw new Error('REMap: Expect String Input');
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
                    throw new Error('REMap: Expect RegExp Instance');
                }
            }
        }
        return res;
    };
}