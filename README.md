# REParse.js
Compose a structured data from unstructured text using regex-based pattern matching. This was originally used in [UAParser.js](https://github.com/faisalman/ua-parser-js/commit/68d124c59c8fd549412ef6df8934eb4cb11f3c07), it basically just loops through a list of regexes, if a match was found then the matched data will be assigned to the result.

```sh
npm i re-parse-js
```

## Methods

`use(re: [RegExp[], REMapper[]][]): REParse`

`parse(str: string): REsult`

## Code Examples

### General Schema

```sh
[
    [
        RegExp[], 
        REMapper[]
    ],
    [
        RegExp[], 
        REMapper[]
    ],
    ...
]

where

RegExp[] => [ a list of RegExp instances that capture the values ]
REMapper[] => [ a list of rules on how to map the captured values into result properties ]
    - string                                # prop = $match 
    - [string, string]                      # prop = string
    - [string, Function]                    # prop = func($match)
    - [string, Function, any]               # prop = func($match, arg)
    - [string, RegExp, string]              # prop = $match.replace(regex, string)
    - [string, RegExp, string, Function]    # prop = func($match.replace(regex, string))
```

### 1. Directly assign the captured match into result properties

* Example 1.1: parsing user-agent

```js
const remap = [
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
const str1 = 'Mozilla/5.0';
const str2 = 'Opera/1.2';

const re = new REParse();
re.use(remap);
re.parse(str1);
// { browser: 'Mozilla', version: '5.0' }
re.parse(str2);
// { browser: 'Opera', version: '1.2', major: '1' }
```

* Example 1.2: parsing URL

```js
const remap = [
    [
        [
            /(https?):\/\/(\w+\.\w+)\/(.*)\?(.+)/
        ],
        ['protocol', 'host', 'path', 'query']
    ]
];
const urlString = 'https://faisalman.com/?ref=github';

const re = new REParse(remap);
re.parse(urlString);
// { protocol: 'https', host: 'faisalman.com', path: '', query: 'ref=github' }
```

### 2. Post-process the captured match before assigning to result

#### A. Direct value replacement

```js
const remap = [
    [
        [
            /(facebook)\/(\d+)/, 
            /(whatsapp)\/(\d+)/, 
            /(instagram)\/(\d+)/
        ],
        [['browser', 'Meta'], 'version'] // Always assign 'Meta' regardless matched value
    ]
];
const str = 'facebook/100';

new REParse().use(remap).parse(str);
// { browser: 'Meta', version: '100' }
```

#### B. Replace-based value replacement

```js
const remap = [
    [
        [
            /(comodo_dragon)\/(\d+)/i
        ],
        [['browser', /(\w+)_(\w{3})\w+/ig, '$1 $2cula'], 'version'] // Replace captured data, see string.replace
    ]
];
const str = 'Comodo_Dragon/99';

new REParse().use(remap).parse(str);
// { browser: 'Comodo Dracula', version: '99' }
```

#### C. Function-based value replacement

```js
const lowerize = str => str.toLowerCase();
const remap = [
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
const str1 = 'ARM';
const str2 = 'x86-64';

const re = new REParse()
re.use(remap)
re.parse(str1); // { arch: 'arm', bitness: '64' }
re.parse(str2); // { arch: 'x86', bitness: '64' }
```

# License

MIT License

Copyright (c) 2023-2025 Faisal Salman <<f@faisalman.com>>

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