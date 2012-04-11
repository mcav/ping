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
		return "    decent";
	} else if (ms < 60) {
		return "somewhat lethargic";
	} else if (ms < 100) {
		return "  unacceptable";
	} else if (ms < 250) {
		return "   terrible";
	} else {
		return "fracking terrible";
	}
}

function volWord(db) {
	if (db < 1) {
		return "   silent";
	} else if (db < 2) {
		return "    fine";
	} else if (db < 3) {
		return " distracting";
	} else if (db < 4) {
		return "  too loud";
	} else {
		return "dubstep party";
	}
}

function average(avgs) {
	return avgs.reduce(function (sum, n) { return sum + n; }, 0) / avgs.length;
}

var avgs = [];
function ping() {
	
	exec("ping -c 1 google.com", function (err, stdout, stderr) {
		var match = /time=(.*?)\s/.exec(stdout);
		if (!match) { return; }
		var ms = +match[1];
		var color = (ms < 100) ? "#00ff00" : "#ff0000";
		var volume = average(volAvgs);
		var volColor = (volume < 2) ? "#00ff00" : "#ff0000";

		avgs.push(ms);
		(avgs.length > 20 && avgs.shift());
		var avg = average(avgs);
		clear();
		cursor.goto(0,0);
		cursor.grey()
			.write('\n')
			.white().write("         game ").cyan().write("{").white().write(" closure ").cyan().write("}\n")
			.grey().write('     ' + new Date().toLocaleString().slice(0,24) + '\n\n')
			.write("         our internet is\n")
			.hex(color).write('         ' + word(avg) + '\n')
			.grey().write("           ping: ").hex(color).write(~~ms+'').reset().write('ms')
			.grey().write('\n\n          the volume is\n')
			.hex(volColor)
			.write('          ' + volWord(volume))
			.hide();
	});
	
}

var volAvgs = [];
var rec = spawn('rec', ['-n']);
rec.stderr.on('data', function (data) {
	var match = /\[.*?\|((=|-)*)\s*\]/.exec(data);
	if (match) {
		volAvgs.push(match[1].length);
		(volAvgs.length > 100 && volAvgs.shift());
	}
});

setInterval(ping, 1000);
