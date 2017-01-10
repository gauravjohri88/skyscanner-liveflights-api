import Future, { after } from 'fluture';
import { chain, compose, lensIndex, lensProp, map, partial, path, prop, propEq, view } from 'ramda';

import { getJson, makeRequest} from '../utils';

const poll = compose(getJson, makeRequest());

export const pollRes = (rej, res, fetchData, url, data, timeout = setTimeout) => {
  if (propEq('Status', 'UpdatesComplete', data)) {
    console.log('Query result complete');
    res(data);
  } else {
    console.log('Query result incomplete. Retrying...')
    timeout(() => fetchData(url)(rej, res), 3000);
  }
}

export const fetchData = (url, pollEndpoint = poll) =>
  (rej, res) => {
    pollEndpoint(url).fork(
      rej,
      partial(pollRes, [rej, res, fetchData, url])
    )
  };

export default chain(compose(Future, fetchData));
