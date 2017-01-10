import { after } from 'fluture';
import { chain, compose, lensProp, map, merge, over, partial, prop, tap } from 'ramda';
import { stringify as formatQuerystring } from 'querystring';
import { format as formatUrl, parse as parseUrl } from 'url';

import { authenticateUrl, makeRequest, makeUrl } from '../utils';

const delayResponse = chain(partial(after, [1000]));

const addUrlAuthentication = compose(formatUrl, authenticateUrl, parseUrl);

const getPollLocation = compose(
  addUrlAuthentication,
  headers => headers.get('location'),
  prop(['headers'])
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

const logSession = () => console.log('Session now accessible \n');

const logDelay = url => console.log(`Temporarily witholding session access to due to https://support.business.skyscanner.net/hc/en-us/articles/211308489-Flights-Live-Pricing?_ga=1.109063173.1468313731.1483528061#poll \n`);

export default query => compose(
  map(tap(logSession)),
  delayResponse,
  map(tap(logDelay)),
  map(getPollLocation),
  requestSession(query),
  makeUrl
)();
