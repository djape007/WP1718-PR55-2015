$(document).ready(function(){
	$("#btnLogout").click(Logout);
	Init();
	AjaxGetKorisnika(ACC_ID, true, LateInit);
});

var ACC_ID = -1;
var ACC_TYPE = "";
var ACCESS_TOKEN = "";
var KORISNIK = null;
var IMA_AKTIVNA_VOZNJA = false;
var SVE_PRIKAZANE_VOZNJE = null;

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
	
	PrikaziVoznjeKorisnika();
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

function PrikaziVoznjeKorisnika() {
	AjaxZahtevMojeVoznje();
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
	$("#btnDispNovaVoznja").click(PrikaziKarticuKreirajVoznju);
	$("#btnDispMojeVoznje").click(AjaxZahtevMojeVoznje);
	$("#btnDispSveVoznje").click(AjaxZahtevSveVoznje);
}

function DodajKarticuMusterijaKontrole() {
	DodajKarticu("Ostale kontrole", NapraviHTMLMusterijaKontrole(), false);
	$("#btnMustZakazi").click(PrikaziKarticuKreirajVoznju);
	$("#btnMustMojeVoznje").click(AjaxZahtevMojeVoznje);
}

function DodajKarticuVozacKontrole() {
	DodajKarticu("Ostale kontrole", NapraviHTMLVozacKontrole(), false);
	$("#btnVozaMojeVoznje").click(AjaxZahtevMojeVoznje);
	$("#btnVozaVoznjeNaCekanju").click(PrikaziVoznjeNaCekanju);
}

function PrikaziVoznjeNaCekanju() {
	if (ACC_TYPE === "Vozac") {
		AjaxZahtevSveVoznje(NapraviFilter("Kreirana"));
	}
}

function DodajKarticuPrikazVoznji(naslov, voznjeZaPrikaz, customIDkartice, filter = null, sort = null) {
	console.log(voznjeZaPrikaz);
	SVE_PRIKAZANE_VOZNJE = voznjeZaPrikaz;
	//da li korisnik ima aktivnu voznju (koja moze da se otkaze)
	if (ACC_TYPE == "Musterija") {
		for(var v in voznjeZaPrikaz) {
			if (STATUS_VOZNJE_FROM_INT[voznjeZaPrikaz[v]['status']] == "Kreirana") {
				IMA_AKTIVNA_VOZNJA = true;
			}
		}
	}
	
	if (!($("body").hasClass(customIDkartice))) {
		$("body").addClass(customIDkartice);
		DodajKarticu(naslov, NapraviHTMLVoznjeKartica(voznjeZaPrikaz, filter, sort),true, function() { $("body").removeClass(customIDkartice); });
		$(".btnPrikaziKomentare").click(TogglePrikaziKomentareVoznje);
		$(".btnSakrijKomentare").click(TogglePrikaziKomentareVoznje);
		$("#btnFiltriraj").click(BtnFiltrirajClick);
		jQuery('#dtpickOD').datetimepicker({
			//format: 'Y-m-d H',
			step: 10
		});
		jQuery('#dtpickDO').datetimepicker({
			//format: 'Y-m-d H',
			step: 10
		});
	}
}

