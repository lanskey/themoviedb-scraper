const chaiLib = require('chai')
const nockLib = require('nock')
const fakerLib = require('faker')
const chaiAsPromised = require('chai-as-promised')
const requestLib = require('request')
const superTestLib = require('supertest')
const { apiConst } = require('./constants/api')

chaiLib.use(chaiAsPromised)

global.chai = chaiLib
global.expect = chai.expect
global.request = requestLib
global.supertest = superTestLib
global.fake = fakerLib.fake
global.faker = fakerLib
global.nock = nockLib
global.api = apiConst

const generateMultipleFakeData = function (base, length = 10) {
  const temp = []
  for (let i = 0; i < length; i++) {
    temp.push(fakerLib.fake(base))
  }
  return temp
}

global.fakeMulti = generateMultipleFakeData
