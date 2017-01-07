import { after } from 'fluture';
import { chain, compose, map, partial, prop } from 'ramda';
import { stringify as formatQuerystring } from 'querystring';

import { makeRequest, makeUrl } from '../utils';

// 'Cos https://support.business.skyscanner.net/hc/en-us/articles/211308489-Flights-Live-Pricing?_ga=1.109063173.1468313731.1483528061#poll
const delayResponse = chain(partial(after, [1000]));

const getPollLocation = compose(
  delayResponse,
  map(headers => headers.get('location')),
  map(prop(['headers']))
);

const requestSession = makeRequest({
  body: formatQuerystring({
    adults: 1,
    cabinclass: 'Economy',
    country: 'UK',
    currency: 'GBP',
    destinationplace: 'BOS-iata',
    inbounddate: '2017-02-24',
    locale: 'en-GB',
    locationschema: 'iata',
    originplace: 'SFO-iata',
    outbounddate: '2017-02-23'
  }),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  method: 'POST',
})

export const createSession = compose(getPollLocation, requestSession, makeUrl);
