const chaiLib = require('chai')
const chaiAsPromised = require('chai-as-promised')
const requestLib = require('request')
const superTestLib = require('supertest')

chai.use(chaiAsPromised)

global.chai = chaiLib
global.expect = chai.expect
global.request = requestLib
global.supertest = superTestLib
