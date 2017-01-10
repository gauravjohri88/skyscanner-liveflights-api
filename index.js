import { compose } from 'ramda';

import createSession from './api/session';
import pollForResults from './api/polling';

export default compose(pollForResults, createSession);
