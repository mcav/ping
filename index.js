#!/usr/bin/env node

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var ansi = require('ansi');
var cursor = ansi(process.stdout);

function clear() {

	function lf () { return '\n' }

	cursor.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
		.eraseData(2)
		.goto(1, 1);
}

function word(ms) {
	if (ms < 10) {
		return "unbelievably good";
	} else if (ms < 25) {
		return "reasonably good";
	} else if (ms < 40) {
		return "decent";
	} else if (ms < 60) {
		return "somewhat lethargic";
	} else if (ms < 100) {
		return "unacceptable";
	} else if (ms < 250) {
		return "terrible";
	} else {
		return "fracking terrible";
	}
}

var curVol = 0;

var avgs = [];
function ping() {
	
	exec("ping -c 1 google.com", function (err, stdout, stderr) {
		var match = /time=(.*?)\s/.exec(stdout);
		if (!match) { return; }
		var ms = +match[1];
		var color = (ms < 100) ? "#00ff00" : "#ff0000";
		avgs.push(ms);
		(avgs.length > 20 && avgs.shift());
		var avg = avgs.reduce(function (sum, n) { return sum + n; }, 0) / avgs.length;
		clear();
		cursor.goto(0,0);
		cursor.grey()
			.write('\n')
			.white().write("         game ").cyan().write("{").white().write(" closure ").cyan().write("}\n")
			.grey().write('     ' + new Date().toLocaleString().slice(0,24) + '\n\n')
			.write("         our internet is\n")
			.hex(color).write('         ' + word(avg) + '\n')
			.grey().write("           ping: ").hex(color).write(~~ms+'').reset().write('ms')
			.write('\n\n')
			.write('         ' + curVol)
			.hide();
	});
	
}

var rec = spawn('rec', ['-n']);
rec.stdout.on('data', function (data) {
	var match = /\[.*?\|((=|-)*)\]/.exec(data);
	if (match) {
		curVol = match[1].length;
	}
});

setInterval(ping, 1000);