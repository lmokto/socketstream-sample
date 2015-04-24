var _ = require('underscore');
var async = require('async');
// Server-side Code
var ids = ["9013", "9015", "9064", "9071", "9072", "9074", "9075", "9016"]

var normalize = function(sentence){
  // eliminar todo tipo de caracter (!#$%&/()=?¡'".-{}+*[];:), etc
    var words = sentence.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").toLowerCase().split(" ");
    return words;
}


var checksensor = function(listmessage){
  for (var i = 0; i<ids.length;i++){
    if (_.contains(listmessage, ids[i]) == true){
      return ids[i]
    }
  }
}

var sendredis = function(valid, id){
  ss.db.set('valid', valid, function(e, r){
    ss.db.set("sensor", id, function(err, reply){
      return res(reply)
    });
  })
}

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  //_ = require('underscore');
  
  // for (var i = 0; i<ids.length;i++){
  //   ss.db.subscribe(ids[i])
  // }

  // Example of pre-loading sessions into req.session using internal middleware
  req.use('session');
  // Uncomment line below to use the middleware defined in server/middleware/example
  //req.use('example.authenticated')

  return {

    sendMessage: function(message) {
      
      if (message) {         // Check for blank messages
        
        ss.publish.all('newMessage', message);

        if (message.indexOf("estas vivo") > -1){

          var listmessage = normalize(message)
          var sensor = checksensor(listmessage)

          if (_.isString(sensor)){
            ss.db2.subscribe(sensor, function(){
              ss.db.set("a", "1", function(err, reply){
                ss.db.set("sensor", sensor, function(err, reply){
                  ss.publish.all('newMessage', "espere un momento, verificando!");
                  ss.db2.on("message", function(err, message){
                    if (typeof message == 'string' && message != '' ){
                      ss.db.set('a', '0')
                      ss.publish.all('newMessage', message);
                      ss.db.set("sensor", '')
                      return res(true);
                    }
                  })
                })
              })
            })

          } else {
            ss.publish.all('newMessage', "el sensor no existe!  podes ingresar uno valido?, por ejemplo " + ids.join(", "));
            return res(true);
          }

        }

        if (message.indexOf('soy luis') > -1 || message.indexOf('luis') > -1){
          ss.publish.all('newMessage', "hola luis");
          return res(true);
        }

        // Broadcast the message to everyone
        // Confirm it was sent to the originating client
        return res(true);                          
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