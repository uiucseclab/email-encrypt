var http = require('http');
var Router = require('node-simple-router');
var fs = require('fs');
var passwordHash = require('password-hash');
var keyGenerator = require('./keys');

var jsencrypt = require('./jsencrpyt-node');

var router = Router();

function makeKey(fromEmail, toEmails) { 
  return fromEmail + "=>" + toEmails.sort().join("-");
}

var index = fs.readFileSync("index.html").toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(index);
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

router.post('/login', function (request, response) {
  var json = request.body;
  console.log(json);
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if (fs.existsSync('users/' + json.email)) {
    console.log("user exists");
    var hashedPass = fs.readFileSync('users/' + json.email).toString();
    response.end(JSON.stringify({result: passwordHash.verify(json.password, hashedPass)}));
  } else {
    console.log("user not exists " + JSON.stringify({result: false}));
    response.end(JSON.stringify({result: false}));
  }
});

router.post('/register', function (request, response) {
  console.log(request.post);
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if (fs.existsSync('users/' + request.post.email)) {
    response.end(JSON.stringify({result: false}));
  } else {
    fs.writeFileSync('users/' + request.post.email, passwordHash.generate(request.post.password));
    response.end(JSON.stringify({result: true}));
  }
});

router.post('/encrypt', function (request, response) {
  var json = request.body;
  console.log(json);
  var hashedPass = fs.readFileSync('users/' + json.fromEmail).toString();
  if (fs.existsSync('users/' + json.fromEmail) && passwordHash.verify(json.password, hashedPass)) {
    var toEmails = json.toEmails;
    var remainingKeys = toEmails.length;
    var finished = function () {
      remainingKeys--;
      if (remainingKeys === 0) {
        response.writeHead(200, {
          'Content-Type': 'application/json'
        });
        response.end(JSON.stringify({result: toEmails.map(function(emails) {
          var keyName = makeKey(json.fromEmail, emails);
          var keyText = fs.readFileSync("keys/" + keyName + "_public.pem").toString();
          console.log(keyText);
          if(json.message) {
            var ciphertext = jsencrypt.encrypt(json.message, keyText);
            return ciphertext;
          }
          console.log("cipher text in /encrypt: " + ciphertext);
          return keyText;
        })}));
      }
    };
    toEmails.forEach(function (emails) {
      var keyName = makeKey(json.fromEmail, emails);
      if (fs.existsSync("keys/" + keyName + "_private.pem")) {
        finished();
      } else {
        keyGenerator(keyName, function () {
          finished();
        });
      }
    });
  } else {
    response.writeHead(401, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify({result: false}));
  }
});

router.post('/decrypt', function (request, response) {
  console.log(request.post);
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var toEmails = JSON.parse(request.post.toEmails);
  var fromEmails = JSON.parse(request.post.fromEmails);
  var hashedPass = fs.readFileSync('users/' + request.post.email).toString();
  if (fs.existsSync('users/' + request.post.email) && passwordHash.verify(request.post.password, hashedPass)) {
    response.end(JSON.stringify({result: toEmails.map(function(emails, i) {
      var keyName = fromEmails[i] + "=>" + emails.sort().join("-");
      console.log(emails, request.post.email)
      if (fs.existsSync("keys/" + keyName + "_private.pem") && emails.indexOf(request.post.email) > -1) {
        return fs.readFileSync("keys/" + keyName + "_private.pem").toString();
      } else {
        return undefined;
      }
    })}));
  } else {
    response.end(JSON.stringify({result: false}));
  }
});

router.post('/encryptmessage', function(request, response) {
  var json = request.body;
  console.log("encrypt message: " + json.message + " with key: " + json.key);
  var ciphertext = jsencrypt.encrypt(request.message, request.key);
  console.log("cipher: " + ciphertext);
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify({ciphertext: ciphertext}));
});


var server = http.createServer(router);
server.listen(3000);
