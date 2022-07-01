import user from './user.js';

export default (app) => {
  app.use('/api/users', user);
};
