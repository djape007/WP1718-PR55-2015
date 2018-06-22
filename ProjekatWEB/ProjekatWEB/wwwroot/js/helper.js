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

function ValidateUserAccountInput(korIme, passw1, passw2, email, ime, prezime, jmbg, telefon, ignore_passw_check = false) {
	if (!InputTextValid(korIme)) {
	  DisplayError("Korisničko ime nije ispravno!");
		return false;
	}
	
	if (!InputTextValid(email, 4, "@.")) {
	  DisplayError("Email nije ispravan!");
		return false;
	}
	
	if (!InputTextValid(ime, 2)) {
	  DisplayError("Ime nije ispravno!");
		return false;
	}
	
	if (!InputTextValid(prezime, 2)) {
	  DisplayError("Prezime nije ispravno!");
		return false;
	}
	
	if (!InputTextValid(jmbg, 13)) {
	  DisplayError("JMBG nije ispravan");
		return false;
	} else if (!JMBGValid(jmbg)) {
	  DisplayError("JMBG može da sadrži samo brojeve");
		return false;
	}
	
	if (!InputTextValid(telefon)) {
	  DisplayError("Telefon nije ispravan");
		return false;
	}
	
	if (!ignore_passw_check) {
		if (!InputTextValid(passw1)) {
		  DisplayError("Šifra nije ispravna!");
			return false;
		}
		
		if (!InputTextValid(passw2)) {
		  DisplayError("Polje 'ponovi šifru' nije ispravno");
			return false;
		}
		
		if (passw1 !== passw2) {
		  DisplayError("Šifre se ne slažu");
			return false;
		}
	}
	
	return true;
}