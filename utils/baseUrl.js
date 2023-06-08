const baseUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://bbpvp-bekasi-inovasi-git-main-trikunc.vercel.app';

module.exports = baseUrl;
