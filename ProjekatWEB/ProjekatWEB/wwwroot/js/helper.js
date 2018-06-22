function InputNumberValid(tekst) {
	var broj = parseInt(tekst);
	if (isNaN(broj)) {
		return false;
	}
	return true;
}

function JMBGValid(tekst) {
	return tekst.match(/^[0-9]+$/) != null;
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

var TOAST_PRIKAZAN = false;
function TOASTUJ(poruka) {
	$("#snackbar").text(poruka);
	if (!TOAST_PRIKAZAN) {
		var x = document.getElementById("snackbar");
		TOAST_PRIKAZAN = true;
		x.className = "show";
		setTimeout(function(){ 
			x.className = x.className.replace("show", "");
			TOAST_PRIKAZAN = false;
		}, 3000);
	}
}