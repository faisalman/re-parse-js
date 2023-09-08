const { REParse } = require('../dist/cjs');
const assert = require('assert');

describe('REParse', () => {
    describe('Direct assignment', () => {
        it('Directly assign the captured match into result properties', () => {   
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
            assert.deepEqual(re.parse(string1), { browser: 'Mozilla', version: '5.0' });
            assert.deepEqual(re.parse(string2), { browser: 'Opera', version: '1.2', major: '1' });

            const regexes2 = [
                [
                    [
                        /(https?):\/\/(\w+\.\w+)\/(.*)\?(.*)/g
                    ],
                    ['protocol', 'host', 'path', 'query']
                ]
            ];
            const urlString = 'https://faisalman.com/?ref=github';
            
            const re2 = new REParse(regexes2);
            assert.deepEqual(re2.parse(urlString), { protocol: 'https', host: 'faisalman.com', path: '', query: 'ref=github' });
        });

        it('Direct value replacement', () => {   
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
            assert.deepEqual(new REParse().use(regexes).parse(string), { browser: 'Meta', version: '100' });
        });

        it('Replace-based value replacement', () => {   
            const regexes = [
                [
                    [
                        /(comodo_dragon)\/(\d+)/i
                    ],
                    [['browser', /(\w+)_(\w{3})\w+/ig, '$1 $2cula'], 'version'] // Replace captured data, see string.replace
                ]
            ];
            const string = 'Comodo_Dragon/99';
            assert.deepEqual(new REParse().use(regexes).parse(string), { browser: 'Comodo Dracula', version: '99' });
        });

        it('Function-based value replacement', () => {   
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
            const string = 'ARM64';
            
            assert.deepEqual(new REParse().use(regexes).parse(string), { arch: 'arm', bitness: '64' });
        });

        it('Return empty object when no match was found', () => {
            assert.deepEqual(new REParse().use([[[/test/],['test']]]).parse(''), {});
        });
    });
});