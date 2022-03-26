'use strict';

module.exports = {
  extension: ['ts', 'tsx'],
  recursive: true,
  require: ['ts-node/register', 'source-map-support/register']
};

require.extensions['.css'] = function () {
  return null;
};
