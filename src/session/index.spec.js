import assert from 'power-assert';
import { spy } from 'sinon';

import { stringify as formatQuerystring } from 'querystring';
import { createRequestConfig } from './';

describe('API: Session', () => {
  describe('createRequestConfig', () => {
    it('creates a fully-formed query object', () => {
      const expected = {
        body: formatQuerystring({
          adults: 1,
          cabinclass: 'Economy',
          originplace: 'SFO-iata',
          outbounddate: '2017-02-23',
          inbounddate: '2017-02-24',
          destinationplace: 'BOS-iata',
          country: 'UK',
          currency: 'GBP',
          locale: 'en-GB',
          locationschema: 'sky'
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      };

      const result = createRequestConfig({
        adults: 1,
        cabinclass: 'Economy',
        originplace: 'SFO-iata',
        outbounddate: '2017-02-23',
        inbounddate: '2017-02-24',
        destinationplace: 'BOS-iata'
      });
      assert.deepEqual(result, expected);
    });
  });
});
