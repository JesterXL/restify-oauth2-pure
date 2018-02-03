// const chai = require('chai');
// const { expect } = chai;
// const { stubTrue } = require('lodash/fp');
// const finishGrantingToken = require('../../lib/common/finishGrantingToken');

// describe.skip('lib/common/finishGrantingToken.js', () => {
//     describe('finishGrantingToken when called', ()=> {
//         it('should return BadRequest if has a scope on body that is not a string', ()=> {
//             const stubReq = {
//                 body: {
//                     scope: {}
//                 }
//             }
//             const result = finishGrantingToken(undefined, undefined, undefined, stubReq, undefined, stubTrue);
//             expect(result).to.equal(true);
//         });
//         // it('should fail with unknown type', ()=> {
//         //     const createAndFail = () => {
//         //         return makeOAuthError('chicken', 'cowtype', 'some description');
//         //     };
//         //     expect(createAndFail).to.throw(Error);
//         // });
//     });
// });