function NapraviHTMLVoznjeKartica(voznjeZaPrikaz, filter = null, sort = null) {
	var sveVoznje = "";
	
	var selectStatusiVoznje = "";
	selectStatusiVoznje += "<option value=''></option>";
	for(var status in STATUS_VOZNJE_FROM_INT) {
		selectStatusiVoznje += "<option value='"+STATUS_VOZNJE_FROM_INT[status]+"'>"+STATUS_VOZNJE_FROM_INT[status]+"</option>";
	}
	
	var toolbarHtmlDispecerDodatak = "";
	
	if (ACC_TYPE == "Dispecer") {
		toolbarHtmlDispecerDodatak = "<div class='col-12'><span>Vozač: ime</span><input id='filtVozIme' type='text'> Prezime<input id='filtVozPrez' type='text'></div>"+
								"<div class='col-12'><span>Mušterija: ime</span><input id='filtMustIme' type='text'> Prezime<input id='filtMustPrez' type='text'></div>";
	}
	
	var toolbarHtml = 	"<div class='col-12'>"+
					"<div class='centriraj col-12'>Filteri</div>"+
					"<div class='col-12'>"+
						"<div class='col-12'><span>Status:</span><select id='filterStatus'>"+
						selectStatusiVoznje + "</select></div>" +
						"<div class='col-12'><span> Datum OD:</span><input id='dtpickOD' type='text'><span> DO:</span><input id='dtpickDO' type='text'></div>"+
						"<div class='col-12'><span> Ocena:</span><select id='ocenaOd'><option value=''></option><option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select>-<select id='ocenaDo'><option value=''></option><option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></div>"+
						"<div class='col-12'><span> Cena:</span><input id='cenaOd' type='text'>-<input id='cenaDo' type='text'></div>"+
						toolbarHtmlDispecerDodatak + 
					"<button class='dugme flotujDesno' id='btnFiltriraj'>Filtriraj</button></div></div>";
	
	sveVoznje = NapraviHTMLSveVoznje(voznjeZaPrikaz, filter, sort);
	
	return $(toolbarHtml + sveVoznje);
}

function NapraviHTMLSveVoznje(voznjeZaPrikaz, filter = null, sort = null) {
	var ispunjavajuUslove = [];
	if (filter != null) {
		for(var v in voznjeZaPrikaz) {
			var voznja = voznjeZaPrikaz[v];
			if (VoznjaIspunjavaUslov(voznja, filter)) {
				ispunjavajuUslove.push(voznja);
			}
		}
	} else {
		ispunjavajuUslove = voznjeZaPrikaz;
	}
	
	var sveVoznje = "";
	if (ispunjavajuUslove.length == 0) {
		sveVoznje = "<h4>Nema vožnji</h4>";
	} else {
		for(var v in ispunjavajuUslove) {
			var voznja = ispunjavajuUslove[v];
			sveVoznje += NapraviHTMLJedneVoznje(voznja);
		}
		
		if (sort != null) {
			//todo sort
		}
	}
	return "<div id='ovoZameniPrilikomPrimeneFilteraSorta'>" + sveVoznje + "</div>";
}

function BtnFiltrirajClick() {
	var $nesto = $(this).parent().parent().parent();
	
	var _status = $nesto.find("#filterStatus").val();
	var _datumOd = moment($nesto.find("#dtpickOD").val()).format("YYYY-MM-DDTHH:mm:ssZ");
	var _datumDo = moment($nesto.find("#dtpickDO").val()).format("YYYY-MM-DDTHH:mm:ssZ");
	var _ocenaOd = $nesto.find("#ocenaOd").val();
	var _ocenaDo = $nesto.find("#ocenaDo").val();
	var _cenaOd = $nesto.find("#cenaOd").val();
	var _cenaDo = $nesto.find("#cenaDo").val();
	var _vozIme = null;
	var _vozPrez = null;
	var _mustIme = null;
	var _mustPrez = null;
	
	if (ACC_TYPE == "Dispecer") {
		_vozIme = $nesto.find("#filtVozIme").val().trim();
		_vozPrez = $nesto.find("#filtVozPrez").val().trim();
		_mustIme = $nesto.find("#filtMustIme").val().trim();
		_mustPrez = $nesto.find("#filtMustPrez").val().trim();
	}
	
	//prvo proverimo uneto
	if (_cenaOd != "") {
		_cenaOd = parseFloat(_cenaOd);
		if (isNaN(_cenaOd)) {
			DisplayError("Cena OD nije broj");
			return;
		}
	} else {
		_cenaOd = null;
	}
	
	if (_cenaDo != "") {
		_cenaDo = parseFloat(_cenaDo);
		if (isNaN(_cenaDo)) {
			DisplayError("Cena DO nije broj");
			return;
		}
	} else {
		_cenaDo = null;
	}
	
	if (_ocenaOd != "" && _ocenaDo != "") {
		if (_ocenaOd > _ocenaDo) {
			DisplayError("Filter ocene nije ispravan");
			return;
		}
	}
	
	_datumDo = (_datumDo == "Invalid date") ? null : _datumDo;
	_datumOd = (_datumOd == "Invalid date") ? null : _datumOd;
	
	var filter = NapraviFilter(_status, _datumOd, _datumDo, _ocenaOd, _ocenaDo, _cenaOd, _cenaDo, _vozIme, _vozPrez, _mustIme, _mustPrez);
	console.log(filter);
	$nesto.find("#ovoZameniPrilikomPrimeneFilteraSorta").replaceWith(NapraviHTMLSveVoznje(SVE_PRIKAZANE_VOZNJE, filter));
	$(".btnPrikaziKomentare").click(TogglePrikaziKomentareVoznje);
	$(".btnSakrijKomentare").click(TogglePrikaziKomentareVoznje);
	TOASTUJ("Filter je primenjen!");
}

