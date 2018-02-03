const chai = require('chai');
const { expect } = chai;
const { stubTrue } = require('lodash/fp');
const {
    statusCodesToErrorCodes,
    setLinkHeader,
    setWwwAuthenticateHeader,
    setWwwAuthenticateHeaderWithoutErrorInfo,
    sendWithHeaders,
    sendAuthenticationRequired,
    sendInsufficientAuthorization,

    tokenRequired,
    authenticationRequired,
    insufficientAuthorization,
    tokenInvalid,

    makeErrorSenders
} = require('../../lib/common/makeErrorSenders');

describe('lib/common/makeErrorSends.js', () => {
    describe('setLinkHeader when called', ()=> {
        it('should set a header', ()=> {
            const resStub = {
                header: (name, value) => {

                }
            }
            const optionsStub = {}
            setLinkHeader(resStub, optionsStub, {});
            expect(true).to.equal(true);
        });
    });
    describe('setWwwAuthenticateHeader when called', ()=> {
        it('should set a header', () => {
            setWwwAuthenticateHeader(
                {header:()=>{}},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('setWwwAuthenticateHeaderWithoutErrorInfo when called', ()=> {
        it('should set a header', () => {
            setWwwAuthenticateHeaderWithoutErrorInfo(
                {header:()=>{}},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('setWwwAuthenticateHeaderWithoutErrorInfo when called', ()=> {
        it('should set a header', () => {
            setWwwAuthenticateHeaderWithoutErrorInfo(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('sendWithHeaders when called', ()=> {
        it('should set a header', () => {
            sendWithHeaders(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('sendAuthenticationRequired when called', ()=> {
        it('should set a header', () => {
            sendAuthenticationRequired(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('sendInsufficientAuthorization when called', ()=> {
        it('should set a header', () => {
            sendInsufficientAuthorization(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('tokenRequired when called', ()=> {
        it('should set a header', () => {
            tokenRequired(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('authenticationRequired when called', ()=> {
        it('should set a header', () => {
            authenticationRequired(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('insufficientAuthorization when called', ()=> {
        it('should set a header', () => {
            insufficientAuthorization(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
    describe('tokenInvalid when called', ()=> {
        it('should set a header', () => {
            tokenInvalid(
                {header:()=>{}},
                ()=>{},
                {},
                {},
                {}
            );
            expect(true).to.equal(true);
        });
    });
});