var fs = require('fs');
var Hits = require('../hits');
var config = require('./config1');
var hits = new Hits(config);
var file_output = 'result_twitter.txt';
var encoding = 'utf8';

var keyword = process.argv[2]; //'swissprot,swiss prot,swiss-prot,UniProtKB,uniprot' 
var timescan = 1800; //seconds


console.log('Running twitter metric');

hits.getHits(keyword, timescan, function (results){
	console.log(results);
});

