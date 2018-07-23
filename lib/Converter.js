const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const utils = require('../utils');
const bd = require('./BetterDiscord');
const bdv2 = require('./BDv2');
const stylus = require('./Stylus');

/**
 * @const
 * @name Converter~_EOL
 * @description The operating system's default end of line string.
 * @private
 * @type {string}
 */
const {EOL: _EOL} = require('os');

/**
 * @function
 * @name Converter~_fullPath
 * @description Returns the absolute path of a given key.
 * @param {Converter~Paths} paths - A Paths object.
 * @param {string} key - The path key.
 * @private
 */
const _fullPath = (paths, key) => {
  const val = (key === 'src') ?
    paths.src : paths.dest[key];
  if(path.isAbsolute(val)) return val;
  return path.resolve(paths.root, val);
};

/** Class representing a Converter. */
class Converter {
  /**
   * @param {BDv2~Config} config - The BDv2 configuration file.
   * @param {Converter~Paths} [paths={}] - The file paths.
   * @param {string} [eol={@link https://nodejs.org/api/os.html#os_os_eol|os.EOL}]
   * An end of line string.
   */
  constructor(config, paths={}, eol=_EOL) {
    bdv2.validateConfig(config);

    /**
     * @name Converter#info
     * @type {BDv2~Info}
     * @description The BDv2 config's info object.
     */
    this.info = config.info;

    /**
     * @name Converter#file
     * @type {string}
     * @description The BDv2 theme's main file.
     */
    this.file = config.main;

    /**
     * @name Converter#paths
     * @type {Converter~Paths}
     * @description The file paths.
     * @default {}
     * @see {@link Converter#_defaultPath}
     */
    this.paths = paths;

    /**
     * @name Converter#EOL
     * @type {string}
     * @description An end of line string.
     * @default {@link https://nodejs.org/api/os.html#os_os_eol|os.EOL}
     * @readonly
     */
    this.EOL = eol;
  }

  /**
   * @name Converter#name
   * @type {string}
   * @description The theme's name.
   */
  get name() { return this.info.name }

  /**
   * @name Converter#meta
   * @type {BetterDiscord~Meta}
   * @description The theme's legacy metadata.
   */
  get meta() { return bd.meta(this.info) }

