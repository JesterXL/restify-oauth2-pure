const chai = require('chai');
const { expect } = chai;
const { stubTrue, stubFalse } = require('lodash/fp');
const {
    hasBearerToken,
    getBearerToken,
    handleAuthenticatedResource,
    makeHandleAuthenticatedResource,
    HandleAuthenticatedResourceResponse
} = require('../../lib/common/makeHandleAuthenticatedResource');
const log = console.log;

describe('lib/common/makeHandleAuthenticatedResource.js', () => {
   describe('hasBearerToken when called', ()=>{
        it('should work with good stubs', ()=> {
            const stubReq = {
                authorization: {
                    scheme: "Bearer",
                    credentials: 'mad skreet cred token'
                }
            };
            const result = hasBearerToken(stubReq);
            expect(result).to.equal(true);
        });
        it('should blow up with undefined', ()=> {
            const result = hasBearerToken(undefined);
            expect(result).to.equal(false);
        });
        it('should be false if credentials is empty', ()=> {
            const stubReq = {
                authorization: {
                    scheme: "Bearer"
                }
            };
            const result = hasBearerToken(stubReq);
            expect(result).to.equal(false);
        });
   });
   describe('getBearerToken when called', ()=> {
        it('should be true with a good stub', () => {
            const stubReq = {
                authorization: {
                    scheme: "Bearer",
                    credentials: 'mad skreet cred token'
                }
            };
            const result = getBearerToken(stubReq);
            expect(result).to.equal('mad skreet cred token');
        });
        it('should be null with no creds', () => {
            const stubReq = {
                authorization: {
                    scheme: "Bearer"
                }
            };
            const result = getBearerToken(stubReq);
            expect(result).to.equal(null);
        });
   });
   describe('handleAuthenticatedResource when called', () =>{
        const { TokenRequired, TokenAuthenticationError, TokenInvalid, Handled } = HandleAuthenticatedResourceResponse;

        it('should have a token required with default stubs', done => {
            handleAuthenticatedResource(
                {},
                {},
                stubTrue,
                {
                    hooks: {
                        authenticateToken: (token, req, callback) => callback()
                    }
                },
                stubTrue,
                stubTrue,
                stubTrue
            )
            .then(response => {
                const result = response.matchWith({
                    TokenRequired: stubTrue,
                    TokenAuthenticationError: stubFalse,
                    TokenInvalid: stubFalse,
                    Handled: stubFalse
                });
                expect(result).to.equal(true);
                done();
            })
            .catch(done);
        });
        it('should reauthenticate a token if it is bogus', done => {
            const stubReq = {
                authorization: {
                    scheme: "Bearer",
                    credentials: 'mad skreet cred token'
                },
                pause: ()=>{},
                resume: ()=>{}
            };
            handleAuthenticatedResource(
                stubReq,
                {},
                stubTrue,
                {
                    hooks: {
                        authenticateToken: (token, req, callback) => callback(new Error('intentional bad token'))
                    }
                },
                stubTrue,
                stubTrue,
                stubTrue
            )
            .then(response => {
                const result = response.matchWith({
                    TokenRequired: stubFalse,
                    TokenAuthenticationError: stubTrue,
                    TokenInvalid: stubFalse,
                    Handled: stubFalse
                });
                expect(result).to.equal(true);
                done();
            })
            .catch(done);
        });
        it('should give an invalid token with an invalid stub', done => {
            const stubReq = {
                authorization: {
                    scheme: "Bearer",
                    credentials: 'mad skreet cred token'
                },
                pause: ()=>{},
                resume: ()=>{}
            };
            handleAuthenticatedResource(
                stubReq,
                {},
                stubTrue,
                {
                    hooks: {
                        authenticateToken: (token, req, callback) => callback(undefined, false)
                    }
                },
                stubTrue,
                stubTrue,
                stubTrue
            )
            .then(response => {
                const result = response.matchWith({
                    TokenRequired: stubFalse,
                    TokenAuthenticationError: stubFalse,
                    TokenInvalid: stubTrue,
                    Handled: stubFalse
                });
                expect(result).to.equal(true);
                done();
            })
            .catch(done);
        });
        it('should handle if token is good', done => {
            const stubReq = {
                authorization: {
                    scheme: "Bearer",
                    credentials: 'mad skreet cred token'
                },
                pause: ()=>{},
                resume: ()=>{}
            };
            handleAuthenticatedResource(
                stubReq,
                {},
                stubTrue,
                {
                    hooks: {
                        authenticateToken: (token, req, callback) => callback(undefined, true)
                    }
                },
                stubTrue,
                stubTrue,
                stubTrue
            )
            .then(response => {
                const result = response.matchWith({
                    TokenRequired: stubFalse,
                    TokenAuthenticationError: stubFalse,
                    TokenInvalid: stubFalse,
                    Handled: stubTrue
                });
                expect(result).to.equal(true);
                done();
            })
            .catch(done);
        });
   });
});

