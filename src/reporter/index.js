import debug from 'debug';
import { compose, tap } from 'ramda';

export const log = debug('skyscanner-liveflights-api');

export const logC = cb => tap(compose(log, cb));
