'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://140.143.132.236:8090/"',
  BASE_API: '"http://localhost:8090/"',
  BASE_HTTP: '"http://140.143.132.236:8080/"'
})
