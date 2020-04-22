var formatGrouping;
export var formatParse;

formatGrouping = function (number, formatting) {
	var num = (parseInt(number)+'').split('').reverse(),
		groups = Math.floor((num.length-1) / 3);

	for (var i = 1; i <= groups; i++) {
		num.splice(i*3+(i-1), 0, formatting.seperator);
	}

	return num.reverse().join('');
}

formatParse = function (format) {
	var re = /^(.)(.)(.)(.)?$/,
		match = format.match(re) || [];

	return {
		prefix: match[1] || '$',
		seperator: match[2] || ',',
		decimal: match[3] || '.',
		suffix: match[4] || ''
	};
}

export default function formatNumber (number, formatting) {
	var number = Number(number).toFixed(2) + '',
		decimal = number.split('.')[1],
		formatting = formatting || formatParse('');

	return formatting.prefix + formatGrouping(number, formatting) + formatting.decimal + decimal + formatting.suffix;
}