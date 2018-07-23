const semver = require('semver');
const {stringify} = require('usercss-meta');
const {stripEmpty} = require('../utils');

/**
 * @function
 * @name Stylus~_quote
 * @description Quotes a string using double quotes.
 * @private
 * @param {string} str - The input string.
 * @returns {string} The quoted string.
 */
const _quote = (str) => str.replace(/^['"]*|['"]*$/g, '"');

/**
 * Class representing a Stylus Error.
 *
 * @private
 * @extends {Error}
 */
class StylusError extends Error {}

/**
 * Namespace for Stylus.
 *
 * @namespace Stylus
 * @see {@link https://github.com/openstyles/stylus|Stylus},
 * {@link https://github.com/FirefoxBar/xStyle|xStyle}
 */
const Stylus = {
  /**
   * Formats metadata into a UserStyle string.
   *
   * @param {Object} meta - The metadata to be formatted.
   * @returns {string} The formatted UserStyle string.
   * @see {@link https://github.com/openstyles/stylus/wiki/Usercss#usercss-metadata|UserCSS Metadata}
   */
  format: (meta) => {
    meta.version = semver.coerce(meta.version).raw;
    if(!semver.valid(meta.version))
      throw new StylusError('UserStyle version must follow SemVer');
    return stringify(stripEmpty(meta), {alignKeys: true, format: 'xstyle'});
  },

  /**
   * Creates a <code>@-moz-document</code> string.
   *
   * @param {Stylus.RULES} rule - The rule to use.
   * @param {string} url - The URL to use.
   * @throws Will throw an error when the rule is invalid.
   * @returns {string} The created <code>@-moz-document</code> string.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@document|MDN docs}
   */
  mozDocument: (rule, url) => {
    const found = Object.values(Stylus.RULES).find(r => (r === rule));
    if(!found) throw new StylusError('Invalid @-moz-document rule');
    return `@-moz-document ${rule}(${_quote(url)})`;
  }
};

/**
 * @enum
 * @name Stylus.RULES
 * @description Moz document rules enumeration.
 * @type {Object}
 * @readonly
 * @property {string} DOMAIN - Value: <code>domain</code>.
 * @property {string} URL - Value: <code>url</code>.
 * @property {string} PREFIX - Value: <code>url-prefix</code>.
 * @property {string} REGEXP - Value: <code>regexp</code>.
 * @see {@link https://github.com/stylish-userstyles/stylish/wiki/Valid-@-moz-document-rules|Stylish wiki}
 */
Object.defineProperty(Stylus, 'RULES', {
  enumerable: true,
  configurable: false,
  writable: false,
  value: {
    DOMAIN: 'domain',
    URL: 'url',
    PREFIX: 'url-prefix',
    REGEXP: 'regexp'
  }
});

module.exports = Stylus;

