const {compile, serialize, middleware, prefixer, stringify} = require('stylis');
const { createSVGWindow } = require('svgdom');


function exposeGlobals(_window) {
  if (typeof global.window !== 'undefined') return;
  global.window = _window;
  global.document = _window.document;
  global.Element = _window.Element || _window.Node;
  global.Node = _window.Node;
}


function createWindow(setComputedStyle) {
  const window = createSVGWindow();
  const document = window.document;
  // matchMedia must return a MediaQueryList-like object
  window.matchMedia = (q) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; }
  });
  // document.implementation is read-only on svgdom
  try {
    Object.defineProperty(document, 'implementation', {
      configurable: true,
      value: { hasFeature: () => false }
    });
  } catch (e) { /* ignore */ }
  window.setComputedStyle = setComputedStyle;
  return window;
}


function svgdomCss(txt) {
  const SELECTOR = [];
  const CONTENT = [];

  function setComputedStyle(elm) {
    for (let i = 0, I = SELECTOR.length; i < I; i++) {
      for (const e of elm.querySelectorAll(SELECTOR[i])) {
        // CONTENT appended last so px values win over original em values
        e.setAttribute(
          'style',
          (e.getAttribute('style') || '') + CONTENT[i]
        );
      }
    }
  }

  // Stylis v4 middleware signature: (element, index, children, callback)
  function capturePlugin(element) {
    if (element.type !== 'rule') return;
    const s = Array.isArray(element.props)? element.props.join(', ') : String(element.props);
    if (!s || /:after|:before/.test(s)) return;
    const decls = (element.children || []).filter(c => c.type === 'decl');
    if (!decls.length) return;
    let c = decls.map(d => `${d.props}:${d.children};`).join('');
    if (/flex|webkit|moz/.test(c)) return;
    c = c.replace(/([\d.]+)r?em/g, (m, p1) => 16 * parseFloat(p1) + 'px');
    SELECTOR.push(s);
    CONTENT.push(c);
  }
  // Stylis v4 pipeline: compile → middleware(prefixer, capture, stringify)
  serialize(compile(txt), middleware([prefixer, capturePlugin, stringify]));
  return createWindow(setComputedStyle);
}


module.exports = svgdomCss;

// Expose a default window
exposeGlobals(createWindow(null));
