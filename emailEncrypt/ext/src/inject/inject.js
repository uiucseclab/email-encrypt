chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "getReadEmails") {
      sendResponse({result: {
        from: JSON.stringify($(".h7 .iw .gD").toArray().map(function (a) { return $(a).attr("email"); })),
        to: JSON.stringify($(".hb").toArray().map(function (a) { return $(a).find(".g2").toArray().map(function (el) { return $(el).attr("email"); }); }))
      }});
    } else if (request.greeting === "getMainEmail") {
      sendResponse({result: JSON.stringify($(".gb_za").text())});
    } else if (request.greeting === "getToEmailRecipients") {
      sendResponse({result: JSON.stringify($(".AD").toArray().map(function(el){return $(el).find(".vN.Y7BVp.a3q").toArray().map(function(el) { return $(el).attr("email"); })}))});
    }
  });

console.log("Anything here?!!?!?!?");

function encryptMessage (string, key) {
  var encrypt = new JSEncrypt();
  console.log("key: " + key);
  encrypt.setPublicKey(key);
  return encrypt.encrypt(string) && string.length ? encrypt.encrypt(string) : string;
}

function decryptMessage (string, key) {
  var decrypt = new JSEncrypt();
  decrypt.setPrivateKey(key);
  return decrypt.decrypt(string) && string.length ? decrypt.decrypt(string) : string;
}