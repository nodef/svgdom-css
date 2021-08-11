Include custom CSS along svgdom.
> I was using this to use [chartist] on node.js.

<br>

```javascript
const css = require('svgdom-css');
const fs = require('fs');
/* (a default window is defined) */
// css(<css string>)
// -> window

var customcss = '.ct-label { font-family: Courier; font-weight: bold; }';
var window1 = css(customcss);
// -> window

var path = require.resolve('chartist/dist/chartist.min.css');
var window2 = css(fs.readFileSync(path, 'utf8'));
// -> window

var window3 = css(customcss + fs.readFileSync(path, 'utf8'));
/* (css overloading not supported, custom css must be included first!) */
// -> window
```

<br>
<br>


## References

- [svgdom :: Ulrich-Matthias Schäfer](https://www.npmjs.com/package/svgdom)
- [stylis :: Sultan](https://www.npmjs.com/package/stylis)

[chartist]: https://www.npmjs.com/package/chartist
