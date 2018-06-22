$(document).ready(function(){
	$("#btnLogout").click(Logout);
	Init();
	AjaxGetKorisnika(ACC_ID, true, LateInit);
});

var ACC_ID = -1;
var ACC_TYPE = "";
var ACCES_TOKEN = "";
var KORISNIK = null;

function Init() {
	UcitajPodatkeIzKolaca();
}

function LateInit() {
	if (ACC_TYPE === "Musterija") {
		DodajKarticuMusterijaKontrole();
	} else if (ACC_TYPE === "Vozac") {
		DodajKarticuVozacKontrole();
	} else if (ACC_TYPE === "Dispecer") {
		DodajKarticuDispecerKontrole();
	}
}

function UcitajPodatkeIzKolaca() {
	ACCESS_TOKEN = Cookies.get("access_token");
	ACC_ID = Cookies.get("accID");
     ACC_TYPE = Cookies.get("accType");
}

function Logout() {
	ObrisiKolace();
	window.location.href = "../";
}

function ObrisiKolace() {
	Cookies.remove('accID');
	Cookies.remove('accType');
	Cookies.remove('accUsername');
	Cookies.remove('accPassw');
	Cookies.remove('access_token');
}

function DodajKarticu(naslov, $sadrzaj, mozeDaSeZatvori = false, funcPrilikomZatvaranja = null) {
	var x = '<span class="zatvoriKarticu">X</span>';
	
	if (!mozeDaSeZatvori) {
		x = "";
	}
	
	var kartica = 	'<div class="kartica col-12">'+
					'<div class="hederKartice col-12">'+
						'<span class="titleKartice">'+naslov+'</span>'+
						x +
					'</div>'+
					'<div class="teloKartice visina60 col-12">'+
					'</div>'+
				'</div>';
	
	var $kartica = $(kartica);
	if (mozeDaSeZatvori) {
		$kartica.find(".zatvoriKarticu").first().click({param1: funcPrilikomZatvaranja},ZatvoriKarticuNaX);
	}
	$kartica.find(".teloKartice").first().append($sadrzaj);
	$(".glavniSadrzaj").first().append($kartica);
}

function ZatvoriKarticuNaX(event) {
	var customFunc = event.data.param1;
	$(this).parent().parent().remove();
	if (customFunc != null) {
		customFunc();
	}
}

function AjaxGetKorisnika(id, dodajKarticu = false, LateInit = null) {
	$.get("/api/Korisnici/" + id.toString() + "/" + ACCESS_TOKEN , {}, function (data) {
		console.log(data);
		KORISNIK = data;
		if (dodajKarticu) {
			DodajKarticuProfil(KORISNIK);
		}
		
		if (LateInit != null) {
			LateInit();
		}
	});
}

function DodajKarticuProfil(Korisnik) {
	DodajKarticu("Profil", $(TabelaProfilKorisnika(Korisnik)), false);
	$("#btnProfilEdit").click(TogleEditProfileData);
	$("#btnProfilSacuvaj").click(TogleEditProfileData);
}

function DodajKarticuDispecerKontrole() {
	DodajKarticu("Ostale kontrole", NapraviHTMLDispecerKontrole(), false);
	$("#btnDispDodajVozaca").click(PrikaziKarticuNapraviNalogVozaca);
}

function DodajKarticuMusterijaKontrole() {
	DodajKarticu("Ostale kontrole", NapraviHTMLMusterijaKontrole(), false);
}

function DodajKarticuVozacKontrole() {
	DodajKarticu("Ostale kontrole", NapraviHTMLVozacKontrole(), false);
}

function DodajKarticuSveVoznjeMusterije() {
}

function AjaxSveVoznjeMusterije(idMusterije) {
	$.get("/api/Voznje/WhereCustomer/" + idMusterije + "/" + ACCESS_TOKEN, {}, function (data) {
		if (data == null) {
			
		} else if (data.indexOf("ERROR_") != -1) {
			TOASTUJ(data);
		} else {
			if (data.length == 0) {
				console.log("Nema voznji");
			}
			console.log();
		}
	});
}

function DodajKarticuPretragaVoznji() {
	
}

function NapraviHTMLDispecerKontrole() {
	var s = 	"<button class='dugme' id='btnDispSveVoznje'>Prikaži sve vožnje</button>"+
			"<button class='dugme' id='btnDispDodajVozaca'>Napravi nalog vozača</button>"+
			"<button class='dugme' id='btnDispMojeVoznje'>Prikaži moje vožnje</button>"+
			"<button class='dugme' id='btnDispSveKorisnike'>Prikaži sve korisnike</button>";
	var $s = $(s);
	return $s;
}

