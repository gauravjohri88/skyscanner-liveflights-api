import Future, { fold, fromPromise } from 'fluture';
import isomorphicFetch from 'isomorphic-fetch';
import { chain, compose, lensProp, merge, over, set } from 'ramda';
import { format as formatUrl } from 'url';

const urlAuthentication = apiKey =>
  over(lensProp('query'), merge({ apikey: apiKey }))

const addPath = path => set(lensProp('pathname'), `apiservices/pricing/v1.0/${path || ''}`);

export const authenticateUrl = urlAuthentication(process.env.API_KEY);

export const makeUrl = path => compose(
  formatUrl, authenticateUrl, addPath(path))
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
