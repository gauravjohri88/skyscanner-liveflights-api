import Future, { fold, fromPromise } from 'fluture';
import isomorphicFetch from 'isomorphic-fetch';
import { chain } from 'ramda';
import { format as formatUrl } from 'url';

export const makeUrl = (path, apiKey = process.env.API_KEY) => {
  const pathname = `apiservices/pricing/v1.0/${path || ''}`;
  return formatUrl({
    protocol: 'http',
    host: 'partners.api.skyscanner.net',
    query: { apiKey },
    pathname
  })
};

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
