var dev = process.env.NODE_ENV === 'debug';
module.exports = Object.freeze({
    minDelay: dev ? 1000 : 20,
    maxDelay: dev ? 2000 : 100,
});