  set paths(paths) {
    const defaults = {root: './', src: this.file};
    defaults.dest = {
      legacyTheme: this._defaultPath(defaults.root, 'theme'),
      userStyle: this._defaultPath(defaults.root, 'user'),
      minified: this._defaultPath(defaults.root, 'min')
    };
    Object.defineProperty(this, 'paths', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: utils.merge(defaults, paths)
    });
  }

  set EOL(eol) {
    Object.defineProperty(this, 'EOL', {
      enumerable: true,
      configurable: true,
      writable: false,
      value: (/\n(\r)?|\r(\n)?/.test(eol)) ? eol : _EOL
    });
  }

  /**
   * Compiles the source file.
   *
   * @param {Converter~CompileCallback} callback
   * Callback function to execute after compilation.
   * @param {Object} [options={}]
   * Any of node-sass's <code>{@link https://github.com/sass/node-sass#options|options}</code>.
   * @throws Will throw an error when the callback is missing or isn't a function.
   * @see {@link Converter~Paths}, {@link Converter#file}
   */
  compile(callback, options={}) {
    if(typeof callback !== 'function')
      throw new TypeError('Missing callback function');
    const defaults = {
      linefeed: this.EOL
        .replace(/\n/g, 'lf')
        .replace(/\r/g, 'cr'),
      indentType: 'space',
      indentWidth: 2,
      file: _fullPath(this.paths, 'src')
    };
    const opts = utils.merge(defaults, options);
    sass.render(opts, (err, res) => {
      const ind = utils.indent(opts.indentType, opts.indentWidth);
      callback(err, (res ? res.css : null), ind);
    });
  }

  /**
   * Converts the BDv2 theme to a legacy BD theme and
   * writes it to the <code>legacyTheme</code> destination file.
   *
   * @param {Object} [options={}]
   * Any of node-sass's <code>{@link https://github.com/sass/node-sass#options|options}</code>.
   * @see {@link Converter~Paths}
   */
  toLegacyTheme(options={}) {
    this.compile((err, css) => {
      if(err) return console.error(err.message);
      const dest = _fullPath(this.paths, 'legacyTheme');
      const meta = bd.format(this.meta) + this.EOL;
      fs.writeFile(dest, meta + this.EOL + css, (error) => {
        if(error) throw error;
        const msg = 'Wrote to ' + dest;
        console.log(utils.checkMark(msg));
      });
    }, options);
  }

  /**
   * Converts the BDv2 theme to a UserStyle and
   * writes it to the <code>userStyle</code> destination file.
   *
   * @param {Object} [options={}]
   * Any of node-sass's <code>{@link https://github.com/sass/node-sass#options|options}</code>.
   * @param {Object} [extras={}] - Extra configuration for the UserStyle.
   * Will override the BDv2 config.
   * @see {@link Converter~Paths}
   */
  toUserStyle(options={}, extras={}) {
    this.compile((err, css, indent) => {
      if(err) return console.error(err.message);
      css = css.toString()
        .replace(/^/gm, indent)
        .replace(/^[\s\t]+$/gm, '');
      const dest = _fullPath(this.paths, 'userStyle');
      const info = utils.renameKeys(this.meta, {
        source: 'namespace', website: 'homepageURL'});
      if(typeof info.author === 'string')
        info.author = info.author.split(', ');
      const meta = stylus.format(utils.merge(info, extras));
      const doc = stylus.mozDocument('domain', 'discordapp.com');
      const full = meta + this.EOL + this.EOL + doc +
        ` {${this.EOL}${css}${this.EOL}}${this.EOL}`;
      fs.writeFile(dest, full, (error) => {
        if(error) throw error;
        const msg = 'Wrote to ' + dest;
        console.log(utils.checkMark(msg));
      });
    }, options);
  }

  /**
   * Minifies the BDv2 theme and writes it to the <code>minified</code> destination file.
   *
   * @param {Object} [options={}]
   * Any of node-sass's <code>{@link https://github.com/sass/node-sass#options|options}</code>
   * except for <code>outputStyle</code> which is set to <code>compressed</code>.
   * @param {Boolean} [meta=false] - Whether to add a theme META line to the file.
   * @see {@link Converter~Paths}
   */
  toMinified(options={}, meta=false) {
    options.outputStyle = 'compressed';
    this.compile((err, css) => {
      if(err) return console.error(err.message);
      let dest = _fullPath(this.paths, 'minified');
      if(meta) {
        css = bd.format(this.meta) + this.EOL + css;
        if(dest.indexOf('theme.css') < 0)
          dest = dest.replace(/\.css$/, '.theme.css');
      }
      fs.writeFile(dest, css, (error) => {
        if(error) throw error;
        const msg = 'Wrote to ' + dest;
        console.log(utils.checkMark(msg));
      });
    }, options);
  }

  /**
   * Creates the paths of the destination files when not provided.
   * Format: <code>dir/ThemeName.suffix.css</code>.
   *
   * @protected
   * @param {string} dir - The root directory of the files.
   * @param {string} suffix - The suffix of the destination file.
   * @return {string} The default path of the destination file.
   * @see {@link Converter~Paths}
   */
  _defaultPath(dir, suffix) {
    return `${path.resolve(dir)}/${this.name}.${suffix}.\css`;
  }

}

module.exports = Converter;

/**
 * Object representing the files' paths.
 *
 * @typedef {Object} Converter~Paths
 * @property {string} root - The root directory.
 * @property {string} src - The source file relative to the root.
 * @property {string} dest - The destination files relative to the root.
 * @property {string} dest.legacyTheme - The legacy BD theme file.
 * @property {string} dest.userStyle - The UserStyle theme file.
 * @property {string} dest.minified - The minified theme file.
 */

/**
 * Function that's called after compilation.
 *
 * @callback Converter~CompileCallback
 * @param {?Error} err - An error that may be thrown by sass.
 * @param {?string} css - The compiled css.
 * @param {string} [indent] - The indent string used.
 */

