export default function formatMonth (date) {

	// Return date in format YYYY-MM-DD

	let year = Math.abs(date.getFullYear()),
		month = date.getMonth(),
		zs = [0,0,0],
		sign = date.getFullYear() < 0 ? '-' : '';

	return 	sign
			+ zs.slice(0,4-(year+'').length).join('')
			+ (year+'')
			+ '-'
			+ (month < 9 ? '0' : '')
			+ ((month+1)+'');
}