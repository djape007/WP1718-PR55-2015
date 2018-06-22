$(document).ready(function(){
	$("#btnLogout").click(Logout);
	Init();
	AjaxGetKorisnika(ACC_ID, true);
});

var ACC_ID = -1;
var ACC_TYPE = "";
var ACCES_TOKEN = "";
var KORISNIK = null;

function Init() {
	UcitajPodatkeIzKolaca();
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

function DodajKarticu(naslov, $sadrzaj, mozeDaSeZatvori = false) {
	var x = '<span class="zatvoriKarticu">X</span>';
	
	if (!mozeDaSeZatvori) {
		x = "";
	}
	
	var kartica = 	'<div class="kartica col-12">'+
					'<div class="hederKartice col-12">'+
						'<span class="titleKartice">'+naslov+'</span>'+
						x +
					'</div>'+
					'<div class="teloKartice visina200 col-12">'+
					'</div>'+
				'</div>';
	
	var $kartica = $(kartica);
	if (mozeDaSeZatvori) {
		$kartica.find(".zatvoriKarticu").first().click(ZatvoriKarticuNaX);
	}
	$kartica.find(".teloKartice").first().append($sadrzaj);
	$(".glavniSadrzaj").first().append($kartica);
}

function ZatvoriKarticuNaX() {
	$(this).parent().parent().remove();
}

function AjaxGetKorisnika(id, dodajKarticu = false) {
	$.get("/api/Korisnici/" + id.toString() + "/" + ACCESS_TOKEN , {}, function (data) {
		console.log(data);
		KORISNIK = data;
		if (dodajKarticu) {
			DodajKarticuProfil(KORISNIK);
		}
	});
}

function DodajKarticuProfil(Korisnik) {
	DodajKarticu("Profil", $(TabelaProfilKorisnika(Korisnik)), false);
	$("#btnProfilEdit").click(TogleEditProfileData);
	$("#btnProfilSacuvaj").click(TogleEditProfileData);
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
				'<button id="btnProfilEdit">Izmeni</button>'+
				'<button id="btnProfilSacuvaj">Sačuvaj</button>';
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