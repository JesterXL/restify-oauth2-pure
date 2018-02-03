const chai = require('chai');
const { expect } = chai;
const validateGrantTokenRequest = require('../../lib/common/validateGrantTokenRequest');

describe('lib/common/validateGrantTokenRequest.js', () => {
    describe('validateGrantTokenRequest when called', ()=> {
        it('should work with good token', ()=> {
            const stubReq = {
                body: {
                    grant_type: 'grantType'
                },
                authorization: {
                    basic: 'basic header'
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', stubReq, next);
            expect(result).to.equal(true);
        });
        it('should fail with missing basic', ()=> {
            const stubReq = {
                body: {
                    grant_type: 'grantType'
                },
                authorization: {
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', stubReq, next);
            expect(result).to.equal(false);
        });
        it('should fail with missing auth header', ()=> {
            const stubReq = {
                body: {
                    grant_type: 'grantType'
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', stubReq, next);
            expect(result).to.equal(false);
        });
        it('should fail with wrong grantType', ()=> {
            const stubReq = {
                body: {
                    grant_type: 'grantType'
                },
                authorization: {
                    basic: 'basic header'
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('cow', stubReq, next);
            expect(result).to.equal(false);
        });
        it('should fail with missing grant_type', ()=> {
            const stubReq = {
                body: {
                },
                authorization: {
                    basic: 'basic header'
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', stubReq, next);
            expect(result).to.equal(false);
        });
        it('should fail with missing body', ()=> {
            const stubReq = {
                authorization: {
                    basic: 'basic header'
                }
            };
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', stubReq, next);
            expect(result).to.equal(false);
        });
        it('should fail with missing req', ()=> {
            const next = () => {}
            const result = validateGrantTokenRequest('grantType', {}, next);
            expect(result).to.equal(false);
        });
    });
});