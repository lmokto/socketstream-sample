'use strict';
// Server-side Code

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  // Example of pre-loading sessions into req.session using internal middleware
  req.use('session');
  // Uncomment line below to use the middleware defined in server/middleware/example
  //req.use('example.authenticated')

  return {

    sendMessage: function(message) {
      if (message) {         // Check for blank messages
        ss.publish.all('newMessage', message);     // Broadcast the message to everyone
        return res(true);                          // Confirm it was sent to the originating client
      } else {
        return res(false);
      }
    },

    square : function(number){
      var r = number*number
      console.log(r)
      ss.publish.all('newMessage', r);
      return res(true);
    },
    
    testRedis : function(key){
      ss.db.set("a", key, function(err, reply){
        return res(reply)
      });
      //ss.db.get(key, function(err, reply) {
      // reply is null when the key is missing
      //  return res(reply);
      //});
    },

    testAction: function(){
      console.log('This request now has session data:', req.session);
    },

    updateSession: function(){
      req.session.myVar = 1234;
      req.session.cart = {items: 3, checkout: false};
      req.session.save(function(err){
        console.log('Session data has been saved:', req.session);
      });
    }

  };

};