function NapraviHTMLMusterijaKontrole() {
	var s = 	"<button class='dugme' id='btnMustZakazi'>Zakaži vožnju</button>"+
			"<button class='dugme' id='btnMustMojeVoznje'>Prikaži moje vožnje</button>";
	var $s = $(s);
	return $s;
}

function NapraviHTMLVozacKontrole() {
	var s = 	"<button class='dugme' id='btnVozaVoznjeNaCekanju'>Prikaži vožnje na cekanju</button>"+
			"<button class='dugme' id='btnVozaUpdateLokaciju'>Postavi trenutnu lokaciju</button>"+
			"<button class='dugme' id='btnVozaMojeVoznje'>Moje vožnje</button>";
	var $s = $(s);
	return $s;
}

function TabelaProfilKorisnika(Korisnik) {
	var polStr = "M";
	
	if (Korisnik['pol'] == 1) {
		polStr = "Z";
	}
	
	var profData= 	"<table id='tabelaProfil'><tbody>"+
					IspisiPropertyTableRow("Korisničko ime", Korisnik['username'], "username") + 
					//IspisiPropertyTableRow("Sifra", Korisnik['password'], "password") + 
					IspisiPropertyTableRow("Ime", Korisnik['ime'], "ime") +
					IspisiPropertyTableRow("Prezime", Korisnik['prezime'], "prezime") +
					IspisiPropertyTableRow("Email", Korisnik['email'], "email") +
					IspisiPropertyTableRow("JMBG", Korisnik['jmbg'], "jmbg") +
					IspisiPropertyTableRow("Telefon", Korisnik['telefon'], "telefon") +
					IspisiPropertyTableRow("Pol", polStr, "pol") +
				'</tbody></table>'+
				'<button class="dugme" id="btnProfilEdit">Izmeni</button>'+
				'<button class="dugme" id="btnProfilSacuvaj">Sačuvaj</button>';
	return profData;
}

function TogleEditProfileData() {
	if ($("#tabelaProfil").hasClass("editModeON")) {
		if (ProveriProfileInput()) {
			PosaljiNovePodatkeProfila();
			//ove funkcije se pozivaju u PosaljiNovePodatkeProfila, ako cuvanje bude uspesno
			//$("#btnProfilEdit").show();
			//$("#btnProfilSacuvaj").hide();
			//ToggleSpanInputOnTable($("#tabelaProfil"));
		}
	} else {
		$("#btnProfilEdit").hide();
		$("#btnProfilSacuvaj").show();
		ToggleSpanInputOnTable($("#tabelaProfil"));
	}
}

function ToggleSpanInputOnTable($tabela) {
	if ($tabela.hasClass('editModeON')) {
		$tabela.find(".propValEdit").each(function () {
			var id = $(this).attr('id');
			/*if (id.indexOf("pol") != -1) {
				$(this).replaceWith($(NapraviInput(id,$(this).text(), "select", ["M", "Z"])));
			} else {*/
				$(this).replaceWith($('<span id="'+id+'" class="propVal">'+$(this).val()+'</span>'));
			//}
		});
		
		$tabela.find(".passwRemoveTR").remove();
		$tabela.removeClass("editModeON");
	} else {
		$tabela.find(".propVal").each(function () {
			var id = $(this).attr('id');
			if (id.indexOf("pol") != -1) {
				$(this).replaceWith($(NapraviInput(id,$(this).text(), "select", ["M", "Z"])));
			} else {
				$(this).replaceWith($(NapraviInput(id, $(this).text())));
			}
		});
		
		//za sifru
		//hardcoded, sta ces :(
		$tabela.find("tbody").append(
		"<tr class='passwRemoveTR'>"+
		"<td><span class='propName'>Šifra stara</span></td><td>"+NapraviInput("password_old", "", "password")+"</td>"+
		"</tr><tr class='passwRemoveTR'>"+
		"<td><span class='propName'>Šifra nova</span></td><td>"+NapraviInput("password1", "", "password")+"</td>"+
		"</tr><tr class='passwRemoveTR'>"+
		"<td><span class='propName'>Šifra ponovo</span></td><td>"+NapraviInput("password2", "", "password")+"</td>"+
		"</tr>"
		);
		
		$tabela.addClass("editModeON");
	}
}

