const index = require('../index')

describe('Check testing env & tools', () => {
  it('Should pass the test', () => {
    expect(index(2)).to.be.eql(4);
  })
})

