$(document).ready(function(){
	$("#btnLogout").click(Logout);
});

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