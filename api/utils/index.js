import Future, { fold, fromPromise } from 'fluture';
import isomorphicFetch from 'isomorphic-fetch';
import { chain, compose, lensProp, merge, over, set } from 'ramda';
import { format as formatUrl } from 'url';

export const authenticate = apiKey =>
  over(lensProp('query'), merge({ apikey: apiKey }))

const addPath = path => set(lensProp('pathname'), `apiservices/pricing/v1.0/${path || ''}`);

export const makeUrl = (path, apiKey = process.env.API_KEY) => compose(
  formatUrl, authenticate(apiKey), addPath(path))
({
  protocol: 'http',
  host: 'api.skyscanner.net'
});

export const makeRequest = config => (url, fetch = isomorphicFetch) =>
  Future((rej, res) => {
    (async () => {
      const result = await fetch(url, config);
      if (!result.ok) {
        return rej(new Error('The status returned isn\'t within the 200-299 range'));
      }
      res(result);
    })()
  });

const getJson = chain(response => fromPromise(() => response.json(), 0));
