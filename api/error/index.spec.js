import assert from 'power-assert';
import { spy } from 'sinon';

import ApiError from './';

describe('API: Error', () => {
  it('creates a customised error instance', () => {
    const error = new ApiError('This is an error message!', {
      foo: 'bar',
      moo: 'cow'
    })
    assert.equal(error.message, 'This is an error message!');
    assert.deepEqual(error.config, {
      foo: 'bar',
      moo: 'cow'
    });
    assert(error instanceof Error);
  });
});
