import Future, { after, of } from 'fluture';
import {
  always,
  chain,
  compose,
  lensIndex,
  lensProp,
  map,
  partial,
  path,
  prop,
  propEq,
  view
} from 'ramda';
import { Nothing } from 'sanctuary';

import { log, logC } from '../reporter';
import { getJson, makeRequest } from '../utils';

const handleResponse = chain(res => {
  if (res.status === 304) {
    return of(Nothing());
  }
  return getJson(res);
});

const poll = compose(handleResponse, makeRequest());

const logInitialPollAttempt = logC(always('Determining if result is complete'));

export const resolvePollRes = (
  rej,
  res,
  fetchData,
  url,
  data,
  timeout = setTimeout
) => {
  if (propEq('Status', 'UpdatesComplete', data)) {
    log('Result complete');
    res(data);
  } else {
    log('Result incomplete. Retrying...');
    timeout(() => fetchData(url)(rej, res), 1000);
  }
};

export const fetchData = (url, pollEndpoint = poll, pollRes = resolvePollRes) =>
  (rej, res) => {
    pollEndpoint(url).fork(rej, partial(pollRes, [rej, res, fetchData, url]));
  };

export default chain(compose(Future, fetchData, logInitialPollAttempt));
