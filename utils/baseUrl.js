const baseUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://bbpvp-inovasi.netlify';

module.exports = baseUrl;