function NapraviHTMLJedneVoznje(voznja) {
	var dodatneKlase = "";
	var mozeDaSeOtkaze = false;
	var statusVoznjeZaPrikaz = STATUS_VOZNJE_FROM_INT[voznja['status']];
	
	if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Otkazana") {
		dodatneKlase = " voznjaOtkazana";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Kreirana") {
		dodatneKlase = " voznjaKreirana";
		if (ACC_TYPE != "Vozac") {
			mozeDaSeOtkaze = true;
		}
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Formirana") {
		dodatneKlase = " voznjaKreirana";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "UToku") {
		dodatneKlase = " voznjaUToku";
		statusVoznjeZaPrikaz = "U toku";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Uspesna") {
		dodatneKlase = " voznjaUspesna";
		statusVoznjeZaPrikaz = "Uspešna";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Neuspesna") {
		dodatneKlase = " voznjaNeuspsna";
		statusVoznjeZaPrikaz = "Neuspešna";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Obradjena") {
		dodatneKlase = " voznjaObradjena";
		statusVoznjeZaPrikaz = "Obrađena";
	} else if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Prihvacena") {
		statusVoznjeZaPrikaz = "Prihvaćena";
	}
	
	var datumStr = moment(voznja['datumNarucivanja']).format("DD.MM.YYYY. HH:mm:ss");
	
	var vozacPrikaz = "-";
	var dispecerPrikaz = "-";
	var musterijaPrikaz = "-";
	
	if (voznja['dispecerOBJ'] != null) {
		dispecerPrikaz = voznja['dispecerOBJ']['username'] + " (" + voznja['dispecerOBJ']['ime'] +  ")";
	}
	
	if (voznja['musterijaOBJ'] != null) {
		musterijaPrikaz = voznja['musterijaOBJ']['username'] + " (" + voznja['musterijaOBJ']['ime'] +  ")";
	}
	
	if (voznja['vozacOBJ'] != null) {
		vozacPrikaz = voznja['vozacOBJ']['username'] + " (" + voznja['vozacOBJ']['ime'] +  ")";
	}

	var tipVozilaPrikaz = voznja['tipAutomobila'] == 0 ? "Automobil" : "Kombi";
	
	var vozacDispecerInfo = 	"<span class='voznjaVozac'>Vozač: "+vozacPrikaz+"</span></br>"+
						"<span class='voznjaDispecer'>Dispečer: "+dispecerPrikaz+"</span></br>"+
						"<span class='voznjaMusterija'>Mušterija: "+musterijaPrikaz+"</span></br>";
						
	var basicInfoOVoznji = 	"<span class='voznjaStatus'>Status: "+statusVoznjeZaPrikaz+"</span></br>"+
						"<span class='voznjaDatum'>Datum: "+datumStr+"</span></br>"+
						"<span class='voznjaCena'>Cena: "+voznja['iznos']+"</span></br>"+
						"<span class='tipVozila'>Vozilo: "+tipVozilaPrikaz+"</span>";
	
	
	var sviKomentari = NapraviHtmlSviKomentari(voznja['komentariOBJ']);
	
	var redDugmeOtkazi = ((mozeDaSeOtkaze) ? "<button class='dugme otkaziVoznju'>Otkaži</button></br>" : "<div>Otkazivanje nije moguće</div>");
	if (STATUS_VOZNJE_FROM_INT[voznja['status']] == "Kreirana") {
		if (ACC_TYPE == "Vozac") {
			redDugmeOtkazi = "<button class='dugme prihvatiVoznju'>Prihvati vožnju</button></br>";
		} else if (ACC_TYPE == "Dispecer") {
			redDugmeOtkazi = "<button class='dugme dodeliVoznju'>Dodeli vožnju</button></br>";
		}
	}
	
	var s = 	"<div class='col-12 jednaVoznjaCont "+dodatneKlase+"' idVoznje='"+voznja['id']+"' statusVoznje='"+voznja['status']+"'>"+
				"<div class='col-12'>"+
					"<div class='col-3 centriraj'>"+
						"<span class='idVoznje'>ID: "+voznja['id']+"</span></br>"+
						redDugmeOtkazi+
						"<button class='dugme btnPrikaziKomentare'>Prikaži komentare</button>"+
						"<button class='dugme btnSakrijKomentare'>Zatvori komentare</button>"+
					"</div>"+
					"<div class='col-9'>"+
						"<div class='col-6'>" +basicInfoOVoznji+"</div>"+
						"<div class='col-6'>" +vozacDispecerInfo+"</div>"+
					"</div>"+
				"</div>"+
				"<div class='col-12 sviKomentari centriraj'>"+
					sviKomentari+
				"</div>"+
			"</div>";
	return s;
}

