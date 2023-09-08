/*! REParse.js
    Compose a structured data from unstructured text
    using regex-based pattern matching
    https://github.com/faisalman/re-parse-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
type RegexMap = ((RegExp[] | (string | (string | RegExp | Function)[])[])[])[];
interface ResultObj {
    [key: string]: any;
}
export declare class REParse {
    private regexes;
    constructor(re?: RegexMap);
    use(re: RegexMap): REParse;
    parse(str: string): ResultObj;
}
export {};
