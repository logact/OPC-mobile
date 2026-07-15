const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for pnpm monorepo and MQTT Node polyfills.
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../..'),
    path.resolve(__dirname, '../../packages'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    disableHierarchicalLookup: false,
    extraNodeModules: {
      buffer: require.resolve('buffer'),
      events: require.resolve('events'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      util: require.resolve('util'),
      net: require.resolve('react-native-tcp-socket'),
      tls: require.resolve('react-native-tcp-socket'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
