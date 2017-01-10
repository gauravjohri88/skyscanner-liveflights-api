import assert from 'power-assert';
import { match, spy } from 'sinon';

import { fetchData, pollRes } from './';

describe('API: Polling', () => {
  describe('pollRes', () => {
    it('returns data once the data is ready', () => {
      const rej = spy();
      const res = spy();
      const fetchData = spy();
      const data = {
        Status: 'UpdatesComplete'
      };

      const result = pollRes(rej, res, fetchData, 'url', data);
      assert(res.calledWith(data));
    });

    describe('Repolling', () => {
      it('repolls after 1000ms', () => {
        const rej = () => {};
        const res = () => {};
        const fetchData = () => {};
        const timeout = spy();
        const data = {
          Status: 'UpdatesPending'
        };

        const result = pollRes(
          rej,
          res,
          fetchData,
          'http:///www.example.com',
          data,
          timeout
        );

        assert(timeout.calledWith(match.func, 3000));
      });

      it('calls fetchData to begin loop', () => {
        const rej = spy();
        const res = spy();
        const fetchData2 = spy();
        const fetchData = spy(() => fetchData2);
        const timeout = spy();
        const data = {
          Status: 'UpdatesPending'
        };

        const result = pollRes(
          rej,
          res,
          fetchData,
          'url',
          data,
          timeout
        );

        timeout.args[0][0]();
        assert(fetchData.calledWith('url'));
        assert(fetchData2.calledWith(rej, res))
      });
    });
  });
});
