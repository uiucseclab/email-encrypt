(function() {
    var childProcess = require("child_process");
    oldSpawn = childProcess.spawn;
    function mySpawn() {
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var cp = require('child_process');

function createKey(keyName, cb) {
  var privateCommand = ["openssl", "genrsa", "-out", "keys/" +  keyName + "_private.pem", "1024"];
  var privateChild = cp.spawn(privateCommand[0], privateCommand.slice(1));
  privateChild.on('error', function (e) {
    console.log(e.stack);
  });
  privateChild.on('data', function () {
    console.log("data", arguments);
  });
  privateChild.on('close', function (code) {
    console.log("close", arguments);

    var publicCommand = ["openssl", "rsa", "-pubout", "-in", "keys/" + keyName + "_private.pem", "-out", "keys/" + keyName + "_public.pem"];
    var publicChild = cp.spawn(publicCommand[0], publicCommand.slice(1));
    publicChild.on('error', function (e) {
      console.log(e.stack);
    });

    publicChild.on('data', function () {
      console.log("data", arguments);
    });

    publicChild.on('close', function (code) {
      console.log("close", arguments);
      cb();
    });
  });
}

module.exports = createKey;