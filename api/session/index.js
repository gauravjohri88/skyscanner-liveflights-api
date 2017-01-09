import { after } from 'fluture';
import { chain, compose, lensProp, map, merge, over, partial, prop } from 'ramda';
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

const requestSession = compose(makeRequest, createRequestConfig);

export const createSession = query => compose(
  getPollLocation,
  requestSession(query),
  makeUrl
)();
