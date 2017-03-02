var dev = process.env.NODE_ENV === 'debug';
module.exports = Object.freeze({
    minDelay: dev ? 5000 : 6000,
    maxDelay: dev ? 15000 : 20000,
});