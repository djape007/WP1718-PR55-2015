$(document).ready(function(){
    $("#openLoginForm").click(function (e) {
	    ToggleForme();
	    e.preventDefault();
    });
    $("#openRegistartionForm").click(function (e) {
	    ToggleForme();
	    e.preventDefault();
    });
});

function ToggleForme() {
	if ($('body').hasClass('prikazanaRegistracija')) {
		$('.registerFormContainer').hide();
		$('.loginFormContainer').show();
	} else {
		$('.loginFormContainer').hide();
		$('.registerFormContainer').show();
	}
	$('body').toggleClass('prikazanaRegistracija');
}

function ValidateForm() {
	if ($('body').hasClass('prikazanaRegistracija')) {
		var korIme = $("#rf-username").val();
		var passw = $("#rf-sifra").val();
		var passw_re = $("#sifra-rep").val();
		var email = $("#rf-email").val();
		var ime = $("#rf-ime").val();
		var prezime = $("#rf-prezime").val();
		var jmbg = $("#rf-jmbg").val();
		var tel = $("#rf-telefon").val();
		
		if (!InputTextValid(korIme)) {
			alert("Korisnicko ime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(passw)) {
			alert("Sifra nije ispravna!");
			return false;
		}
		
		if (!InputTextValid(passw_re)) {
			alert("Polje 'ponovi sifru' nije ispravno");
			return false;
		}
		
		if (!InputTextValid(email, 4, "@.")) {
			alert("Email nije ispravan!");
			return false;
		}
		
		if (!InputTextValid(ime, 2)) {
			alert("Ime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(prezime, 2)) {
			alert("Prezime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(jmbg, 13)) {
			alert("JMBG nije ispravan");
			return false;
		} else if (!JMBGValid(jmbg)) {
			alert("JMBG moze da sadrzi samo brojeve");
			return false;
		}
		
		if (!InputTextValid(tel)) {
			alert("Telefon nije ispravan");
			return false;
		}
		
		if (passw !== passw_re) {
			alert("Sifre se ne slazu");
			return false;
		}
		
		return true;
	} else {
		var korIme = $("#lf-username").val();
		var passw = $("#lf-password").val();
		
		if (!InputTextValid(korIme)) {
			alert("Korisnicko ime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(passw)) {
			alert("Sifra nije ispravna!");
			return false;
		}
		
		return true;
	}
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