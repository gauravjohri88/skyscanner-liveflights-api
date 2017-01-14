import { compose } from 'ramda';

import createSession from './session';
import pollForResults from './polling';

export default compose(pollForResults, createSession);