function ProveriProfileInput() {
	var korIme = $("#propValusername").val();
	var passw_old = $("#password_old").val();
	var passw = $("#password1").val();
	var passw_re = $("#password2").val();
	var email = $("#propValemail").val();
	var ime = $("#propValime").val();
	var prezime = $("#propValprezime").val();
	var jmbg = $("#propValjmbg").val();
	var tel = $("#propValtelefon").val();
	
	
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
	
	if (!InputTextValid(tel)) {
		DisplayError("Telefon nije ispravan");
		return false;
	}
	
	if (passw_old !== "" || passw !== "" || passw_re !== "") {
		if (!InputTextValid(passw)) {
			DisplayError("Šifra nije ispravna!");
			return false;
		}
		
		if (!InputTextValid(passw_re)) {
			DisplayError("Polje 'ponovi šifru' nije ispravno");
			return false;
		}
		
		if (passw_old !== KORISNIK['password']) {
			DisplayError("Stara šifra nije ispravna");
			return false;
		}
		
		if (passw !== passw_re) {
			DisplayError("Šifre se ne slažu");
			return false;
		}
	}

	return true;
}

function PosaljiNovePodatkeProfila() {
	var korIme = $("#propValusername").val();
	var passw = $("#password1").val();
	var _email = $("#propValemail").val();
	var _ime = $("#propValime").val();
	var _prezime = $("#propValprezime").val();
	var _jmbg = $("#propValjmbg").val();
	var tel = $("#propValtelefon").val();
	var _pol = $("#propValpol").val();
	
	if (passw === "") {
		passw = KORISNIK['password'];
	}
	
	$.post("/api/Korisnici/" + ACC_ID + "/" + ACCESS_TOKEN, {
		username: korIme, password: passw, pol: _pol,
		email: _email, jmbg: _jmbg, telefon: tel, ime: _ime, prezime: _prezime}, function (data) {
		if (data === "OK") {
			AjaxGetKorisnika(ACC_ID);
			TOASTUJ("Novi podaci uspešno sačuvani");
			$("#btnProfilEdit").show();
			$("#btnProfilSacuvaj").hide();
			ToggleSpanInputOnTable($("#tabelaProfil"));
		} else if (data.indexOf("ERROR_") != -1) {
			TOASTUJ(data);
		}
	});
}

//tip: select, text, password
function NapraviInput(id, vrednost, tip = "text", opcije) {
	if (tip === "text" || tip === "password") {
		return '<input value="'+vrednost+'" class="propValEdit" type="'+tip+'" id="' +id+ '"/>';
	} else if (tip === "select") {
		var vrati = '<select class="propValEdit" id="'+id+'">';
		vrati += '<option value="'+vrednost+'" selected hidden>'+vrednost+'</option>';
		for(var o in opcije) {
			vrati += "<option value='"+opcije[o]+"'>" + opcije[o] + "</option>";
		}
		return vrati + "</select>";
	}
}

function IspisiPropertyTableRow(propName, propVal, uniqueID) {
	return 	'<tr>'+
					'<td>'+
						'<span class="propName">'+propName+'</span>'+
					"</td>"+
					"<td>"+
						'<span id="propVal'+uniqueID+'" class="propVal">'+propVal+'</span>'+
					'</td>'+
			'</tr>';
}

function DisplayError(poruka) {
	TOASTUJ(poruka);
}

function PrikaziKarticuNapraviNalogVozaca() {
	if (ACC_TYPE == "Dispecer" && !($("body").hasClass("NOVINALOGVOZACA"))) {
		var sadrzaj = "<table><tbody>"+
		"<tr><td><span class='propName'>Korisničko ime</span></td>	<td><input id='vozNNusername' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Sifra</span></td>			<td><input id='vozNNpassword1' type='password'/></td></tr>"+
		"<tr><td><span class='propName'>Sifra ponovo</span></td>	<td><input id='vozNNpassword2' type='password'/></td></tr>"+
		"<tr><td><span class='propName'>Ime</span></td>			<td><input id='vozNNime' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Prezime</span></td>		<td><input id='vozNNprezime' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>JMBG</span></td>			<td><input id='vozNNjmbg' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Email</span></td>			<td><input id='vozNNemail' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Telefon</span></td>		<td><input id='vozNNtelefon' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Pol</span></td>			<td><input id='vozNNpol' type='text'/></td></tr>"+
		"</tbody></table>"+
		"<button class='dugme flotujDesno'>Napravi</button>";
		$("body").addClass("NOVINALOGVOZACA");
		DodajKarticu("Novi nalog - Vozac", $(sadrzaj), true, PocistiKarticuNapraviNoviNalogVozaca);
	} else {
		console.log("lol");
	}
}
//poziva se kad se zatvori kartica za pravljenje novog naloga vozaca
function PocistiKarticuNapraviNoviNalogVozaca() {
	$("body").removeClass("NOVINALOGVOZACA");
}