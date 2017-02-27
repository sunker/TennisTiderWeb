var dev = process.env.NODE_ENV === 'debug';
module.exports = Object.freeze({
    minDelay: dev ? 500 : 6000,
    maxDelay: dev ? 1500 : 25000,
});