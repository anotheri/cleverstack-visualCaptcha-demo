# Implementation visualCaptcha 5.0 with CleverStack

[The fourth version of visualCaptcha](http://clevertech.biz/devblog/implement-captcha-php-project/ "visualCaptcha 4: Implement a better CAPTCHA in your PHP project") was really good: great security and innovative accessibility solution, mobile-friendly and retina-ready design, self-hosted and open-source!

But it supported only PHP and had some unwanted dependencies. So the goal for a new version was:
> to get it super easy to implement, require no dependencies, and backend agnostic (meaning you could easily plug it in to any backend code), while providing a few backend samples.

## What is new in visualCaptcha?

### Dependence-free library

visualCaptcha 5.0 is free from jQuery or jQuery UI dependencies now.

### Multiple backend languages support

Library is available across multiple backend languages and technologies. It's supporting:

- PHP with [Composer/Packagist package](https://github.com/emotionLoop/visualCaptcha-packagist);
- Node JS with [NPM package](https://github.com/emotionLoop/visualCaptcha-npm);
- Ruby with [RubyGem](https://github.com/emotionLoop/visualCaptcha-rubyGem);
- Meteor JS with [Meteorite package](https://github.com/emotionLoop/visualCaptcha-meteorite);
- WordPress with [WordPress plugin](https://github.com/emotionLoop/visualCaptcha-WordPress).

### Framework agnostic frontend integration

visualCaptcha use [Bower](http://bower.io/) to provide a few frontend integration solutions as well as library core which everyone can use to build integration with other frameworks:

- [visualCaptcha Core](https://github.com/emotionLoop/visualCaptcha-frontend-core);
- [Vanilla JS plugin](https://github.com/emotionLoop/visualCaptcha-frontend-vanilla);
- [jQuery plugin](https://github.com/emotionLoop/visualCaptcha-frontend-vanilla);
- [Angular JS directive](https://github.com/emotionLoop/visualCaptcha-frontend-angular).

### Enhanced UX and UI.

The UX and UI were improved for the new version of visualCaptcha. Also we have prepared several demo pages with using different backend and frontend technologies:

- [PHP and jQuery Demo](http://demo.visualcaptcha.net/ "visualCaptcha PHP and jQuery Demo")
- [Node.js and Vanilla JS Demo](http://node.demo.visualcaptcha.net/ "visualCaptcha Node.js and Vanilla JS Demo")
- [Ruby and Angular JS Demo](http://ruby.demo.visualcaptcha.net/ "visualCaptcha Ruby and Angular JS Demo")
- [Meteor JS and Vanilla JS Demo](http://meteor.demo.visualcaptcha.net/ "visualCaptcha Meteor JS and Vanilla JS demo")
- [Multiple captchas PHP and jQuery Demo](http://multiple.demo.visualcaptcha.net/ "Multiple visualCaptcha PHP and jQuery Demo").

### New website

It was created a [new web site](http://visualcaptcha.net "visualCaptcha - The best captcha alternative") with amazing fresh responsive design and retina-ready images.

## Detailed implementation

[CleverStack](http://cleverstack.io/) uses full-stack JavaScript technologies with Node JS and Angular JS. Because, the appropriate libraries are [Angular JS version of visualCaptcha](https://github.com/emotionLoop/visualCaptcha-frontend-angular) and [NPM package for Node JS](https://github.com/emotionLoop/visualCaptcha-npm).

And, of course, we need to have installed [CleverStack CLI and created application](http://cleverstack.io/getting-started/).

### Backend implementation

#### 1. Installation required npm modules with saving dependencies

In terminal open `backend` folder of application and run next installation command for visualCaptcha npm module:

```bash
npm install --save visualcaptcha
```

As well we need a `client-sessions` module for visualCaptcha initialising, run next command to install it:

```bash
npm install --save client-sessions
```

#### 2. Adding session support to application

In previous step we have installed `client-sessions` npm module.   And now we should initialise it correct into `backend/index.js` file. First of all add next line  in top of file to require module:

```javasctipt
var sessions = require( 'client-sessions' );
```

Then we need to add next code into `env.app.configure(function() { /* ... */ });` for initialisation the sessions:

```


// Configure the app before routes
env.app.configure(function() {
    
    /* ... here is other existed app configuration ... */

    // visualCaptcha sessions
    env.app.use( env.express.cookieParser() );
    env.app.use( sessions({
        cookieName: 'session',
        secret: 'someRandomSecret',
        duration: 86400000,// 24h in milliseconds
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            ephemeral: false
        }
    }) ); 
});
```

#### 3. Creating CleverStack module for visualCaptcha.
We need create a simple folder structure for visualCaptcha backend module inside the `backend/modules/` folder of the application:

```
.
|____visualCaptcha-module
  |____controllers
  | |____CaptchaController.js
  |____module.js
  |____package.json
  |____routes.js
```

Where:

- **package.json** — is the main file for CleverStack initialisation and should looks like this one. Notice that name should be equal the visualCaptcha module folder name:

```json
{
  "name": "visualCaptcha-module",
  "version": "0.0.1",
  "private": true,
  "dependencies": {},
  "author": {
    "name": "Clevertech",
    "email": "info@clevertech.biz",
    "web": "http://www.clevertech.biz"
  },
  "collaborators": [
    "Alexander Bykhov <alex.bykhov@clevertech.biz>"
  ],
  "description": "visualCaptcha module for the Cleverstack backend.",
  "keywords": [
    "cleverstack",
    "cleverstack-module",
    "cleverstack-backend",
    "clevertech",
    "backend",
    "visualCaptcha",
    "captcha"
  ],
  "main": "module.js",
  "devDependencies": {},
  "repository": {
    "type": "git",
    "url": ""
  },
  "bugs": {
    "url": ""
  }
}
```

- **module.js** — is for visualCaptcha module definition:
	
```javascript
var ModuleClass = require( 'classes' ).ModuleClass
  , Module;

Module = ModuleClass.extend({});

// name of module should be *equal* the module folder name: 'visualCaptcha-module'
module.exports = new Module( 'visualCaptcha-module', injector );
```
Also we need to add name of our module into the `backend/package.json` file in `bundledDependencies` section for correct cleverStack initialisation:

```json
"bundledDependencies": [
    "visualCaptcha-module"
]
```

- **routes.js** — module of routes for visualCaptcha initialisation and validation. It uses CaptchaController that described below.

```javascript
module.exports = function( app, CaptchaController ) {

    // visualCaptcha initialisation routes
    app.get('/captcha/start/:howmany', CaptchaController._start );
    app.get('/captcha/audio/:type?',   CaptchaController._getAudio );
    app.get('/captcha/image/:index',   CaptchaController._getImage  );

    // CORS fix for submission
    app.options('/user/login',         CaptchaController._options );

    // Submission demo route
    app.post('/user/login',            CaptchaController._trySubmission );

};
```

- **controllers/CaptchaController.js** — main controller for visualCaptcha module. It has next structure:

```javascript
module.exports = function() {
    var visualCaptcha,
        // allowOrigin — front-end origin url, it's used to fix the CORS.
        // It can take the value of '*' as well.
        allowOrigin = 'http://localhost:9000';

    return {

        // CORS fix
        _options: function( req, res, next ) {
            /* ... */
        },

        _start: function( req, res, next ) {
            /* ... */
        },

        _getImage: function( req, res, next ) {
            /* ... */
        },

        _getAudio: function( req, res, next ) {
            /* ... */
        },

        _trySubmission: function( req, res, next ) {
            /* ... */
        }
    };
};

```

**_options** — is a function for fixing the CORS. It sets up correct headers for CORS and sends response with status `200`:

```javascript
// CORS fix
_options: function( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', allowOrigin );
    res.header( 'Access-Control-Allow-Methods', 'POST' );
    res.header( 'Access-Control-Allow-Headers', 'accept, content-type' );
    res.header( 'Access-Control-Allow-Credentials', true );
    res.send( 200 );
},
```

**_start** — is a function for visualCaptcha initialising and refreshing:

```javascript
_start: function( req, res, next ) {
    // After initializing visualCaptcha, we only need to generate new options
    if ( ! visualCaptcha ) {
        visualCaptcha = require( 'visualcaptcha' )( req.session, req.query.namespace );
    }

    // Generation visualCaptcha data
    visualCaptcha.generate( req.params.howmany );

    // CORS fix
    res.header( 'Access-Control-Allow-Origin', allowOrigin );
    res.header( 'Access-Control-Allow-Credentials', true );

    // We have to send the frontend data to use on POST.
    res.send( 200, visualCaptcha.getFrontendData() );
},
```

**_getImage** — fetches and streams generated visualCaptcha image by index:

```javascript
_getImage: function( req, res, next ) {
    var isRetina = false;

    // Default is non-retina
    if ( req.query.retina ) {
        isRetina = true;
    }

    visualCaptcha.streamImage( req.params.index, res, isRetina );
},
```

**_getAudio** — fetches and streams generated visualCaptcha audio file:

```javascript
_getAudio: function( req, res, next ) {
    // Default file type is mp3, but we need to support ogg as well
    if ( req.params.type !== 'ogg' ) {
        req.params.type = 'mp3';
    }

    visualCaptcha.streamAudio( res, req.params.type );
},
```

**_trySubmission** — is a example function for visualCaptcha validation:

```javascript
// Try to validate the captcha
_trySubmission: function( req, res, next ) {
    var namespace = req.query.namespace,
        frontendData,
        queryParams = [],
        imageAnswer,
        audioAnswer,
        responseStatus,
        status,
        result = {};

    frontendData = visualCaptcha.getFrontendData();

    // Add namespace to result, if present
    if ( namespace && namespace.length !== 0 ) {
        result.namespace = namespace;
    }

    // It's not impossible this method is called before visualCaptcha is initialized,
    // so we have to send a 404
    if ( typeof frontendData === 'undefined' ) {
        result.status = 'noCaptcha';

        responseStatus = 404;
    } else {
        // If an image field name was submitted, try to validate it
        if ( ( imageAnswer = req.body[ frontendData.imageFieldName ] ) ) {
            result.type = 'image';
            if ( visualCaptcha.validateImage( imageAnswer ) ) {
                result.status = 'valid';
                responseStatus = 200;
            } else {
                result.status = 'invalid';
                responseStatus = 403;
            }
        } else if ( ( audioAnswer = req.body[ frontendData.audioFieldName ] ) ) {
            // If an audio field name was submitted, try to validate it
            result.type = 'audio';
            // We set lowercase to allow case-insensitivity, but it's actually optional
            if ( visualCaptcha.validateAudio( audioAnswer.toLowerCase() ) ) {
                result.status = 'valid';
                responseStatus = 200;
            } else {
                result.status = 'invalid';
                responseStatus = 403;
            }
        } else {
            result.status = 'failedPost';
            responseStatus = 500;
        }
    }
    
    // CORS fix
    res.header( 'Access-Control-Allow-Origin', allowOrigin );
    res.header( 'Access-Control-Allow-Credentials', true );

    res.send( responseStatus, {
        captcha: result
    });
}
```

Backend CleverStack module for visualCaptcha is done and implemented.

### Frontend implementation

#### 1. Installation required bower package with saving dependencies

In terminal open `frontend` folder of application and run next installation command for Angular JS version of visualCaptcha frontend library:

```bash
bower install --save visualcaptcha.angular
```

#### 2. Including visualcaptcha.angular library 
To include visualcaptcha.angular library we need to add alias for the visualcaptcha.angular library path into the `modules/main.js` file:

```javascript
paths: {

/* ... */

visualCaptcha: '../components/visualcaptcha.angular/visualcaptcha.angular'
},
```

And then add `'visualCaptcha'` into require array:

```javascript
require([
  'angular',
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'http-auth-interceptor',
  'bootstrap',
  'visualCaptcha', // <-- add this after 'angular'

  // Init
  'application',

], function (angular) {
    // ...
});
```
We don't need a shim for visualCaptcha, because it supports AMD. 

#### 3. Including visualCaptcha directive into the html

I'll use login form for example of visualCaptcha implementation.
Login module is stored in `frontend/app/modules/cs_session` folder. There is a `frontend/app/modules/cs_session/views/login.html` view for presentation this module in the browser window. To add visual captcha on login form we need to add next code into the `login.html` file:

```html
<form id="login" ng-submit="login()">

    <!-- ... -->

    <!-- visualCaptcha is here -->
    <div class="form-group">
        <div captcha options="captchaOptions"></div>
    </div>

    <!-- ... -->

</form>
```

#### 4. Initialising visualCaptcha options

Login module uses `frontend/app/modules/cs_session/scripts/cs_login_controller.js` file to define login controller. To add `captchaOptions` variable to the login controller we need to add next code:

```javascript
$scope.captchaOptions = {
  // path to the UI images
  imgPath: '/components/visualcaptcha.angular/img/',
  captcha: {
    // backend root url for captcha routes 
    url: 'http://localhost:8080/captcha',
    // number of generated images
    numberOfImages: 6
  },
  init: function ( captcha ) {
    $scope.captcha = captcha;
  }
};
```

#### 5. Submitting and validation the visualCaptcha

We need to fix `$scope.login` function in the login controller (`frontend/app/modules/cs_session/scripts/cs_login_controller.js`) to add proper captcha data to submission. Replace it with next code:

```javascript
$scope.login = function () {
  // get captcha data
  var cData = $scope.captcha.getCaptchaData();
  if ( !cData.valid || ! $scope.credentials ) {
    $log.error('Please fill the form and solve the CAPTCHA and try again.');
  } else {
    //Add captcha answer to the $scope.credentials object
    $scope.credentials[ cData.name ] = cData.value;

    CSSessionProvider.login($scope.credentials);
  }
};
```

Login function calls `CSSessionProvider.login` function (`frontend/app/modules/cs_session/scripts/cs_session_provider.js`) that returns the promise for login service. I've updated it a bit to pass a correct captcha data to the `$rootScope.$broadcast` method:

```javascript
login: function (credentials) {
  return sessionService.login(credentials).then(function (user) {
    if(user.id) {
      currentUser = user;
      $rootScope.$broadcast('CSSessionProvider:loginSuccess', user );
    } else {
      $rootScope.$broadcast('CSSessionProvider:loginFailure', user );
    }
  }, function( res ) {
    currentUser = null;
    res.data.status = res.status;
    $rootScope.$broadcast('CSSessionProvider:loginFailure', res.data );
  });
},
```

And as well I've updated listener for broadcast `'CSSessionProvider:loginFailure'` event in the login controller (`frontend/app/modules/cs_session/scripts/cs_login_controller.js`) to alert the visualCaptcha status (`valid` or `invalid`) and to refresh it:

```javascript
$scope.$on('CSSessionProvider:loginFailure', function (event, data) {
  $log.log('CSLoginController:', event, data);
  if(data.status === '403') {
    $log.error('Invalid username/password');
  }

  // alert the visualCaptcha status
  alert( 'visualCaptcha is ' + data.captcha.status );
  // We need to make sure we refresh captcha after trying to validate, to avoid abuse
  $scope.captcha.refresh();
});
```

## Conclusion

It's a simple example with detailed code explanation how to implement visualCaptcha in node project. For the best practise visualCaptcha validation function should be used as middleware function in application routing.

All code of implementation demo is available on [github](https://github.com/anotheri/cleverstack-visualCaptcha-demo).

## Support

If you run into any problems, you can look for help in [visualCaptcha’s GitHub](https://github.com/emotionLoop/visualCaptcha) or their [support page](http://support.emotionloop.com/kb/visualcaptcha/).