function TogglePrikaziKomentareVoznje() {
	$objVoznja = $(this).parent().parent().parent();
	if ($objVoznja.hasClass("KOMENTARIPRIKAZANI")) {
		$objVoznja.removeClass("KOMENTARIPRIKAZANI");
		$objVoznja.find(".sviKomentari").first().hide();
		
		$objVoznja.find(".btnSakrijKomentare").first().hide();
		$objVoznja.find(".btnPrikaziKomentare").first().show();
	} else {
		$objVoznja.addClass("KOMENTARIPRIKAZANI");
		$objVoznja.find(".sviKomentari").first().show();
		
		$objVoznja.find(".btnPrikaziKomentare").first().hide();
		$objVoznja.find(".btnSakrijKomentare").first().show();
	}
}

function NapraviHtmlSviKomentari(komentari) {
	var s = "";
	if (komentari.length == 0) {
		s = "<span class='porukaNemaKomentara'>Nema komentara za ovu vožnju</span>";
	} else {
		for(var k in komentari) {
			var komentar = komentari[k];
			var datumStr = moment(komentar['datumObjave']).format("DD.MM.YYYY. HH:mm:ss");
			var ocenaPrikaz = (komentar['ocenaVoznje'] == 0)? "Nije ocenjeno": (komentar['ocenaVoznje'] + "/5") ;
			
			s += "<div class='col-12 jedanKomentar'>"+
					"<div class='col-3'>"+
					"<span class='komentarAutor'>Autor: "+ komentar['autorOBJ']['username'] +"</span></br>"+
					"<span class='komentarOcena'>Ocena: "+ ocenaPrikaz+"</span></br>"+
					"<span class='komentarDatum'>Datum: "+ datumStr+"</span>"+
					"</div><div class='col-9'>"+
					"<span>Poruka:</span></br>"+
					"<span class='komentarOpis'>"+ komentar['opis']+"</span></div>"+
				"</div>";
		}
	}
	return s;
}

