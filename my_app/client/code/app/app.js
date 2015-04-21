'use strict';
/* QUICK CHAT DEMO */

// Delete this file once you've seen how the demo works


ss.event.on('foo:bar', function(date){
  var html = ss.tmpl['time-timestamp'].render({
    time: function() {
      return timestamp();
    }
  });

  $('#remov').remove()
  return $(html).appendTo('#timelog').slideDown();

});

ss.event.on('newMessage', function(message) {


  // Example of using the Hogan Template in client/templates/chat/message.jade to generate HTML for each message
  var html = ss.tmpl['chat-message'].render({
    message: message,
    time: function() {
      return timestamp();
    }
  });
  //

  // Append it to the #chatlog div and show effect
  return $(html).hide().appendTo('#chatlog').slideDown();
  
});

// Show the chat form and bind to the submit action
$('#demo').on('submit', function() {

  // Grab the message from the text box
  var text = $('#myMessage').val();

  // Call the 'send' funtion (below) to ensure it's valid before sending to the server
  return exports.send(text, function(success) {
    if (success) {
      return $('#myMessage').val('');
    } else {
      return alert('Oops! Unable to send message');
    }
  });

});

// Demonstrates sharing code between modules by exporting function
exports.send = function(text, cb) {
  var v = valid(text)
  if (v == 'string') {
    return ss.rpc('demo.sendMessage', text, cb);
  } else if (v == 'number'){
    return ss.rpc('demo.square', text, cb);
  } else {
    return cb(false);
  }
};


// Private functions

function timestamp() {
  var d = new Date();
  return d.getHours() + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}

function pad2(number) {
  return (number < 10 ? '0' : '') + number;
}

function valid(text) {
  if (typeof text == "string"){
    if (text[0] in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]){
      return "number"
    } else {
      return "string"
    }
  }
}