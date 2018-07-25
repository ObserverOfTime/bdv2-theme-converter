const {omitKey} = require('../utils');
const _getObjectsWithKeys = (arr, key) => (
  arr.map(o => ({[o[key]]: omitKey(o, key)}))
);

/** @classdesc Class representing a VariableParser. */
class VariableParser {

  /**
   * @param {BDv2~Config|Array.<Object>} config
   * The BDv2 configuration file or its <code>defaultConfig</code>.
   * @param {Array.<Object>} [schemes]
   * The BDv2 configuration file's <code>configSchemes</code>.
   */
  constructor(config, schemes) {

    /**
     * @name VariableParser#config
     * @type {Array.<Object>}
     * @description The BDv2 theme's default settings.
     */
    this.config = config;

    /**
     * @name VariableParser#schemes
     * @type {Array.<Object>}
     * @description The BDv2 theme's config schemes.
     */
    this.schemes = schemes || config.configSchemes;
  }

  set config(config) {
    Object.defineProperty(this, 'config', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (Array.isArray(config)) ?
        config : config.defaultConfig
    });
  }

}

module.exports = VariableParser;

