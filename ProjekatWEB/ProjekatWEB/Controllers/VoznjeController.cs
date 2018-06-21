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
    [Route("api/Voznje")]
    public class VoznjeController : Controller {
        
        [HttpGet("{token}")]
        public JsonResult Get(string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac)) {
                return Json(MainStorage.Instanca.Voznje.Lista);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpGet("{id}/{token}")]
        public JsonResult Get(int id, string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac | TipNaloga.Musterija)) {
                if (id >= 0) {
                    var voznja = MainStorage.Instanca.Voznje.Find(x => x.ID == id);
                    return Json(voznja);
                } else {
                    return Json(null);
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("{token}")]
        public JsonResult Post(string token, string pocetnaLokacijaJSON, string krajnjaLokacijaJSON, int musterijaId = -1, int dispecerId = -1,int vozacId = -1) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac | TipNaloga.Musterija)) {
                if (pocetnaLokacijaJSON == null || krajnjaLokacijaJSON == null || pocetnaLokacijaJSON.Trim() == "") {
                    return Json("ERROR_LOCATIONS_ARE_NULL_OR_EMPTY");
                }

                Lokacija pocetak;
                Lokacija kraj;

                try {
                    pocetak = JsonConvert.DeserializeObject<Lokacija>(pocetnaLokacijaJSON);

                    if (krajnjaLokacijaJSON.Trim() == "") {
                        kraj = null;
                    } else {
                        kraj = JsonConvert.DeserializeObject<Lokacija>(krajnjaLokacijaJSON);
                    }
                } catch {
                    return Json("ERROR_JSON_STRING_LOCATION_FORMAT_NOT_CORRECT");
                }

                if (musterijaId > 0 && MainStorage.Instanca.NadjiKorisnikaPoId(musterijaId) == null) {
                    return Json("ERROR_CUSTOMER_ID_NOT_VALID");
                }

                if (vozacId > 0 && MainStorage.Instanca.NadjiKorisnikaPoId(vozacId) == null) {
                    return Json("ERROR_DRIVER_ID_NOT_VALID");
                }

                if (dispecerId > 0 && MainStorage.Instanca.NadjiKorisnikaPoId(dispecerId) == null) {
                    return Json("ERROR_DISPATCHER_ID_NOT_VALID");
                }

                Voznja v = new Voznja(postaviDatum: true) {
                    KomentarID = new List<int>(),
                    VozacID = vozacId,
                    MusterijaID = musterijaId,
                    DispecerID = dispecerId,
                    Status = ProjekatWEB.StatusVoznje.Formirana,
                    PocetnaLokacija = pocetak,
                    Odrediste = kraj,
                    Iznos = (kraj != null) ? Helper.IzracunajCenuVoznje(pocetak, kraj) : -1
                };

                MainStorage.Instanca.Voznje.Add(v);

                return Json("OK_" + v.ID.ToString());
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult AddComment(int id, string token, int idKomentara) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    Komentar tmpK = MainStorage.Instanca.Komentari.FirstOrDefault(x => x.ID == idKomentara);
                    if (tmpK != null) {
                        tmpV.KomentarID.Add(idKomentara);
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } else {
                        return Json("ERROR_COMMENT_ID_DOES_NOT_EXIST");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult SetDriver(int id, string token, int idVozaca) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    Vozac tmpVozac = MainStorage.Instanca.Vozaci.FirstOrDefault(x => x.ID == idVozaca);
                    if (tmpVozac != null) {
                        tmpV.VozacID = idVozaca;
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } else {
                        return Json("ERROR_DRIVER_ID_DOES_NOT_EXIST");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult SetDispatcher(int id, string token, int idDisa) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    Dispecer tmpDispecer = MainStorage.Instanca.Dispeceri.FirstOrDefault(x => x.ID == idDisa);
                    if (tmpDispecer != null) {
                        tmpV.DispecerID = idDisa;
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } else {
                        return Json("ERROR_DISPATCHER_ID_DOES_NOT_EXIST");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult SetStatus(int id, string token, string newStatus) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    try {
                        StatusVoznje sv = Helper.StatusVoznjeFromString(newStatus);
                        tmpV.Status = sv;
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } catch {
                        return Json("ERROR_DRIVE_STATUS_NOT_CORRECT");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult SetDestination(int id, string token, string krajLokacijaJSON) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    try {
                        Lokacija kraj = JsonConvert.DeserializeObject<Lokacija>(krajLokacijaJSON);
                        tmpV.Odrediste = kraj;
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } catch {
                        return Json("ERROR_LOCATION_JSON_FORMAT_NOT_CORRECT");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("[action]/{id}/{token}")]
        public JsonResult SetType(int id, string token, string tipVoznje) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == id);
                if (tmpV != null) {
                    try {
                        TipVoznje tiip = Helper.TipVoznjeFromString(tipVoznje);
                        tmpV.TipVoznje = tiip;
                        MainStorage.Instanca.UpdateVoznju(tmpV);
                        return Json("OK");
                    } catch {
                        return Json("ERROR_DRIVE_TYPE_NOT_CORRECT");
                    }
                } else {
                    return Json("ERROR_DRIVE_ID_DOES_NOT_EXIST");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }
    }
}