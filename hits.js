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
  var start = datestring ();
  this.params = { track: params};
  var stream = this.twit.stream('statuses/filter', this.params);
  
  stream.on('tweet', function (tweet) {
  	var end = datestring();
  	//console.log(tweet);
  	if( doneTimescan(start, end, timescan) ) {
  		stream.stop();
  		return callback(sumarizedata(lang));
  	}else{
	  if (! lang.hasOwnProperty(tweet.lang)) lang[tweet.lang] = 1;
	  else lang[tweet.lang] += 1;
	}
  });
};


Hits.prototype.get = function (path, params, callback){
	this.twit.get(path, params, callback);
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