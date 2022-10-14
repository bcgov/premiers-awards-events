/*!
 * Frontend router
 * File: router.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const express = require('express')
const router = express.Router()

/**
 * Serve index page from build.
 */

router.get('/', function (req, res) {
    res.sendFile('/dist/index.html');
});

/**
 * API routes.
 */

router.post('/authenticate', async (req, res, next) => {
    try {

        // user data has not been retrieved
        if (!res.locals.user)
            return next(new Error('noAuth'))

        const { guid='', username='' } = res.locals.user;

        console.log('Authenticating:', guid, username);

        // user is not properly authenticated
        if ( !guid || !username )
            return next(new Error('noAuth'));

        // successful login
        res.status(200).json({
            message: {msg: 'Authentication successful!', type: 'success'},
            user: {
                guid: guid,
                username: username
            }}
        );
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;