function NapraviHTMLDispecerKontrole() {
	var s = 	"<button class='dugme' id='btnDispSveVoznje'>Prikaži sve vožnje</button>"+
			"<button class='dugme' id='btnDispDodajVozaca'>Napravi nalog vozača</button>"+
			"<button class='dugme' id='btnDispMojeVoznje'>Prikaži moje vožnje</button>"+
			"<button class='dugme' id='btnDispNovaVoznja'>Kreiraj novu vožnju</button>"+
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
			$(this).replaceWith($('<span id="'+id+'" class="propVal">'+$(this).val()+'</span>'));
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
		
		//za promenu sifre
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
	
	
	if (ValidateUserAccountInput(korIme, passw, passw_re, email, ime, prezime, jmbg, tel, true)) {
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
	} else {
		return false;
	}
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

function AjaxZahtevMojeVoznje() {
	//if (!($("body").hasClass("MOJEVOZNJEKARTICA"))) {
	if (!($("body").hasClass("PRIKAZANEVOZNJEKARTICA"))) {
		var url = "/api/Voznje/WhereCustomer/" + ACC_ID + "/" + ACCESS_TOKEN;
		
		if (ACC_TYPE == "Dispecer") {
			url = "/api/Voznje/WhereDispatcher/" + ACC_ID + "/" + ACCESS_TOKEN;
		} else if (ACC_TYPE == "Vozac") {
			url = "/api/Voznje/WhereDriver/" + ACC_ID + "/" + ACCESS_TOKEN;
		}
		
		$.get(url, {}, function (data) {
			if (data == null && data != []) {
				TOASTUJ("Došlo je do greške");
			} else if (data.indexOf("ERROR_") != -1) {
				TOASTUJ(data);
			} else {
				//DodajKarticuPrikazVoznji("Moje vožnje", data, "MOJEVOZNJEKARTICA");
				DodajKarticuPrikazVoznji("Moje vožnje", data, "PRIKAZANEVOZNJEKARTICA");
			}
		}); 
	} else {
		DisplayError("Kartica sa vožnjama je već otvorena");
	}
}

function AjaxZahtevSveVoznje(filter = null, sort = null) {
	//if (!($("body").hasClass("SVEVOZNJEKARTICA")) && ACC_TYPE != "Musterija") {
	if (!($("body").hasClass("PRIKAZANEVOZNJEKARTICA")) && ACC_TYPE != "Musterija") {
		var url = "/api/Voznje/" + ACCESS_TOKEN;
		
		$.get(url, {}, function (data) {
			if (data == null && data != []) {
				TOASTUJ("Došlo je do greške");
			} else if (data.indexOf("ERROR_") != -1) {
				TOASTUJ(data);
			} else {
				//DodajKarticuPrikazVoznji("Sve vožnje", data, "SVEVOZNJEKARTICA", filter, sort);
				DodajKarticuPrikazVoznji("Sve vožnje", data, "PRIKAZANEVOZNJEKARTICA", filter, sort);
			}
		}); 
	}
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
		"<tr><td><span class='propName'>Šifra</span></td>			<td><input id='vozNNpassword1' type='password'/></td></tr>"+
		"<tr><td><span class='propName'>Šifra ponovo</span></td>	<td><input id='vozNNpassword2' type='password'/></td></tr>"+
		"<tr><td><span class='propName'>Ime</span></td>			<td><input id='vozNNime' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Prezime</span></td>		<td><input id='vozNNprezime' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>JMBG</span></td>			<td><input id='vozNNjmbg' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Email</span></td>			<td><input id='vozNNemail' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Telefon</span></td>		<td><input id='vozNNtelefon' type='text'/></td></tr>"+
		"<tr><td><span class='propName'>Pol</span></td>			<td><select id='vozNNpol'><option value='M'>M</option><option value='Z'>Ž</option></select></td></tr>"+
		"</tbody></table>"+
		"<button class='dugme flotujDesno' id='napraviNalogVozaca'>Napravi nalog</button>";
		$("body").addClass("NOVINALOGVOZACA");
		
		DodajKarticu("Novi nalog - Vozač", $(sadrzaj), true, NapraviNalogVozacaCleanUp);
		$("#napraviNalogVozaca").click(NapraviNalogVozacaBtnClick);
	}
}

function NapraviNalogVozacaBtnClick() {
	var korIme = $("#vozNNusername").val();
	var passw = $("#vozNNpassword1").val();
	var passw_re = $("#vozNNpassword2").val();
	var email = $("#vozNNemail").val();
	var ime = $("#vozNNime").val();
	var prezime = $("#vozNNprezime").val();
	var jmbg = $("#vozNNjmbg").val();
	var tel = $("#vozNNtelefon").val();
	var pol = $("#vozNNpol").val();
	
	if (ValidateUserAccountInput(korIme, passw, passw_re, email, ime, prezime, jmbg, tel)) {
		AjaxNapraviNalogVozaca(korIme, passw, ime, prezime, pol,tel, jmbg, email);
	}
}

