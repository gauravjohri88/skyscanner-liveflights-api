import { of, reject } from 'fluture';
import assert from 'power-assert';
import { match, spy } from 'sinon';

import { fetchData, resolvePollRes } from './';

describe('API: Polling', () => {
  describe('fetchData', () => {
    it('uses the reject branch of the parent future when necessary', () => {
      const rej = spy();
      const res = null;
      const poll = () => reject('This is an error!');
      fetchData('http://moo', poll)(rej, res);
      assert(rej.calledWith('This is an error!'));
    });

    it('calls resolvePollRes to process poll result', () => {
      const rej = () => {};
      const res = () => {};
      const poll = () => of({ some: 'data' });
      const pollRes = spy();
      fetchData('http://moo', poll, pollRes)(rej, res);
      assert(
        pollRes.calledWith(rej, res, fetchData, 'http://moo', { some: 'data' })
      );
    });
  });

  describe('resolvePollRes', () => {
    it('returns data once the data is ready', () => {
      const rej = spy();
      const res = spy();
      const fetchData = spy();
      const data = { Status: 'UpdatesComplete' };

      const result = resolvePollRes(rej, res, fetchData, 'url', data);
      assert(res.calledWith(data));
    });

    describe('Repolling', () => {
      it('repolls after 1000ms', () => {
        const rej = () => {};
        const res = () => {};
        const fetchData = () => {};
        const timeout = spy();
        const data = { Status: 'UpdatesPending' };

        const result = resolvePollRes(
          rej,
          res,
          fetchData,
          'http:///www.example.com',
          data,
          timeout
        );

        assert(timeout.calledWith(match.func, 1000));
      });

      it('calls fetchData to begin loop', () => {
        const rej = spy();
        const res = spy();
        const fetchData2 = spy();
        const fetchData = spy(() => fetchData2);
        const timeout = spy();
        const data = { Status: 'UpdatesPending' };

        const result = resolvePollRes(
          rej,
          res,
          fetchData,
          'url',
          data,
          timeout
        );

        timeout.args[0][0]();
        assert(fetchData.calledWith('url'));
        assert(fetchData2.calledWith(rej, res));
      });
    });
  });
});
