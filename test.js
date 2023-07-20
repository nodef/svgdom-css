const fs = require('fs');
const assert = require('assert/strict');
const css = require('./');


assert(typeof window !== 'undefined');
/* (a default window is defined) */

var customcss = '.ct-label { font-family: Courier; font-weight: bold; }';
var window1 = css(customcss);
assert(window !== window1);
// -> window

var path = require.resolve('chartist/dist/index.css');
var window2 = css(fs.readFileSync(path, 'utf8'));
assert(window !== window2);
// -> window

var window3 = css(customcss + fs.readFileSync(path, 'utf8'));
assert(window !== window3);
/* (css overloading not supported, custom css must be included first!) */
// -> window
