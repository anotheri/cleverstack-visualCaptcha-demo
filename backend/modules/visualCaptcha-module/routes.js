module.exports = function( app, CaptchaController ) {

    app.post('/user/login',            CaptchaController._trySubmission );
    app.options('/user/login',         CaptchaController._options );

    app.get('/captcha/start/:howmany', CaptchaController._start );
    app.get('/captcha/audio/:type?',   CaptchaController._getAudio );
    app.get('/captcha/image/:index',   CaptchaController._getImage  );

};