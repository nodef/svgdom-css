const fs = require('fs');
const css = require('./');
// css(<css string>)
// -> window

var customcss = '.ct-label { font-family: Courier; font-weight: bold; }';
css(customcss);
// -> window

var path = require.resolve('chartist/dist/chartist.min.css');
css(fs.readFileSync(path, 'utf8'));
// -> window

css(customcss + fs.readFileSync(path, 'utf8'));
/* (css overloading not supported, custom css must be included first!) */
// -> window
