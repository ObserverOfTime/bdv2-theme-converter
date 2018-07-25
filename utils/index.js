/** @module bdv2-theme-converter/utils */

/**
 * Renames an object's keys.
 *
 * @param {Object} obj - The source object.
 * @param {Object} newKeys
 * An object with the old keys as keys and the new keys as values.
 * @returns {Object} The source object with the keys renamed.
 */
module.exports.renameKeys = (obj, newKeys) => {
  return Object.assign({}, ...Object.keys(obj)
    .map(k => ({[(newKeys[k] || k)]: obj[k]}))
  );
};

/**
 * Merges multiple objects into one.
 * If the objects share keys, the rightmost object's value will be used.
 *
 * @param {...Object} ...obj - The objects to merge.
 * @returns {Object} The merged object.
 */
module.exports.merge = (...obj) => Object.assign({}, ...obj);

/**
 * Returns a checkmarked message.
 *
 * @param {string} msg - The original message.
 * @returns {string} The checkmarked message.
 */
module.exports.checkMark = (msg) => `  \x1b[32m\u2713\x1b[0m ${msg}`;

/**
 * Checks whether the given object is empty.
 *
 * @param {Object} obj - The object to be checked.
 * @returns {boolean}
 */
module.exports.isEmpty = (obj) => (!obj || Object.keys(obj).length === 0);

/**
 * Checks whether the given argument is an object.
 *
 * @param {*} arg - The argument to be checked.
 * @returns {boolean}
 */
module.exports.isObject = (arg) => (arg !== null && typeof arg === 'object');

/**
 * Checks whether the given argument is a finite number.
 *
 * @param {*} arg - The argument to be checked.
 * @returns {boolean}
 */
module.exports.isNumber = (arg) => {
  if(typeof arg === 'number') return isFinite(arg);
  if(!arg) return false;
  if(typeof arg === 'string' && arg.trim() !== '')
    return isFinite(Number(arg));
  return false;
};

/**
 * Returns an indent string of tabs or spaces.
 *
 * @param {string|number} type
 * Can be one of <code>tab</code> or <code>space</code>, or a number.
 * @param {number} width - The width of the indent string.
 * @throws Will throw an error on invalid type or width.
 * @returns {string} The indent string.
 */
module.exports.indent = (type, width) => {
  if(this.isNumber(type)) return ' '.repeat(parseInt(type));
  if(this.isNumber(width)) {
    if(type.match(/^tab$/i)) return '\t'.repeat(width);
    if(type.match(/^space$/i)) return ' '.repeat(width);
    throw new TypeError("Invalid indent type, expected 'tab' or 'space'");
  }
  throw new TypeError('Invalid indent width, expected a number');
};

/**
 * Removes null, undefined, and empty values from an object.
 *
 * @param {Object} obj - The object to be stripped.
 * @returns {Object} The stripped object.
 * @since 0.1.1
 */
module.exports.stripEmpty = (obj) => (
  Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    // eslint-disable-next-line no-undefined
    const empty = ['', null, undefined];
    const isEmpty = empty.includes(val) ||
      ((Array.isArray(val) && val.length === 0) ||
      (this.isObject(val) && this.isEmpty(val)));
    if(!isEmpty) acc[key] = obj[key];
    return acc;
  }, {})
);

/**
 * Creates missing directories recursively.
 *
 * @param {string} dir - The directory path to create.
 * @see {@link https://stackoverflow.com/a/41970204|SO answer}
 * @since 0.1.2
 */
module.exports.mkdirRecursive = (dir) => {
  const {sep} = require('path');
  const fs = require('fs');
  dir.split(sep)
    .reduce((currPath, folder) => {
      currPath += folder + sep;
      if(!fs.existsSync(currPath))
        fs.mkdirSync(currPath);
      return currPath;
    }, '');
};

/**
 * Creates a copy of an object with a key omitted.
 *
 * @param {Object} obj - The source object.
 * @param {string} key - The key to omit.
 * @returns {Object} A new object with the key omitted.
 * @see {@link https://stackoverflow.com/a/40699547|SO answer}
 * @since 0.2.0
 */
module.exports.omitKey = (obj, key) => {
  const {[key]: _, ...keys} = obj;
  return keys;
};

