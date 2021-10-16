const convertStringToUrlQuery = (x) =>  {
	
	let sample = x.toString();
	sample.replace("", "+")
	return sample
}

module.exports = {convertStringToUrlQuery}
