import { compose } from 'ramda';

import createSession from './api/session';

const submitQuery = compose(createSession);

submitQuery({
  adults: 1,
  cabinclass: 'Economy',
  originplace: 'SFO-iata',
  outbounddate: '2017-02-23',
  inbounddate: '2017-02-28',
  destinationplace: 'BOS-iata'
}).fork(
  console.error,
  console.log
);
