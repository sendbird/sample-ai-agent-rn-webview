const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add lodash resolver
config.resolver.alias = {
  ...config.resolver.alias,
  'lodash': 'lodash',
};

module.exports = config;