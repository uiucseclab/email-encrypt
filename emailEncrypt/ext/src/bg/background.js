var GLOBAL_EMAIL;
var GLOBAL_PASSWORD;
var BASE_URL = "http://localhost:3000";

$(document).ready(function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "getMainEmail"}, function(response) {
      $(".email").val(JSON.parse(response.result));
      $(".password").focus();
    });
  });

  var loggedIn = false;
  if (loggedIn) {
    $(".login").hide();
    $(".encrypt").show();
  } else {
    $(".login").show();
    $(".encrypt").hide();
  }

  $(".submit").click(function () {
    GLOBAL_EMAIL = $(".email").val();
    GLOBAL_PASSWORD = $(".password").val();
    $.ajax({
      type: "POST",
      url: BASE_URL + "/login",
      dataType: 'json',
      data: JSON.stringify({
        email: GLOBAL_EMAIL,
        password: GLOBAL_PASSWORD,
      }),
      success: function (data) {
        console.log(data);
        if (data.result) {
          $(".login").hide();
          $(".encrypt").show();
        }
      }
    });
  });

  // $(".encrypt-button").click(function () {
  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "getToEmailRecipients"}, function(response) {
  //       chrome.extension.getBackgroundPage().console.log('anything?');
  //       $.ajax({
  //         type: "POST",
  //         url: BASE_URL + "/encrypt",
  //         data: {
  //           fromEmail: GLOBAL_EMAIL,
  //           toEmails: response.result,
  //           password: GLOBAL_PASSWORD
  //         },
  //         success: function (data) {
  //           console.log(data);
  //           chrome.extension.getBackgroundPage().console.log('something?');
  //           if (data.result) {
  //             data.result.forEach(function (key, i) {
  //               key = ["'", key.split("\n").join("\\n' + '"), "'"].join("");
  //               chrome.tabs.executeScript(null, {code:"$('.Am.Al').eq(" + i + ").text(encryptMessage(" + "$('.Am.Al').eq(" + i + ").text()" + "," + key + "))"});
  //             });
  //           }
  //         }
  //       });
  //     });
  //   });
  // });
  $(".encrypt-button").click(function () {
    chrome.extension.getBackgroundPage().console.log('foo');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "getToEmailRecipients"}, function(response) {

        var data = {
          fromEmail: GLOBAL_EMAIL,
          toEmails: JSON.parse(response.result),
          password: GLOBAL_PASSWORD
        }
        chrome.extension.getBackgroundPage().console.log(response);
        $.ajax({
          type: "POST",
          url: BASE_URL + "/encrypt",
          dataType: 'json',
          data: JSON.stringify(data),
          success: function (data) {
            console.log(data);
            if (data.result) {
              data.result.forEach(function (key, i) {
                chrome.extension.getBackgroundPage().console.log(key);
                key = ["'", key.split("\n").join("\\n' + '"), "'"].join("");
                chrome.tabs.executeScript(null, {code:"$('.Am.Al').eq(" + i + ").text(encryptMessage(" + "$('.Am.Al').eq(" + i + ").text()" + "," + key + "))"});
              });
            }
          }
        });
      });
    });
  });

  $(".decrypt-button").click(function () {
    var key = ["'", $(".private-key").text().split("\n").join("\\n' + '"), "'"].join("");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "getReadEmails"}, function(response) {
        $.ajax({
          type: "POST",
          url: BASE_URL + "/decrypt",
          data: {
            fromEmails: response.result.from,
            toEmails: response.result.to,
            email: GLOBAL_EMAIL,
            password: GLOBAL_PASSWORD
          },
          success: function (data) {
            console.log(data);
            if (data.result) {
              data.result.forEach(function (key, i) {
                key = ["'", key.split("\n").join("\\n' + '"), "'"].join("");
                chrome.tabs.executeScript(null, {code:"$('.h7 .a3s').eq(" + i + ").text(decryptMessage(" + "$('.h7 .a3s').eq(" + i + ").text()" + "," + key + "))"});
                chrome.tabs.executeScript(null, {code:"$('.Am.Al').eq(" + i + ").text(decryptMessage(" + "$('.Am.Al').eq(" + i + ").text()" + "," + key + "))"});
              });
            }
          }
        });
      });
    });
    // chrome.tabs.executeScript(null, {code:"$('.h7 .a3s').each(function(i, el) {$(el).text(decryptMessage($(el).text()," + key + "))})"});
    // chrome.tabs.executeScript(null, {code:"$('.h7 .Am.Al').each(function(i, el) {$(el).text(decryptMessage($(el).text()," + key + "))})"});
  });
});
