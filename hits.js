//
//  Hit
//  Class for performing hits query in twitter using Streaming facilities
//	Use the API twitter.
//
var Twit = require('./lib/twitter');
var lang ={};
var location = new Object();
/**
 * Hits module.
 * @module Hits
 */
 
/**
 * Object to do differnt actions in Citations.
 * @constructor
 * @param {structure} config - data structure or file with details of OAuth data. 
 */
var Hits = module.exports = function(config) { 
  this.twit = new Twit(config);
  
};

//params: A comma-separated list of phrases which will be used to determine
// what Tweets will be delivered on the stream
//timescan: Time in seconds to scan the Streams of the public data flowing through Twitter 

  /**
 * GET any tweet that hit with params.
 * @param {string} params - Keyword or keywords are specified by a comma-separated list.
 * @param {integer} timescan - Time in seconds to scan the Streams of the public data flowing through Twitter. 
 * @param {function} callback - data is the parsed data received from Twitter API.
 * @memberOf  Hits
 */
Hits.prototype.getHits = function (params,timescan,callback) {
	var start = datestring (), end = datestring();
	this.params = {track: params};
	var stream = this.twit.stream('statuses/filter', this.params);
	var ntweets = 0;
	
	//Emitted when a connection attempt is made to Twitter. The http request object is emitted.
	stream.on('connect', function (request) {
  		//console.log('connect: '+request);
	});

	//Emitted when the response is received from Twitter. The http response object is emitted.
	stream.on('connected', function (response) {
		end = datestring();
		if( doneTimescan(start, end, timescan) ) {
			//console.log('start: '+start+'end: '+end);
			stream.stop();
			//return callback(sumarizedata(lang)); //this option can be used to return language classification
			return callback(ntweets + ' tweets');
		}
	});

	//Emitted each time a status (tweet) comes into the stream.
	stream.on('tweet', function (tweet) {
		ntweets +=1;
		if (! lang.hasOwnProperty(tweet.lang)){lang[tweet.lang] = 1;}
		else{lang[tweet.lang] += 1;}
		
	});

	//Emitted each time a limitation message comes into the stream.
	stream.on('limit', function (limitMessage) {
		console.log('limit: '+ limitMessage);
		stream.stop();
		callback(ntweets + ' tweets');
	});
	
	stream.on('disconnect', function (disconnectMessage) {
 	 	console.log('disconnectMessage: '+disconnectMessage); 
	});
	
	stream.on('error', function(error) {
		stream.stop();
		console.log('stream error (hits.js): limit or timedout');
		callback(ntweets + ' tweets');
	});
	
};


function sumarizedata(data){
  	var results = '';
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			results += 'Total tweets in [' + key + ']:\t' + data[key] + '\n';
		}
	}
	return results;

}

function datestring () {
  return Date.now();
};

function doneTimescan(star, end, timescan){
	if((end-star)/1000 >= timescan) return true;
	else return false;
}
