#!/usr/bin/env node

var exec = require('child_process').exec;
var ansi = require('ansi');
var cursor = ansi(process.stdout);

function ping() {
	exec("ping -c 1 google.com", function (err, stdout, stderr) {
		var match = /time=(.*?)\s/.exec(stdout);
		var ms = +match[1];
		var color = (ms < 100) ? "#00ff00" : "#ff0000";
		cursor.hex(color).write(ms+'').reset().write('\n');
	});
	
}

setInterval(ping, 1000);