const titleCase = require('to-title-case');

/**
 * Namespace for BetterDiscord.
 *
 * @namespace BetterDiscord
 * @see {@link https://github.com/rauenzi/BetterDiscordApp|Bandaged BetterDiscord},
 * {@link https://github.com/Jiiks/BetterDiscordApp|Original BD (deprecated)}
 */
const BetterDiscord = {
  /**
   * Creates a legacy BD metadata object.
   *
   * @param {Object} data - The original metadata.
   * @returns {BetterDiscord~Meta} The legacy metadata object.
   */
  meta: (data) => ({
    name: titleCase(data.name),
    description: data.description,
    version: data.version.toString(),
    author: data.authors.map(a => a.name).join(', '),
    source: data.source,
    website: data.website
  }),

  /**
   * Formats metadata into a theme META string.
   *
   * @param {BetterDiscord~Meta} meta - The metadata to be formatted.
   * @returns {string} The formatted theme META string.
   */
  format: (meta) => `/*//META${JSON.stringify(meta)}*//*/`
};

module.exports = BetterDiscord;

/**
 * Object representing the theme's legacy metadata.
 *
 * @typedef {Object} BetterDiscord~Meta
 * @property {string} name - The theme's name in title case.
 * @property {string} description - The theme's description.
 * @property {string} version - The theme's version as a string.
 * @property {string} author - The theme's authors' names separated by a comma.
 * @property {string} [source] - The theme's source URL.
 * @property {string} [website] - The theme's website URL.
 */

