/**
 * @fileoverview Tests for jsx-sort-default-props
 * @author Vladimir Kattsov
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const babelEslintVersion = require('babel-eslint/package.json').version;
const semver = require('semver');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/jsx-sort-default-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-sort-default-props', rule, {
  valid: [].concat({
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    A: PropTypes.any,',
      '    Z: PropTypes.string,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      A: "A",',
      '      Z: "Z",',
      '      a: "a",',
      '      z: "z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      a: "a",',
      '      A: "A",',
      '      z: "z",',
      '      Z: "Z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      a: "a",',
      '      z: "z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    AA: PropTypes.any,',
      '    ZZ: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      AA: "AA",',
      '      ZZ: "ZZ"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.string,',
      '  z: PropTypes.string',
      '};',
      'First.propTypes.justforcheck = PropTypes.string;',
      'First.defaultProps = {',
      '  a: a,',
      '  z: z',
      '};',
      'First.defaultProps.justforcheck = "justforcheck";'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.any,',
      '  A: PropTypes.any,',
      '  z: PropTypes.string,',
      '  Z: PropTypes.string',
      '};',
      'First.defaultProps = {',
      '  a: "a",',
      '  A: "A",',
      '  z: "z",',
      '  Z: "Z"',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    b: "b",',
      '    c: "c"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "aria-controls": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "aria-controls": "aria-controls"',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{
      ignoreCase: true
    }]
  }, semver.satisfies(babelEslintVersion, '< 9') ? {
    // Invalid code, should not be validated
    code: [
      'class Component extends React.Component {',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    c: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  defaultProps: {',
      '    a: "a",',
      '    c: "c",',
      '    b: "b"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  } : [], {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.func.isRequired,',
      '    onBar: PropTypes.func,',
      '    z: PropTypes.any',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      barRequired: "barRequired",',
      '      onBar: "onBar",',
      '      z: "z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    ...c.defaultProps,',
      '    a: "a"',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    a: PropTypes.string,',
      '    b: PropTypes.string,',
      '    c: PropTypes.string,',
      '    d: PropTypes.string,',
      '    e: PropTypes.string,',
      '    f: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    a: "a",',
      '    b: "b",',
      '    ...c.defaultProps,',
      '    e: "e",',
      '    f: "f",',
      '    ...d.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'const defaults = {',
      '  b: "b"',
      '};',
      'const types = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string,',
      '  c: PropTypes.string',
      '};',
      'function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {',
      '  return <div>{a}{b}{c}</div>;',
      '}',
      'StatelessComponentWithSpreadInPropTypes.propTypes = types;',
      'StatelessComponentWithSpreadInPropTypes.defaultProps = {',
      '  c: "c",',
      '  ...defaults,',
      '  a: "a"',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'const propTypes = require(\'./externalPropTypes\')',
      'const defaultProps = require(\'./externalDefaultProps\')',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;',
      'TextFieldLabel.defaultProps = defaultProps;'
    ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'export const propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '};',
      'export const defaultProps = {',
      '    a: "a",',
      '    z: "z",',
      '};',
      'First.propTypes = propTypes;',
      'First.defaultProps = defaultProps;'
    ].join('\n')
  }, {
    code: [
      'const defaults = {',
      '  b: "b"',
      '};',
      'const First = (props) => <div />;',
      'export const propTypes = {',
      '    a: PropTypes.string,',
      '    b: PropTypes.string,',
      '    z: PropTypes.string,',
      '};',
      'export const defaultProps = {',
      '    ...defaults,',
      '    a: "a",',
      '    z: "z",',
      '};',
      'First.propTypes = propTypes;',
      'First.defaultProps = defaultProps;'
    ].join('\n')
  }),

  invalid: [{
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    c: "c",',
      '    b: "b"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 10,
      column: 5,
      type: 'Property'
    }]
    // output: [
    //   'class Component extends React.Component {',
    //   '  static propTypes = {',
    //   '    a: PropTypes.any,',
    //   '    b: PropTypes.any,',
    //   '    c: PropTypes.any',
    //   '  };',
    //   '  static defaultProps = {',
    //   '    a: "a",',
    //   '    b: "b",',
    //   '    c: "c"',
    //   '  };',
    //   '  render() {',
    //   '    return <div />;',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    c: "c",',
      '    b: "b",',
      '    a: "a"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: 2
    // output: [
    //   'class Component extends React.Component {',
    //   '  static propTypes = {',
    //   '    a: PropTypes.any,',
    //   '    b: PropTypes.any,',
    //   '    c: PropTypes.any',
    //   '  };',
    //   '  static defaultProps = {',
    //   '    a: "a",',
    //   '    b: "b",',
    //   '    c: "c"',
    //   '  };',
    //   '  render() {',
    //   '    return <div />;',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    Z: "Z",',
      '    a: "a",',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{
      ignoreCase: true
    }],
    errors: [{
      messageId: 'propsNotSorted',
      line: 8,
      column: 5,
      type: 'Property'
    }]
    // output: [
    //   'class Component extends React.Component {',
    //   '  static propTypes = {',
    //   '    a: PropTypes.any,',
    //   '    b: PropTypes.any',
    //   '  };',
    //   '  static defaultProps = {',
    //   '    a: "a",',
    //   '    Z: "Z",',
    //   '  };',
    //   '  render() {',
    //   '    return <div />;',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    Z: "Z",',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 8,
      column: 5,
      type: 'Property'
    }]
    // output: [
    //   'class Component extends React.Component {',
    //   '  static propTypes = {',
    //   '    a: PropTypes.any,',
    //   '    z: PropTypes.any',
    //   '  };',
    //   '  static defaultProps = {',
    //   '    Z: "Z",',
    //   '    a: "a",',
    //   '  };',
    //   '  render() {',
    //   '    return <div />;',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "b": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "b": "b",',
      '  "a": "a"',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 12,
      column: 3,
      type: 'Property'
    }]
    // output: [
    //   'class Hello extends React.Component {',
    //   '  render() {',
    //   '    return <div>Hello</div>;',
    //   '  }',
    //   '}',
    //   'Hello.propTypes = {',
    //   '  "a": PropTypes.string,',
    //   '  "b": PropTypes.string',
    //   '};',
    //   'Hello.defaultProps = {',
    //   '  "a": "a",',
    //   '  "b": "b"',
    //   '};'
    // ].join('\n')
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "b": PropTypes.string,',
      '  "c": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "c": "c",',
      '  "b": "b",',
      '  "a": "a"',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: 2
    // output: [
    //   'class Hello extends React.Component {',
    //   '  render() {',
    //   '    return <div>Hello</div>;',
    //   '  }',
    //   '}',
    //   'Hello.propTypes = {',
    //   '  "a": PropTypes.string,',
    //   '  "b": PropTypes.string,',
    //   '  "c": PropTypes.string',
    //   '};',
    //   'Hello.defaultProps = {',
    //   '  "a": "a",',
    //   '  "b": "b",',
    //   '  "c": "c"',
    //   '};'
    // ].join('\n')
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "B": PropTypes.string,',
      '};',
      'Hello.defaultProps = {',
      '  "a": "a",',
      '  "B": "B",',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 12,
      column: 3,
      type: 'Property'
    }]
    // output: [
    //   'class Hello extends React.Component {',
    //   '  render() {',
    //   '    return <div>Hello</div>;',
    //   '  }',
    //   '}',
    //   'Hello.propTypes = {',
    //   '  "a": PropTypes.string,',
    //   '  "B": PropTypes.string,',
    //   '};',
    //   'Hello.defaultProps = {',
    //   '  "B": "B",',
    //   '  "a": "a",',
    //   '};'
    // ].join('\n')
  }, {
  // Disabled test for comments -- fails
  //   code: [
  //     'class Hello extends React.Component {',
  //     '  render() {',
  //     '    return <div>Hello</div>;',
  //     '  }',
  //     '}',
  //     'Hello.propTypes = {',
  //     '  "a": PropTypes.string,',
  //     '  "B": PropTypes.string,',
  //     '};',
  //     'Hello.defaultProps = {',
  //     '  /* a */',
  //     '  "a": "a",',
  //     '  /* B */',
  //     '  "B": "B",',
  //     '};'
  //   ].join('\n'),
  //   parser: parsers.BABEL_ESLINT,
  //   errors: [{
  //     messageId: 'propsNotSorted',
  //     line: 14,
  //     column: 3,
  //     type: 'Property'
  //   }],
  //   output: [
  //     'class Hello extends React.Component {',
  //     '  render() {',
  //     '    return <div>Hello</div>;',
  //     '  }',
  //     '}',
  //     'Hello.propTypes = {',
  //     '  "a": PropTypes.string,',
  //     '  "B": PropTypes.string,',
  //     '};',
  //     'Hello.defaultProps = {',
  //     '  /* B */',
  //     '  "B": "B",',
  //     '  /* a */',
  //     '  "a": "a",',
  //     '};'
  //   ].join('\n')
  // }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "B": PropTypes.string,',
      '};',
      'Hello.defaultProps = {',
      '  "B": "B",',
      '  "a": "a",',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{
      ignoreCase: true
    }],
    errors: [{
      messageId: 'propsNotSorted',
      line: 12,
      column: 3,
      type: 'Property'
    }]
    // output: [
    //   'class Hello extends React.Component {',
    //   '  render() {',
    //   '    return <div>Hello</div>;',
    //   '  }',
    //   '}',
    //   'Hello.propTypes = {',
    //   '  "a": PropTypes.string,',
    //   '  "B": PropTypes.string,',
    //   '};',
    //   'Hello.defaultProps = {',
    //   '  "a": "a",',
    //   '  "B": "B",',
    //   '};'
    // ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '  z: PropTypes.string,',
      '  a: PropTypes.any,',
      '};',
      'const defaultProps = {',
      '  z: "z",',
      '  a: "a",',
      '};',
      'First.propTypes = propTypes;',
      'First.defaultProps = defaultProps;'
    ].join('\n'),
    errors: [{
      messageId: 'propsNotSorted',
      line: 8,
      column: 3,
      type: 'Property'
    }]
    // output: [
    //   'const First = (props) => <div />;',
    //   'const propTypes = {',
    //   '  z: PropTypes.string,',
    //   '  a: PropTypes.any,',
    //   '};',
    //   'const defaultProps = {',
    //   '  a: "a",',
    //   '  z: "z",',
    //   '};',
    //   'First.propTypes = propTypes;',
    //   'First.defaultProps = defaultProps;'
    // ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    a: "a",',
      '    ...c.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 9,
      column: 5,
      type: 'Property'
    }]
    // output: [
    //   'export default class ClassWithSpreadInPropTypes extends BaseClass {',
    //   '  static propTypes = {',
    //   '    b: PropTypes.string,',
    //   '    ...c.propTypes,',
    //   '    a: PropTypes.string',
    //   '  }',
    //   '  static defaultProps = {',
    //   '    a: "a",',
    //   '    b: "b",',
    //   '    ...c.defaultProps',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    a: PropTypes.string,',
      '    b: PropTypes.string,',
      '    c: PropTypes.string,',
      '    d: PropTypes.string,',
      '    e: PropTypes.string,',
      '    f: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    a: "a",',
      '    ...c.defaultProps,',
      '    f: "f",',
      '    e: "e",',
      '    ...d.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: 2
    // output: [
    //   'export default class ClassWithSpreadInPropTypes extends BaseClass {',
    //   '  static propTypes = {',
    //   '    a: PropTypes.string,',
    //   '    b: PropTypes.string,',
    //   '    c: PropTypes.string,',
    //   '    d: PropTypes.string,',
    //   '    e: PropTypes.string,',
    //   '    f: PropTypes.string',
    //   '  }',
    //   '  static defaultProps = {',
    //   '    a: "a",',
    //   '    b: "b",',
    //   '    ...c.defaultProps,',
    //   '    e: "e",',
    //   '    f: "f",',
    //   '    ...d.defaultProps',
    //   '  }',
    //   '}'
    // ].join('\n')
  }, {
    code: [
      'const defaults = {',
      '  b: "b"',
      '};',
      'const types = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string,',
      '  c: PropTypes.string',
      '};',
      'function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {',
      '  return <div>{a}{b}{c}</div>;',
      '}',
      'StatelessComponentWithSpreadInPropTypes.propTypes = types;',
      'StatelessComponentWithSpreadInPropTypes.defaultProps = {',
      '  c: "c",',
      '  a: "a",',
      '  ...defaults,',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'propsNotSorted',
      line: 15,
      column: 3,
      type: 'Property'
    }]
    // output: [
    //   'const defaults = {',
    //   '  b: "b"',
    //   '};',
    //   'const types = {',
    //   '  a: PropTypes.string,',
    //   '  b: PropTypes.string,',
    //   '  c: PropTypes.string',
    //   '};',
    //   'function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {',
    //   '  return <div>{a}{b}{c}</div>;',
    //   '}',
    //   'StatelessComponentWithSpreadInPropTypes.propTypes = types;',
    //   'StatelessComponentWithSpreadInPropTypes.defaultProps = {',
    //   '  a: "a",',
    //   '  c: "c",',
    //   '  ...defaults,',
    //   '};'
    // ].join('\n')
  }]
});
