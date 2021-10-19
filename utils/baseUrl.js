const baseUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://kunc-medsos.herokuapp.com';

module.exports = baseUrl;
