// const workletsPluginOptions = {
//   bundleMode: true,
//   strictGlobal: true, // optional, but recommended
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    // ['react-native-worklets/plugin', workletsPluginOptions],
    'react-native-worklets/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
