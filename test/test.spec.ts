import { type REMap, REParse } from '../dist/esm';
import assert from 'assert';

describe('REParse', () => {
    describe('Direct assignment', () => {
        it('Directly assign the captured match into result properties', () => {   
            const remap: REMap = [
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
            const ua1 = 'Mozilla/5.0';
            const ua2 = 'Opera/1.2';
            
            const re = new REParse();
            re.use(remap);
            assert.deepEqual(re.parse(ua1), 
                { 
                    browser: 'Mozilla', 
                    version: '5.0' 
            });
            assert.deepEqual(re.parse(ua2), 
                { 
                    browser: 'Opera', 
                    version: '1.2', 
                    major: '1' 
            });

            const remap2: REMap = [
                [
                    [
                        /(https?):\/\/(\w+\.\w+)\/(.*)\?(.*)/g
                    ],
                    ['protocol', 'host', 'path', 'query']
                ]
            ];
            const urlString = 'https://faisalman.com/?ref=github';
            
            const re2 = new REParse(remap2);
            assert.deepEqual(re2.parse(urlString), 
                { 
                    protocol: 'https', 
                    host: 'faisalman.com', 
                    path: '', 
                    query: 'ref=github' 
            });
        });

        it('Direct value replacement', () => {   
            const remap: REMap = [
                [
                    [
                        /(facebook)\/(\d+)/, 
                        /(whatsapp)\/(\d+)/, 
                        /(instagram)\/(\d+)/
                    ],
                    [['browser', 'Meta'], 'version'] // Always assign 'Meta' regardless matched value
                ]
            ];
            const ua = 'facebook/100';            
            assert.deepEqual(new REParse().use(remap).parse(ua), 
                { 
                    browser: 'Meta', 
                    version: '100' 
            });
        });

        it('Replace-based value replacement', () => {   
            const remap: REMap = [
                [
                    [
                        /(comodo_dragon)\/(\d+)/i
                    ],
                    [['browser', /(\w+)_(\w{3})\w+/ig, '$1 $2cula'], 'version'] // Replace captured data, see string.replace
                ]
            ];
            const ua = 'Comodo_Dragon/99';
            assert.deepEqual(new REParse().use(remap).parse(ua), 
                {
                    browser: 'Comodo Dracula', 
                    version: '99' 
            });
        });

        it('Function-based value replacement', () => {   
            const lowerize = str => str.toLowerCase();
            const remap: REMap = [
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
            const ua = 'ARM64';
            
            assert.deepEqual(new REParse().use(remap).parse(ua), 
                { 
                    arch: 'arm', 
                    bitness: '64' 
            });
        });

        it('Return empty object when no match was found', () => {
            assert.deepEqual(new REParse().use([[[/test/],['test']]]).parse(''), {});
        });
    });
});