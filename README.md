# skyscanner-liveflights-api

[![CircleCI](https://circleci.com/gh/jameshopkins/skyscanner-liveflights-api.svg?style=svg)](https://circleci.com/gh/jameshopkins/skyscanner-liveflights-api)
[![Coverage Status](https://coveralls.io/repos/github/jameshopkins/skyscanner-liveflights-api/badge.svg)](https://coveralls.io/github/jameshopkins/skyscanner-liveflights-api)

> A point-free, monadic JS API wrapping the [Skyscanner Live Flights API](https://github.com/Skyscanner/api-documentation/tree/master/live_flights_pricing)

## How To Use

### Compose Your Query

You can either refer to the [documentation](https://support.business.skyscanner.net/hc/en-us/articles/211308489-Flights-Live-Pricing?_ga=1.46473255.1468313731.1483528061) or use the [test harness](http://business.skyscanner.net/portal/en-GB/Documentation/FlightsLivePricingQuickStart), to obtain valid parameters.

### Initiate The API

1. Ensure that you have an `API_KEY` environment variable set, whose value is your API key.

2. Construct the query

  ```js
  import submitQuery from 'skyscanner-liveflights-api';

  submitQuery({
    adults: 1,
    cabinclass: 'Economy',
    originplace: 'SFO-iata',
    outbounddate: '2017-03-24',
    inbounddate: '2017-05-30',
    destinationplace: 'BOS-iata'
  }).fork(
    console.error,
    console.log
  );
  ```

### Notes

#### Supported parameters

Currently the only supported parameters are:

* `adults`
* `cabinclass`
* `originplace`
* `outbounddate`,
* `inbounddate`,
* `destinationplace`

#### Usage Interfaces

If you inspect the source code, you'll notice that all integral functionality is encapsulated in function compositions.

This concept means that, if required, you can build your own custom interface of `skyscanner-liveflights-api` - itself, a composition of functions.

For example, the [main entrypoint](index.js), is a composition of two other functions (`pollForResults` and `createSession`) that, when used together, make up the standard interface.

You could very easily extend this continutation. E.g

```js
import { compose, lensProp, lensIndex, map, view } from 'ramda';
import submitQuery from 'skyscanner-liveflights-api';

const focusLens = compose(lensProp('Itineraries'), lensProp(0));
const focusOnItineraryItem = map(view(focusLens)))

const getTheFirstItemInTheItinerary = compose(
  focusOnItineraryItem,
  submitQuery
);

getTheFirstItemInTheItinerary({
  adults: 1,
  cabinclass: 'Economy',
  originplace: 'SFO-iata',
  outbounddate: '2017-03-24',
  inbounddate: '2017-05-30',
  destinationplace: 'BOS-iata'
}).fork(
  console.error,
  console.log
);

```

## Running Tests
```bash
make test
# OR
make coverage
```

## Contributing
1. Fork the repo and create your branch from `master`
2. `yarn`
3. Add tests
4. Do your shizzle
5. Create a PR
