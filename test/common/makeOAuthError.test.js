// const chai = require('chai');
// const { expect } = chai;
// const makeOAuthError = require('../../lib/common/makeOAuthError');
// const { isError } = require('lodash/fp');

// describe.skip('lib/common/makeOAuthError.js', () => {
//     describe('makeOAuthError when called', ()=> {
//         it('should work', ()=> {
//             const result = makeOAuthError('BadRequest', 'cowtype', 'some description');
//             expect(isError(result)).to.equal(true);
//         });
//         it('should fail with unknown type', ()=> {
//             const createAndFail = () => {
//                 return makeOAuthError('chicken', 'cowtype', 'some description');
//             };
//             expect(createAndFail).to.throw(Error);
//         });
//     });
// });