$(document).ready(function(){
    $("#openLoginForm").click(function (e) {
	    ToggleForme();
	    e.preventDefault();
    });
    
    $("#openRegistartionForm").click(function (e) {
	    ToggleForme();
	    e.preventDefault();
    });

    $("#loginButton").click(Login);
    $("#registerButton").click(Register);
    
    UcitajPodatkeIzKolaca();
    ProveriAutoLogin();
});

var ACC_ID = -1;
var ACC_TYPE = "";
var ACC_USERNAME = "";
var ACC_PASSW = "";
var ACCESS_TOKEN = "";
var DEFAULT_TIP_NALOGA = "Musterija";

function UcitajPodatkeIzKolaca() {
	ACC_ID = Cookies.get("accID");
     ACC_TYPE = Cookies.get("accType");
	ACC_USERNAME = Cookies.get("accUsername");
	ACCESS_TOKEN = Cookies.get("access_token");
	ACC_PASSW = Cookies.get("accPassw");
}

function ProveriAutoLogin() {
	if (ACC_USERNAME != null && ACC_USERNAME !== "" && 
		ACC_PASSW != null && ACC_PASSW !== "" &&
		ACCESS_TOKEN != null && ACCESS_TOKEN !== "" &&
		ACC_ID != null && ACC_TYPE != null) {
		AjaxLoginZahtev(ACC_USERNAME, ACC_PASSW);
	} 
}

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

function Login() {
    if (ValidateForm()) {
        //console.log("Sve je ispravno");
        var korIme = $("#lf-username").val();
        var passw = $("#lf-password").val();
        AjaxLoginZahtev(korIme, passw);
    }
}

function Register() {
    if (ValidateForm()) {
        //console.log("Sve je ispravno");
        var korIme = $("#rf-username").val();
        var passw = $("#rf-sifra").val();
        var email = $("#rf-email").val();
        var ime = $("#rf-ime").val();
        var prezime = $("#rf-prezime").val();
        var jmbg = $("#rf-jmbg").val();
        var tel = $("#rf-telefon").val();
        var pol = $("#pol").val();
        AjaxRegisterZahtev(korIme, passw, ime, prezime, pol, email, tel, jmbg);
    }
}

function AjaxLoginZahtev(korIme, sifra) {
    $.post("/api/Login", { username: korIme, password: sifra }, function (data) {
        console.log(data);
        if (data['result'] === "OK") {
            ACC_ID = parseInt(data['accID']);
            ACC_TYPE = data['accType'];
            ACC_USERNAME = data['accUsername'];
            ACCESS_TOKEN = data['token'];

            Cookies.set('accID', ACC_ID);
            Cookies.set('accType', ACC_TYPE);
            Cookies.set('accUsername', ACC_USERNAME);
		  Cookies.set('accPassw', sifra);
            Cookies.set('access_token', ACCESS_TOKEN);
		  window.location.href = "/Home/" + ACCESS_TOKEN;
        } else if (data['result'] === "ERROR") {
            DisplayError(data['message']);
        }
    }, "json");
}

function AjaxRegisterZahtev(_username, _password, _ime, _prezime, _pol, _email, _telefon, _jmbg) {
    $.post("/api/Register", { username: _username, password: _password, ime: _ime, prezime: _prezime, pol: _pol, email: _email, telefon: _telefon, jmbg: _jmbg, tipNaloga_str: DEFAULT_TIP_NALOGA}, function (data) {
        if (data === "OK") {
            ToggleForme();
            ClearRegistrationInput();
        } else if (data === "ERROR_USERNAME_EXISTS") {
            DisplayError("Korisnicko ime vec postoji");
        } else if (data === "ERROR_FORM_NOT_COMPLETE") {
            DisplayError("Neko polje nije popunjeno :(");
        } else if (data.indexOf("ERROR") != -1) {
            DisplayError(data);
        }
    }, "json");
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
            DisplayError("Korisničko ime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(passw)) {
            DisplayError("Šifra nije ispravna!");
			return false;
		}
		
		if (!InputTextValid(passw_re)) {
            DisplayError("Polje 'ponovi šifru' nije ispravno");
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
		
		if (!InputTextValid(tel)) {
            DisplayError("Telefon nije ispravan");
			return false;
		}
		
		if (passw !== passw_re) {
            DisplayError("Šifre se ne slažu");
			return false;
		}
		
		return true;
	} else {
		var korIme = $("#lf-username").val();
		var passw = $("#lf-password").val();
		
		if (!InputTextValid(korIme)) {
            DisplayError("Korisničko ime nije ispravno!");
			return false;
		}
		
		if (!InputTextValid(passw)) {
            DisplayError("Šifra nije ispravna!");
			return false;
		}
		
		return true;
	}
}

function ClearRegistrationInput() {
    $("#rf-username").val("");
    $("#rf-sifra").val("");
    $("#sifra-rep").val("");
    $("#rf-email").val("");
    $("#rf-ime").val("");
    $("#rf-prezime").val("");
    $("#rf-jmbg").val("");
    $("#rf-telefon").val("");
}

function DisplayError(message) {
    TOASTUJ(message);
}