var message = "estas vivo sensor 9016?"
var ids = ["9013", "9015", "9064", "9071", "9072", "9074", "9075", "9016"]

_ = require('underscore');


var normalize = function(sentence){
	// eliminar todo tipo de caracter (!#$%&/()=?¡'".-{}+*[];:), etc
    var words = sentence.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").toLowerCase().split(" ");
    return words;
}

listmessage = normalize(message)

var test = function(message){
	if (message.indexOf("estas vivo") > -1){
		for (var i = 0; i<ids.length;i++){
			if (_.contains(listmessage, ids[i]) == true){
				return ids[i]
			}
		}
	}
}

var result = test(message)

if (_.isString(result)){
	return result
} else {
	return false
}