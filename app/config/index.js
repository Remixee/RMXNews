'use strict';
let develop = require('./develop.js')
let production = require('./production.js')
let staging = require('./staging.js')

let config;

switch (process.env.NODE_ENV) {
    case 'develop':
        config = develop;
        break;
    case 'staging':
        config = staging;
        break;
    case 'production':
        config = production;
        break;
    default:
        console.log('!MISSED CONFIG!');
        config = develop;
}

console.log(`ENV --> ${process.env.NODE_ENV}`)

module.exports = config;