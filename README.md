# REParse.js
Compose a structured data from unstructured text using regex-based pattern matching. This was originally used in [UAParser.js](https://github.com/faisalman/ua-parser-js/commit/68d124c59c8fd549412ef6df8934eb4cb11f3c07), it basically just loops through a list of regexes, if a match was found then the matched data will be assigned to the result.

```sh
npm i re-parse-js
```

## Methods

`use(re: Array<[RegExp[], (string | (string | RegExp | Function)[])[]]>): REParse`

`parse(str: string): {[key: string]: any}`

## Code Examples

### 1. Directly assign the captured match into result properties

```js
const regexes = [
    [
        [
            /(mozilla)\/([\d\.]+)/i, 
            /(msie)\/([\d\.]+)/i
        ],
        ['browser', 'version']
    ],
    [
        [
            /(opera)\/((\d)\.[\d\.]+)/i
        ], 
        ['browser', 'version', 'major']
    ]
];
const string1 = 'Mozilla/5.0';
const string2 = 'Opera/1.2';

const re = new REParse();
re.use(regexes);
re.parse(string1);
// { browser: 'Mozilla', version: '5.0' }
re.parse(string2);
// { browser: 'Opera', version: '1.2', major: '1' }
```

### 2. Post-process the captured match before assigning to result

#### A. Direct value replacement

```js
const regexes = [
    [
        [
            /(facebook)\/(\d+)/, 
            /(whatsapp)\/(\d+)/, 
            /(instagram)\/(\d+)/
        ],
        [['browser', 'Meta'], 'version'] // Always assign 'Meta' regardless matched value
    ]
];
const string = 'facebook/100';

new REParse().use(regexes).parse(string);
// { browser: 'Meta', version: '100' }
```

#### B. Replace-based value replacement

```js
const regexes = [
    [
        [
            /(comodo_dragon)\/(\d+)/i
        ],
        [['browser', /(\w+)_(\w{3})\w+/ig, '$1 $2cula'], 'version'] // Replace captured data, see string.replace
    ]
];
const string = 'Comodo_Dragon/99';

new REParse().use(regexes).parse(string);
// { browser: 'Comodo Dracula', version: '99' }
```

#### C. Function-based value replacement

```js
const lowerize = str => str.toLowerCase();
const regexes = [
    [
        [
            /(ARM)(64)/
        ],
        [['arch', lowerize], 'bitness'] // Pass the captured match into function()
    ],
    [
        [
            /(x86)-(64)/
        ],
        ['arch', 'bitness'] // Direct assignment
    ]
];
const string = 'ARM';

new REParse().use(regexes).parse(string);
// { arch: 'arm', bitness: '64' }
```

# License

MIT License

Copyright (c) 2023 Faisal Salman <<f@faisalman.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.