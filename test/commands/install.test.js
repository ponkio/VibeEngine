const {expect, test} = require('@oclif/test')

describe('install', () => {
    test
    .stdout()
    .command(['install','-m', 'client'])
    .it('Runs install -m client', ctx => {
        expect(ctx.stdout).to.contain("installing client")
    })
})