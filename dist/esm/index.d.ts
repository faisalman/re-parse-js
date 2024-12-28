/*! REParse.js
    Compose a structured data from unstructured text
    using regex-based pattern matching
    https://github.com/faisalman/re-parse-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
export type REMap = [
    RegExp[],
    (string | [
        string,
        string
    ] | [
        string,
        Function
    ] | [
        string,
        Function,
        any
    ] | [
        string,
        RegExp,
        string
    ] | [
        string,
        RegExp,
        string,
        Function
    ])[]
][];
interface REsult {
    [key: string]: any;
}
export declare class REParse {
    private remap;
    constructor(remap?: REMap);
    use(remap: REMap): REParse;
    parse(str: string): REsult;
}
export {};
