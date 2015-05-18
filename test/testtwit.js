var fs = require('fs');
var Hits = require('../hits');
var config = require('./config1');
var hits = new Hits(config);
var file_output = 'result_twitter.txt';
var encoding = 'utf8';

var done=false;
var keyword = process.argv[2]; //'github'
var timescan = 60;
var countTweetsTotal = 0;



console.log('Running twitter metric');

hits.getHits(keyword, timescan, function (results){
	console.log(results);
	fs.writeFile(file_output , results, encoding, function (err) {
			if (err) return console.log(err);
			else {console.log('data save into > ' + file_output);}
	});	
		
});




