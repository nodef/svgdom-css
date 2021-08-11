const stylis = require('stylis');
const {createSVGWindow} = require('svgdom');




function exposeGlobals(_window) {
  if (typeof window !== 'undefined') return;
  window = _window;
  document = window.document;
  Element = Node = window.Node;
}

function createWindow(setComputedStyle) {
  var window = createSVGWindow();
  var document = window.document;
  window.matchMedia = () => console.log('matchMedia: NOT IMPLEMENTED!');
  document.implementation = {hasFeature: () => false};
  window.setComputedStyle = setComputedStyle;
  return window;
}




/**
 * Include custom CSS along with svgdom.
 * @param {string} txt css text (important comes first)
 * @returns window
 */
function svgdomCss(txt) {
  // Styles with computed values (px).
  const SELECTOR = [];
  const CONTENT = [];


  // Set style in px, instead of (r)em.
  function setComputedStyle(elm) {
    for (var i=0, I=SELECTOR.length; i<I; i++) {
      for (var e of elm.querySelectorAll(SELECTOR[i]))
        e.setAttribute('style', CONTENT[i]+(e.getAttribute('style')||''));
    }
  }


  // Capture styles to be replaced with computed values.
  stylis.use()((ctx, cnt, sel, par, lin, col, len) => {
    var s = sel.join(', '), c = cnt.endsWith(';')? cnt:cnt+';';
    if(s.length===0 || s.search(/\:after|\:before/g)>=0 || c.search(/flex|webkit|moz/g)>=0) return;
    c = c.replace(/([\d\.]+)r?em/g, (m, p1) => 16*parseFloat(p1)+'px');
    SELECTOR.push(s);
    CONTENT.push(c);
  });
  stylis('', txt);
  return createWindow(setComputedStyle);
}
module.exports = svgdomCss;


// Expose a default window.
exposeGlobals(createWindow(null));