function AjaxNapraviNalogVozaca(_username, _password, _ime, _prezime, _pol, _telefon, _jmbg, _email) {
	$.post("/api/Register/" + ACCESS_TOKEN, { username: _username, password: _password, ime: _ime, prezime: _prezime, pol: _pol, email: _email, telefon: _telefon, jmbg: _jmbg, tipNaloga_str: "Vozac"}, function (data) {
        if (data === "OK") {
            TOASTUJ("Nalog je kreiran");
        } else if (data === "ERROR_USERNAME_EXISTS") {
            DisplayError("Korisničko ime već postoji");
        } else if (data === "ERROR_FORM_NOT_COMPLETE") {
            DisplayError("Neko polje nije popunjeno :(");
        } else if (data.indexOf("ERROR") != -1) {
            DisplayError(data);
        }
    }, "json");
}

//poziva se kad se zatvori kartica za pravljenje novog naloga vozaca
function NapraviNalogVozacaCleanUp() {
	$("body").removeClass("NOVINALOGVOZACA");
}

function PrikaziKarticuKreirajVoznju() {
	if (IMA_AKTIVNA_VOZNJA) {
		TOASTUJ("POSTOJI AKTIVNA VOŽNJA");
	} else if (!($("body").hasClass("KARTICANOVAVOZNJA"))) {
		if (ACC_TYPE == "Musterija") {
			$("body").addClass("KARTICANOVAVOZNJA");
			DodajKarticu("Nova vožnja", KarticaNovaVoznjaHTMLSadrzaj(), true, KarticaNovaVoznjaCleanUp);
			$("#btnNapraviNovuVoznju").click(btnNapraviVoznjuClick);
		} else if (ACC_TYPE == "Dispecer") {
			$.get("/api/Korisnici/AvailableDrivers/" + ACCESS_TOKEN, {}, function (dataVozaci) {
				$.get("/api/Korisnici/" + ACCESS_TOKEN, {}, function (dataKorisnici) {
					$("body").addClass("KARTICANOVAVOZNJA");
					DodajKarticu("Nova vožnja", KarticaNovaVoznjaHTMLSadrzaj(dataVozaci, dataKorisnici['Musterije']), true, KarticaNovaVoznjaCleanUp);
					$("#btnNapraviNovuVoznju").click(btnNapraviVoznjuClick);
				});
			});
		}
	}
}

