$(document).ready(function(){
	$("#btnLogout").click(Logout);
	Init();
	AjaxGetKorisnika(ACC_ID);
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

function AjaxGetKorisnika(id) {
	$.get("/api/Korisnici/" + id.toString() + "/" + ACCESS_TOKEN , {}, function (data) {
		console.log(data);
		KORISNIK = data;
		DodajKarticuProfil(KORISNIK);
	});
}

function DodajKarticuProfil(Korisnik) {
	DodajKarticu("Profil", $(TabelaProfilKorisnika(Korisnik)), false);
}

function TabelaProfilKorisnika(Korisnik) {
	var polStr = "M";
	
	if (Korisnik['pol'] == 1) {
		polStr = "Z";
	}
	
	var profData= 	"<table id='tabelaProfil'>"+
					IspisiPropertyTableRow("Korisničko ime", Korisnik['username'], "username") + 
					//IspisiPropertyTableRow("Sifra", Korisnik['password'], "password") + 
					IspisiPropertyTableRow("Ime", Korisnik['ime'], "ime") +
					IspisiPropertyTableRow("Prezime", Korisnik['prezime'], "prezime") +
					IspisiPropertyTableRow("Pol", polStr, "pol") +
					IspisiPropertyTableRow("JMBG", Korisnik['jmbg'], "jmbg") +
					IspisiPropertyTableRow("Telefon", Korisnik['telefon'], "telefon") +
					IspisiPropertyTableRow("Email", Korisnik['email'], "email") +
				'</table>'+
				'<button id="btnProfilEdit">Izmeni</button>'+
				'<button id="btnProfilSacuvaj">Sačuvaj</button>';
	return profData;
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