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

function NapraviFilter(statusVoznje = null, _datumOd = null, _datumDo = null,_ocenaOd = null, _ocenaDo = null, _cenaOd = null, _cenaDo = null, _imeVoz = null, _prezVoz = null, _imeMust = null, _prezMust = null) {
	var filter = {
		status:  statusVoznje,
		datumOd: _datumOd,
		datumDo: _datumDo,
		ocenaOd: _ocenaOd,
		ocenaDo: _ocenaDo,
		cenaOd: _cenaOd,
		cenaDo: _cenaDo,
		imeVoz: _imeVoz,
		prezVoz: _prezVoz,
		imeMust: _imeMust,
		prezMust: _prezMust
	}
	return filter;
}

var STATUS_VOZNJE_FROM_INT = {
	0: "Kreirana",
	1: "Otkazana",
	2: "Formirana",
	3: "Obradjena",
	4: "Prihvacena",
	5: "Neuspesna",
	6: "Uspesna",
	7: "UToku"
}

var TIP_VOZILA_FROM_INT = {
	0: "PutnickiAuto",
	1: "Kombi"
}

function VoznjaIspunjavaUslov(voznja, filter) {
	if (voznja == null) {
		return false;
	}
	
	if (filter != null) {
		if ((filter.status != null && filter.status != "") && filter.status != STATUS_VOZNJE_FROM_INT[voznja['status']]) {
			return false;
		}
		
		if (filter.datumOd != null && moment(filter.datumOd).isAfter(voznja['datumNarucivanja'])) {
			return false;
		}
		
		if (filter.datumDo != null && moment(filter.datumDo).isBefore(voznja['datumNarucivanja'])) {
			return false;
		}
		
		if (voznja['komentariOBJ'].length > 0) {
			if (filter.ocenaOd != null && filter.ocenaOd != "" && filter.ocenaOd > voznja['komentariOBJ'][0]['ocenaVoznje']) {
				return false;
			}
			
			if (filter.ocenaDo != null && filter.ocenaDo != "" && filter.ocenaDo < voznja['komentariOBJ'][0]['ocenaVoznje']) {
				return false;
			}
		} else if ((filter.ocenaDo != null && filter.ocenaDo != "") || (filter.ocenaOd != "" && filter.ocenaOd != null)){
			return false;
		}
		
		if (filter.cenaOd != null && filter.cenaOd != "" && filter.cenaOd > voznja['iznos']) {
			return false;
		}
		
		if (filter.cenaDo != null && filter.cenaDo != "" && filter.cenaDo < voznja['iznos']) {
			return false;
		}
		
		if (filter.imeVoz != null && filter.imeVoz != "" && (voznja['vozacOBJ'] == null || voznja['vozacOBJ']['ime'].toLowerCase().indexOf(filter.imeVoz.toLowerCase()) == -1)) {
			return false;
		}
		
		if (filter.prezVoz != null && filter.prezVoz != "" && (voznja['vozacOBJ'] == null || voznja['vozacOBJ']['prezime'].toLowerCase().indexOf(filter.prezVoz.toLowerCase()) == -1)) {
			return false;
		}
		
		if (filter.imeMust != null && filter.imeMust != "" &&  (voznja['musterijaOBJ'] == null || voznja['musterijaOBJ']['ime'].toLowerCase().indexOf(filter.imeMust.toLowerCase()) == -1)) {
			return false;
		}
		
		if (filter.prezMust != null && filter.prezMust != "" && (voznja['musterijaOBJ'] == null || voznja['musterijaOBJ']['prezime'].toLowerCase().indexOf(filter.prezMust.toLowerCase()) == -1)) {
			return false;
		}
		
		return true;
	} else {
		return true;
	}
}

function NapraviObjekatLokacija(_x, _y, _ulica, _broj, _mesto, _postanskiBroj) {
	if (_ulica.trim() == "" && _broj.trim() == "" && _mesto.trim() == "" && _postanskiBroj == "") {
		return null;
	}

	return {
		X: _x,
		Y: _y,
		Adresa: {
			Ulica: _ulica,
			Broj: _broj,
			Mesto: _mesto,
			PozivniBroj: _postanskiBroj
		}
	}
}