function KarticaNovaVoznjaHTMLSadrzaj(slobodniVozaci = null, musterije = null) {
	var dodatneMogucnosti = "";
	if (ACC_TYPE == "Dispecer" && slobodniVozaci != null && musterije != null) {

		var inputVozaci = "";
		if (slobodniVozaci.length == 0) {
			inputVozaci = "<span id='blokirajKreiranjeVoznje'>Nema slobodnih vozača</span>";
		} else {
			inputVozaci = "<select id='novVoznjaSlobVozacID'>";
			for (var voz in slobodniVozaci) {
				inputVozaci += "<option value='"+slobodniVozaci[voz]['id']+"'>"+slobodniVozaci[voz]['username'] + "</option>";
			}
			inputVozaci += "</select>";
		}

		var inputMusterije = "<select id='novVoznjaMusterijeID'>";
		inputMusterije += "<option value='-1'>Van sistema</option>";
		for (var must in musterije) {
			inputMusterije += "<option value='"+musterije[must]['id']+"'>"+musterije[must]['username'] + "</option>";
		}
		inputMusterije += "</select>";

		dodatneMogucnosti = "<h3>Dodatne postavke:</h3><table><tbody>"+
		"<tr><td><span class='propName'>Mušterija:</span></td>			<td>"+inputMusterije+"</td></tr>"+
		"<tr><td><span class='propName'>Vozač:</span></td>			<td>"+ inputVozaci+"</td></tr>"+
		"</tbody></table>";
	}
	
	var s = "<div class='col-12'>Potrebno vozilo:<select id='novVoznjaTipVozila'><option value='PutnickiAuto'>Auto</option><option value='Kombi'>Kombi</option></select></div><div class='col-6 pocLokacija'><h3>Početna lokacija:</h3><table><tbody>"+
	"<tr><td><span class='propName'>X</span></td>			<td><input id='novVoznjaStartX' type='text'/></td></tr>"+
	"<tr><td><span class='propName'>Y</span></td>			<td><input id='novVoznjaStartY' type='text'/></td></tr>"+
	"<tr><td><span class='propName'>Ulica</span></td>			<td><input id='novVoznjaStartUlica' type='text'/></td></tr>"+
	"<tr><td><span class='propName'>Broj</span></td>			<td><input id='novVoznjaStartBroj' type='text'/></td></tr>"+
	"<tr><td><span class='propName'>Mesto</span></td>			<td><input id='novVoznjaStartMesto' type='text'/></td></tr>"+
	"<tr><td><span class='propName'>Poštanski broj</span></td>	<td><input id='novVoznjaStartPostBr' type='text'/></td></tr>"+
	"</tbody></table></div>"+
	"<div class='col-6 destLokacija'>"+dodatneMogucnosti+"</div>"+
	"<div class='col-12'><button class='dugme flotujDesno' id='btnNapraviNovuVoznju'>Napravi vožnju</button></div>";
	
	return $(s);
}

function KarticaNovaVoznjaCleanUp() {
	$("body").removeClass("KARTICANOVAVOZNJA");
}

function btnNapraviVoznjuClick() {
	if ($("#blokirajKreiranjeVoznje").length) {
		TOASTUJ("Nije moguće napraviti vožnju, nema slobodnih vozača");
		return;
	}

	var tipVoznje = $("#novVoznjaTipVozila").val();
	var startX = parseFloat($("#novVoznjaStartX").val());
	var startY = parseFloat($("#novVoznjaStartY").val());
	var startUlica = $("#novVoznjaStartUlica").val();
	var startBroj = $("#novVoznjaStartBroj").val();
	var startMesto = $("#novVoznjaStartMesto").val();
	var startPostanskiBr = $("#novVoznjaStartPostBr").val();

	var musterijaID = -1;
	var vozacID = -1;
	var dispecerID = -1;

	if (isNaN(startX)) {
		TOASTUJ("Početna lok. X nije ispravno");
		return;
	}

	if (isNaN(startY)) {
		TOASTUJ("Početna lok. Y nije ispravno");
		return;
	}

	if (ACC_TYPE == "Dispecer") {
		musterijaID = $("#novVoznjaMusterijeID").val();
		vozacID = $("#novVoznjaSlobVozacID").val();
		dispecerID = ACC_ID;
	} else if (ACC_TYPE == "Musterija") {
		musterijaID = ACC_ID;
	}

	var startObj = NapraviObjekatLokacija(startX, startY, startUlica, startBroj, startMesto, startPostanskiBr);

	startObj = JSON.stringify(startObj);

	$.post("/api/Voznje/" + ACCESS_TOKEN, {
		pocetnaLokacijaJSON: startObj,
		tipAutomobila: tipVoznje,
		musterijaId: musterijaID,
		dispecerId: dispecerID,
		vozacId: vozacID
	}, function (data) {
		if (data.indexOf("ERROR_") != -1) {
			DisplayError(data);
		} else if (data.indexOf("OK_") != -1 ) {
			TOASTUJ("Vožnja je kreirana");
		}
	});
}

function AjaxPostaviStatusVoznje(idVoznje, status, callback = null) {
	$.post("/api/Voznje/SetStatus/" + idVoznje + "/" + ACCESS_TOKEN, {newStatus: status}, function (data) {
		if (data.indexOf("ERROR_") != -1) {
			DisplayError("data");
		} else if (data.indexOf("OK_") != -1) {
			if (callback != null) {
				callback();
			}
		}
	});
}