# [bdv2-theme-converter](https://github.com/ObserverOfTime/bdv2-theme-converter)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ObserverOfTime/bdv2-theme-converter/blob/master/LICENSE) [![version](https://img.shields.io/github/package-json/v/ObserverOfTime/bdv2-theme-converter.svg)](https://github.com/ObserverOfTime/bdv2-theme-converter/blob/master/package.json)

Converts BDv2 themes to legacy BD themes and Stylus UserStyles.

## Installation

### npm

```sh
$ npm install --save ObserverOfTime/bdv2-theme-converter
```

### yarn

```sh
$ yarn add ObserverOfTime/bdv2-theme-converter
```

## Documentation

You can view the documentation [here](https://observeroftime.github.io/bdv2-theme-converter).

## Usage

```jsx
// Require the BDv2 config file
const config = require('./config');

// Set the paths
const paths = {
    root: './',
    src: 'SomeTheme.scss',
    dest: {
        legacyTheme: 'SomeTheme.theme.css',
        userStyle: 'SomeTheme.user.css',
        minified: 'SomeTheme.min.theme.css'
    }
};

// Initialise the converter
const converter = require('bdv2-theme-converter').init(config, paths);

// Convert to a legacy BD theme with compact style
converter.toLegacyTheme({outputStyle: 'compact'});

// Convert to a UserStyle with expanded style and MIT license
converter.toUserStyle({outputStyle: 'expanded'}, {license: 'MIT'});

// Convert to a minified legacy BD theme
converter.toMinified({}, true);
```

## Dependencies [![dependency status](https://img.shields.io/david/ObserverOfTime/bdv2-theme-converter/master.svg)](https://david-dm.org/ObserverOfTime/bdv2-theme-converter/master)

- [node-sass](https://ghub.io/node-sass): Wrapper around libsass
- [semver](https://ghub.io/semver): The semantic version parser used by npm.
- [to-title-case](https://ghub.io/to-title-case): Convert a string to title case.
- [usercss-meta](https://ghub.io/usercss-meta): Parse the metadata of usercss used by Stylus extension

## Dev Dependencies [![devDependency status](https://img.shields.io/david/dev/ObserverOfTime/bdv2-theme-converter/master.svg)](https://david-dm.org/ObserverOfTime/bdv2-theme-converter/master#info=devDependencies)

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [jsdoc](https://ghub.io/jsdoc): An API documentation generator for JavaScript.
- [postman-jsdoc-theme](https://ghub.io/postman-jsdoc-theme): A JSDoc Theme / Template

## TODO

- Parse BDv2 settings into CSS and UserCSS variables.

