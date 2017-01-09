import { compose } from 'ramda';

import createSession from './api/session';
import pollForResults from './api/polling';

const submitQuery = compose(pollForResults, createSession);

submitQuery({
  adults: 1,
  cabinclass: 'Economy',
  originplace: 'SFO-iata',
  outbounddate: '2017-02-23',
  inbounddate: '2017-04-29',
  destinationplace: 'BOS-iata'
}).fork(
  console.error,
  console.log
);
