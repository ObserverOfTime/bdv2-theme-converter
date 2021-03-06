const Converter = require('./lib/Converter');

/** @module bdv2-theme-converter */
module.exports = Converter;
/**
 * Initialises a Converter.
 *
 * @param {BDv2~Config} config - The BDv2 configuration file.
 * @param {Converter~Paths} [paths] - The file paths.
 * @param {string} [eol] - An end of line string.
 * @returns {Converter} - The created Converter.
 */
module.exports.init = (config, paths, eol) => {
  return new Converter(config, paths, eol);
};

