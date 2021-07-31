const path = require('path');

module.exports = {
  entry: './out/talon/main.js',
  devtool: "inline-source-map",
  output: {
    filename: 'talon.js',
    path: path.resolve(__dirname, 'ide/js'),
    devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  mode:"development"
};