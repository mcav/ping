#!/usr/bin/env node

var exec = require('child_process').exec;
var ansi = require('ansi');
var cursor = ansi(process.stdout);

function clear() {

	function lf () { return '\n' }

	cursor.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
		.eraseData(2)
		.goto(1, 1);
}
function ping() {
	exec("ping -c 1 google.com", function (err, stdout, stderr) {
		var match = /time=(.*?)\s/.exec(stdout);
		if (!match) { return; }
		var ms = +match[1];
		var color = (ms < 100) ? "#00ff00" : "#ff0000";
		clear();
		cursor.horizontalAbsolute(0).eraseLine(0);
		cursor.grey().write("ping: ").hex(color).write(~~ms+'').reset().write('ms');
		cursor.hide();
	});
	
}

setInterval(ping, 1000);