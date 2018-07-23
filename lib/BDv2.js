const {isEmpty, isObject} = require('../utils');

/**
 * Class representing a Config Error.
 *
 * @private
 * @extends {Error}
 */
class ConfigError extends Error {}

/**
 * Namespace for BDv2.
 *
 * @namespace BDv2
 * @see {@link https://github.com/JsSucks/BetterDiscordApp|BDv2 (inactive)},
 * {@link https://github.com/JsSucks/BetterDiscordApp/tree/toasts|Active branch},
 * {@link https://github.com/samuelthomas2774/BetterDiscordApp/tree/discord-api|Active fork}
 */
const BDv2 = {

  /**
   * Validates a BDv2 config object.
   *
   * @param {Object} config - The config object to validate.
   * @throws Will throw an error if any of the required properties are missing.
   */
  validateConfig: (config) => {
    if(!isObject(config) || isEmpty(config))
      throw new ConfigError('Missing configuration');
    if(!isObject(config.info) || isEmpty(config.info))
      throw new ConfigError('Missing theme info');
    if(!config.info.name)
      throw new ConfigError('Missing theme name');
    if(!config.info.description)
      throw new ConfigError('Missing theme description');
    if(!config.info.version)
      throw new ConfigError('Missing theme version');
    if(isEmpty(config.info.authors))
      throw new ConfigError('Missing theme author(s)');
    if(!config.main)
      throw new ConfigError('Missing main theme file');
  }
};

module.exports = BDv2;

/**
 * Object representing a theme's configuration.
 *
 * @typedef {Object} BDv2~Config
 * @property {BDv2~Info} info - The theme's info.
 * @property {string} main - The main theme file.
 * @property {Array.<Object>} [configSchemes] - The theme's settings.
 * @property {Array.<Object>} [defaultConfig] - The default settings.
 */

/**
 * Object representing a theme's info.
 *
 * @typedef {Object} BDv2~Info
 * @property {string} type - The theme's type.
 * @property {string} description - The theme's description.
 * @property {string|number} version - The theme's version.
 * @property {string} icon - The theme's icon in base64.
 * @property {Array.<BDv2~Author>} authors - The theme's authors.
 * @property {string} [source] - The theme's source URL.
 * @property {string} [website] - The theme's website URL.
 */

/**
 * Object representing a theme author.
 *
 * @typedef {Object} BDv2~Author
 * @property {string} name - The author's name.
 * @property {string} discord_id - The author's Discord ID.
 * @property {string} [github_username] - The author's GitHub username.
 * @property {string} [twitter_username] - The author's Twitter username.
 */

