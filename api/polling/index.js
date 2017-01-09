import { compose, map } from 'ramda';
import { format as formatUrl, parse as parseUrl } from 'url';

import { authenticateUrl } from '../utils';

const addUrlAuthentication = compose(formatUrl, authenticateUrl, parseUrl);

export default map(addUrlAuthentication);
