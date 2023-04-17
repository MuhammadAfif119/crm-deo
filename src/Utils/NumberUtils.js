export const FloatRoundUp = (number)=>{
	return Math.abs(Number((number).toFixed(2))); // 6.7
}

export const Rupiah = (value)=>{
	return new Intl.NumberFormat('en-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		maximumFractionDigits: 6, // (causes 2500.99 to be printed as $2,501)
	  }).format(value);
}

export const dollar = (value)=>{
	
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		maximumFractionDigits: 5, // (causes 2500.99 to be printed as $2,501)
	  }).format(value);
	  
}

export const NumberAcronym = (labelValue)=>{

		  // Nine Zeroes for Billions
		  return Math.abs(Number(labelValue)) >= 1.0e+12
		  		? (Math.abs(Number(labelValue)) /1.0e+12).toFixed(2) + "T"
				// Nine Zeroes for Millions 
		   		: Math.abs(Number(labelValue)) >= 1.0e+9
			   	? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
			   	// Six Zeroes for Millions 
			   	: Math.abs(Number(labelValue)) >= 1.0e+6
			   	? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)+ "M"
			   	// Three Zeroes for Thousands
			   	: Math.abs(Number(labelValue)) >= 1.0e+3
			   	? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
			   	: Math.abs(Number(labelValue));

}