import { after } from 'fluture';
import { compose, map, path } from 'ramda';
import { format as formatUrl, parse as parseUrl } from 'url';

import { authenticateUrl, getJson, makeRequest} from '../utils';

const addUrlAuthentication = compose(formatUrl, authenticateUrl, parseUrl);

const pollEndpoint = f => f.chain(compose(map(path(['Status'])), getJson, makeRequest()));

export default compose(pollEndpoint, map(addUrlAuthentication));
