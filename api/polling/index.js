import Future, { after } from 'fluture';
import { chain, compose, map, partial, path, propEq } from 'ramda';

import { getJson, makeRequest} from '../utils';

const poll = compose(getJson, makeRequest());

export const pollRes = (rej, res, fetchData, url, data, timeout = setTimeout) => {
  if (propEq('Status', 'UpdatesComplete', data)) {
    res(data);
  } else {
    timeout(() => fetchData(url)(rej, res), 1000);
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
