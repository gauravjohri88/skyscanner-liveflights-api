import Future, { fold, fromPromise } from 'fluture';
import isomorphicFetch from 'isomorphic-fetch';
import { chain, compose, lensProp, map, merge, over, set, tap } from 'ramda';
import { format as formatUrl } from 'url';

import ApiError from '../error';

const urlAuthentication = apiKey =>
  over(lensProp('query'), merge({ apikey: apiKey }));

const addPath = path =>
  set(lensProp('pathname'), `apiservices/pricing/v1.0/${path || ''}`);

export const authenticateUrl = urlAuthentication(process.env.API_KEY);

export const log = cb => map(tap(compose(console.log, cb)));

export const makeUrl = path =>
  compose(formatUrl, authenticateUrl, addPath(path))({
    protocol: 'http',
    host: 'api.skyscanner.net'
  });

export const makeRequest = config => (url, fetch = isomorphicFetch) => Future((
  rej,
  res
) => {
  (async () => {
    const result = await fetch(url, config);
    if (!result.ok && result.status !== 304) {
      return rej(
        new ApiError(
          "The status returned isn't within the 200-299 range or a 304",
          { status: result.status, url }
        )
      );
    }
    res(result);
  })();
});

export const getJson = res => fromPromise(() => res.json(), 0);
