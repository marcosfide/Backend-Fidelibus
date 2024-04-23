const session = require('express-session');
const defaultOptions = require('./dafaultOptions');
const fileStore = require('session-file-store');

const storage = fileStore(session)

module.exports = session({
    store: new storage({
        path: `${__dirname}/file-sessions`,
        ttl: 100, //la session durará 100 segs luego expirara
        retries: 1
    }),
    ...defaultOptions
})