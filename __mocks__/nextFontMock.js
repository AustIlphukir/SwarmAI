// Next.js font imports are mocked to prevent runtime errors when
// testing.  This proxy returns an object with className and
// variable properties so that font components can be rendered in
// tests without requiring the actual font files【995523870122251†L670-L683】.
module.exports = new Proxy(
  {},
  {
    get: function getter() {
      return () => ({
        className: 'className',
        variable: 'variable',
        style: { fontFamily: 'fontFamily' },
      });
    },
  },
);