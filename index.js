import { createSession } from './api/session';

createSession().fork(
  console.error,
  console.log
);
