import { after } from 'fluture';
import { chain, compose, lensProp, map, merge, over, partial, prop, tap } from 'ramda';
import { stringify as formatQuerystring } from 'querystring';

import { makeRequest, makeUrl } from '../utils';

// 'Cos https://support.business.skyscanner.net/hc/en-us/articles/211308489-Flights-Live-Pricing?_ga=1.109063173.1468313731.1483528061#poll
const delayResponse = chain(partial(after, [1000]));

const getPollLocation = compose(
  delayResponse,
  map(headers => headers.get('location')),
  map(prop(['headers']))
);

export const createRequestConfig = query => {
  const config = {
    body: {
      country: 'UK',
      currency: 'GBP',
      locale: 'en-GB',
      locationschema: 'sky'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
  };
  return over(lensProp('body'), compose(formatQuerystring, merge(query)), config);
}

const requestSession = compose(
  makeRequest,
  createRequestConfig
);

const logSession = url => console.log(`Session created at ${url}`);

export default query => compose(
  map(tap(logSession)),
  getPollLocation,
  requestSession(query),
  makeUrl
)();
