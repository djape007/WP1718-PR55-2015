using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Korisnici")]
    public class KorisniciController : Controller
    {
        [HttpGet("{id}/{token}")]
        public JsonResult Get(int id, string token) {
            if (id > 0 && Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Musterija | TipNaloga.Vozac)) {
                Korisnik k = MainStorage.Instanca.NadjiKorisnikaPoId(id);

                if (k.TipNaloga == TipNaloga.Vozac) {
                    Vozac v = Helper.KlonirajObjekat<Vozac>(MainStorage.Instanca.Vozaci.FirstOrDefault(x => x.ID == k.ID));
                    if (v.Automobil != null && v.Automobil != "") {
                        v.AutomobilOBJ = MainStorage.Instanca.Automobili.FirstOrDefault(x => x.BrojVozila == v.Automobil);
                    }
                    k = v;
                }

                return Json(k);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpGet("{token}")]
        public JsonResult Get(string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer)) {

                Dictionary<string, object> vrati = new Dictionary<string, object>() {
                    { "Musterije", MainStorage.Instanca.Musterije.Lista },
                    { "Dispeceri", MainStorage.Instanca.Dispeceri.Lista }
                };

                List<Vozac> sviVozaci = Helper.KlonirajObjekat<List<Vozac>>(MainStorage.Instanca.Vozaci.Lista);
                foreach(Vozac v in sviVozaci) {
                    v.AutomobilOBJ = MainStorage.Instanca.Automobili.FirstOrDefault(x => x.BrojVozila == v.Automobil);
                }

                vrati.Add("Vozaci", sviVozaci);

                return Json(vrati);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{token}")]
        public JsonResult IsUsernameFree (string token, string username) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Musterija | TipNaloga.Vozac)) {
                if (Korisnik.UsernameIsFree(username)) {
                    return Json(true);
                } else {
                    return Json(false);
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("{id}/{token}")]
        public JsonResult Post(int id, string token, string username, string password, string pol, string email, string jmbg, string telefon, string ime, string prezime) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Musterija | TipNaloga.Vozac)) {
                if (Korisnik.GetIDFromToken(token) != id) {
                    return Json("ERROR_CANT_EDIT_OTHER_ACCOUNT_DATA");
                }

                Korisnik k = MainStorage.Instanca.NadjiKorisnikaPoId(id);
                
                if (k == null) {
                    return Json("ERROR_ACCOUNT_DOES_NOT_EXIST");
                }

                if (!k.Username.Equals(username)) {
                    if (!Validator.StringValidator(username, null, null, false, 4, 20)) {
                        return Json("ERROR_USERNAME_NOT_CORRECT");
                    } else if (!Korisnik.UsernameIsFree(username)) {
                        return Json("ERROR_USERNAME_IN_USE");
                    } else {
                        Korisnik.RemoveUsernameInUse(k.Username);
                        k.Username = username;
                    }
                }

                if (!k.Password.Equals(password)) {
                    if (!Validator.StringValidator(password, null, null, false, 4, 35)) {
                        return Json("ERROR_PASSWORD_NOT_CORRECT");
                    } else {
                        k.Password = password;
                    }
                }

                if (!k.Ime.Equals(ime)) {
                    if (!Validator.StringValidator(ime, null, null, false, 2, 25)) {
                        return Json("ERROR_IME_NOT_CORRECT");
                    } else {
                        k.Ime = ime;
                    }
                }

                if (!k.Prezime.Equals(prezime)) {
                    if (!Validator.StringValidator(prezime, null, null, false, 2, 25)) {
                        return Json("ERROR_PREZIME_NOT_CORRECT");
                    } else {
                        k.Prezime = prezime;
                    }
                }

                if (!Validator.StringValidator(pol, null, null, false, 1, 1)) {
                    return Json("ERROR_POL_NOT_CORRECT");
                } else {
                    k.Pol = (pol.Equals("M")) ? PolOsobe.Musko : PolOsobe.Zensko;
                }

                if (!k.Email.Equals(email)) {
                    if (!Validator.StringValidator(email, new string[] { "@", "." }, null, false, 5, 50)) {
                        return Json("ERROR_EMAIL_NOT_CORRECT");
                    } else {
                        k.Email = email;
                    }
                }

                telefon = telefon.Replace("+", "");
                telefon = telefon.Replace("-", "");
                telefon = telefon.Replace("/", "");
                telefon = telefon.Replace("  ", "");
                telefon = telefon.Replace(" ", "");

                if (!k.Telefon.Equals(telefon)) {
                    if (!Validator.StringValidator(telefon, null, null, true, 5, 13)) {
                        return Json("ERROR_PHONE_NOT_CORRECT");
                    } else {
                        k.Telefon = telefon;
                    }
                }

                if (!k.JMBG.Equals(jmbg)) {
                    if (!Validator.StringValidator(jmbg, null, null, true, 13, 13)) {
                        return Json("ERROR_JMBG_NOT_CORRECT");
                    } else {
                        k.JMBG = jmbg;
                    }
                }

                MainStorage.Instanca.UpdateKorisnika(k);
                return Json("OK");
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [Route("[action]/{id}/{token}")]
        public JsonResult Toggle(int id, string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer)) {
                if (id > 0) {
                    Korisnik k = MainStorage.Instanca.NadjiKorisnikaPoId(id);
                    if (k != null) {
                        k.AktivanNalog = !k.AktivanNalog;
                        MainStorage.Instanca.UpdateKorisnika(k);
                        return Json("OK_" + k.AktivanNalog.ToString());
                    } else {
                        return Json("ERROR_ID_NOT_VALID");
                    }
                } else {
                    return Json("ERROR_ID_NOT_VALID");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{token}")]
        public JsonResult SetLocation(string token, string JSONLokacija) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac)) {
                int id = Korisnik.GetIDFromToken(token);
                if (id > 0) {
                    Vozac k = MainStorage.Instanca.Vozaci.FirstOrDefault(x => x.ID == id);
                    if (k != null) {
                        try {
                            Lokacija lok = JsonConvert.DeserializeObject<Lokacija>(JSONLokacija);
                            k.TrenutnaLokacija = lok;
                            MainStorage.Instanca.UpdateKorisnika(k);
                            return Json("OK");
                        } catch {
                            return Json("ERROR_JSON_LOCATION_FORMAT_NOT_CORRECT");
                        }
                    } else {
                        return Json("ERROR_ID_NOT_VALID");
                    }
                } else {
                    return Json("ERROR_ID_NOT_VALID");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpGet("[action]/{token}")]
        public JsonResult AvailableDrivers(string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer)) {
                List<Voznja> sveVoznje = MainStorage.Instanca.Voznje.Lista;
                HashSet<int> idZauzetihVozaca = new HashSet<int>();
                foreach (Voznja v in sveVoznje) {
                    if (v.Status == StatusVoznje.Formirana || v.Status == StatusVoznje.Prihvacena) {
                        if (!idZauzetihVozaca.Contains(v.VozacID)) {
                            idZauzetihVozaca.Add(v.VozacID);
                        }
                    }
                }

                List<Vozac> slobodniVozaci = Helper.KlonirajObjekat<List<Vozac>>(MainStorage.Instanca.Vozaci.FindAll(x => (!idZauzetihVozaca.Contains(x.ID))));

                foreach(Vozac v in slobodniVozaci) {
                    v.AutomobilOBJ = MainStorage.Instanca.Automobili.FirstOrDefault(x => x.BrojVozila == v.Automobil);
                }

                return Json(slobodniVozaci);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }
    }
}