function DisplayError(message) {
    alert(message);
}

function InputNumberValid(tekst) {
	var broj = parseInt(tekst);
	if (isNaN(broj)) {
		return false;
	}
	return true;
}

function InputTextValid(tekst, minDuzina, obavezniZnakovi) {
	if ($.trim(tekst) == "") {
		return false;
	}
	
	if (minDuzina > tekst.length) {
		return false;
	}
	
	if (obavezniZnakovi != null) {
		for (var indeks in obavezniZnakovi) {
			
			if (tekst.indexOf(obavezniZnakovi[indeks]) === -1) {
				return false;
			}
		}
	}
	
	return true;
}