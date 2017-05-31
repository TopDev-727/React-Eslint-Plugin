/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-stateless-function');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-stateless-function', rule, {

  valid: [
    {
      // Already a stateless function
      code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `
    }, {
      // Already a stateless (arrow) function
      code: 'const Foo = ({foo}) => <div>{foo}</div>;'
    }, {
      // Extends from PureComponent and uses props
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      // Extends from PureComponent and uses context
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.context.foo}</div>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      // Extends from PureComponent in an expression context.
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      parserOptions,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      // Has a lifecyle method
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return false;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Has a state
      code: `
        class Foo extends React.Component {
          changeState() {
            this.setState({foo: "clicked"});
          }
          render() {
            return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;
          }
        }
      `
    }, {
      // Use refs
      code: `
        class Foo extends React.Component {
          doStuff() {
            this.refs.foo.style.backgroundColor = "red";
          }
          render() {
            return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Has an additional method
      code: `
        class Foo extends React.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Has an empty (no super) constructor
      code: `
        class Foo extends React.Component {
          constructor() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Has a constructor
      code: `
        class Foo extends React.Component {
          constructor() {
            doSpecialStuffs();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Has a constructor (2)
      code: `
        class Foo extends React.Component {
          constructor() {
            foo;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      // Issue 2187
      code: `
        class Foo extends React.Component {
          constructor(props)

          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: parsers.TYPESCRIPT_ESLINT
    }, {
      // Use this.bar
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.bar}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Use this.bar (destructuring)
      code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, bar} = this;
            return <div>{foo}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Use this[bar]
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this[bar]}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Use this['bar']
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['bar']}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Can return null (ES6, React 0.14.0)
      code: `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      // Can return null (ES5, React 0.14.0)
      code: `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      // Can return null (shorthand if in return, React 0.14.0)
      code: `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      code: `
        export default (Component) => (
          class Test extends React.Component {
            componentDidMount() {}
            render() {
              return <Component />;
            }
          }
        );
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Has childContextTypes
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
        Foo.childContextTypes = {
          color: PropTypes.string
        };
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Uses a decorator
      code: `
        @foo
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Uses a called decorator
      code: `
        @foo("bar")
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      // Uses multiple decorators
      code: `
        @foo
        @bar()
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        class Child extends PureComponent {
          render() {
            return <h1>I don't</h1>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }]
    }
  ],

  invalid: [
    {
      // Only use this.props
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['props'].foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>foo</div>;
          }
        }
      `,
      output: `
        function Foo() {
          return <div>foo</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get displayName() {
            return 'Foo';
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static displayName = 'Foo';
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
        Foo.propTypes = {
          name: PropTypes.string
        };
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
        Foo.propTypes = {
          name: PropTypes.string
        };
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          props: {
            name: string;
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          constructor() {
            super();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          return <div>{foo}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, context:{bar}} = this;
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }, { bar }) {
          return <div>{foo}</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      output: `
        function Foo({ foo }) {
          if (!foo) {
            return null;
          }
          return <div>{foo}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      output: `
        function Foo({ foo }) {
          if (!foo) {
            return null;
          }
          return <div>{foo}</div>;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `,
      output: `
        function Foo() {
          return true ? <div /> : null;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static defaultProps = {
            foo: true
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
        Foo.defaultProps = {
          foo: true
        };
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get defaultProps() {
            return {
              foo: true
            };
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
        Foo.defaultProps = {
          foo: true
        };
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
        Foo.defaultProps = {
          foo: true
        };
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
        Foo.defaultProps = {
          foo: true
        };
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static contextTypes = {
            foo: PropTypes.boolean
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get contextTypes() {
            return {
              foo: PropTypes.boolean
            };
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `,
      output: `
        function Foo({}, { foo }) {
          return foo ? <div /> : null;
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should just change stateful to stateless
      code: [
        'class Foo extends Component {',
        '  render() {',
        '    return false;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  return false;',
        '}'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should rename this.props into just props
      code: [
        'class Foo extends Component {',
        '  render() {',
        '    const { foo, bar } = this.props;',
        '',
        '    return <div>{this.props.test}</div>;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const { foo, bar } = props;',
        '',
        '  return <div>{props.test}</div>;',
        '}'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should move every static prop to function props
      code: [
        'class Foo extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func',
        '  };',
        '  static displayName = \'Bar\';',
        '  static foo = \'Baz\';',
        '  render() {',
        '    const { foo, bar } = this.props;',
        '    ',
        '    return <div>{this.props.test}</div>;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const { foo, bar } = props;',
        '  ',
        '  return <div>{props.test}</div>;',
        '}',
        'Foo.propTypes = {',
        '  foo: PropTypes.func',
        '};',
        'Foo.displayName = \'Bar\';',
        'Foo.foo = \'Baz\';'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should keep formatting of source code
      code: [
        'class Foo extends Component {',
        '  static propTypes={foo: PropTypes.func};',
        '  static displayName=\'Bar\';',
        '  static foo=\'Baz\';',
        '  render() {',
        '    const {foo, bar} = this.props;',
        '    ',
        '    return <div>{this.props.test}</div>;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const {foo, bar} = props;',
        '  ',
        '  return <div>{props.test}</div>;',
        '}',
        'Foo.propTypes={foo: PropTypes.func};',
        'Foo.displayName=\'Bar\';',
        'Foo.foo=\'Baz\';'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should keep formatting of source code 2
      code: [
        'class Foo extends Component {',
        '  static propTypes={',
        '      foo: PropTypes.func};',
        '  static displayName=\'Bar\';',
        '  static foo=\'Baz\';',
        '  render() {',
        '    const {foo, bar} = this.props;',
        '    ',
        '    return <div>{this.props.test}</div>;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const {foo, bar} = props;',
        '  ',
        '  return <div>{props.test}</div>;',
        '}',
        'Foo.propTypes={',
        '    foo: PropTypes.func};',
        'Foo.displayName=\'Bar\';',
        'Foo.foo=\'Baz\';'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should keep formatting of source code while its in another block
      code: [
        '{',
        '  class Foo extends Component {',
        '    static propTypes={',
        '        foo: PropTypes.func};',
        '    static displayName=\'Bar\';',
        '    static foo=\'Baz\';',
        '    render() {',
        '      const {foo, bar} = this.props;',
        '      ',
        '      return <div>{this.props.test}</div>;',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      output: [
        '{',
        '  function Foo(props) {',
        '    const {foo, bar} = props;',
        '    ',
        '    return <div>{props.test}</div>;',
        '  }',
        '  Foo.propTypes={',
        '      foo: PropTypes.func};',
        '  Foo.displayName=\'Bar\';',
        '  Foo.foo=\'Baz\';',
        '}'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should work without render function
      code: [
        'class Foo extends Component {',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {}'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should leave as it is when class is not named
      code: [
        'let x = class extends Component {',
        '}'
      ].join('\n'),
      output: [
        'let x = class extends Component {',
        '}'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should just change stateful to stateless for default parser
      code: [
        'class Foo extends Component {',
        '  render() {',
        '    return false;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  return false;',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should rename this.props into just props for default parser
      code: [
        'class Foo extends Component {',
        '  render() {',
        '    const { foo, bar } = this.props;',
        '',
        '    return <div>{this.props.test}</div>;',
        '  }',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const { foo, bar } = props;',
        '',
        '  return <div>{props.test}</div>;',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should keep formatting of source code for default parser
      code: [
        'class Foo extends Component {',
        '  render() {',
        '    const {foo, bar} = this.props;',
        '    ',
        '    return <div>',
        '       {this.props.test}</div>;',
        '  }',
        '}',
        'Foo.propTypes={foo: PropTypes.func};',
        'Foo.displayName=\'Bar\';',
        'Foo.foo=\'Baz\';'
      ].join('\n'),
      output: [
        'function Foo(props) {',
        '  const {foo, bar} = props;',
        '  ',
        '  return <div>',
        '     {props.test}</div>;',
        '}',
        'Foo.propTypes={foo: PropTypes.func};',
        'Foo.displayName=\'Bar\';',
        'Foo.foo=\'Baz\';'
      ].join('\n'),
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should work without render function for default parser
      code: [
        'class Foo extends Component {',
        '}'
      ].join('\n'),
      output: [
        'function Foo(props) {}'
      ].join('\n'),
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // should leave as it is when class is not named for default parser
      code: [
        'let x = class extends Component {',
        '}'
      ].join('\n'),
      output: [
        'let x = class extends Component {',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }
  ]
});
