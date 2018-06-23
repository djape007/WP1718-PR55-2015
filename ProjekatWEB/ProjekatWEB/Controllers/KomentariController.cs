using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Komentari")]
    public class KomentariController : Controller
    {
        [HttpGet("{token}")]
        public JsonResult Get(string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Musterija | TipNaloga.Dispecer)) {
                List<Komentar> sviKomentari = Helper.KlonirajObjekat<List<Komentar>>(MainStorage.Instanca.Komentari.Lista);

                foreach(Komentar k in sviKomentari) {
                    k.AutorOBJ = MainStorage.Instanca.NadjiKorisnikaPoId(k.Autor);
                    k.VoznjaOBJ = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == k.Voznja);
                }

                return Json(sviKomentari);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpGet("{id}/{token}")]
        public JsonResult Get(int id, string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Musterija | TipNaloga.Dispecer)) {
                Komentar k = MainStorage.Instanca.Komentari.FirstOrDefault(x => x.ID == id);

                if (k == null) {
                    return Json("ERROR_COMMENT_DOES_NOT_EXIST");
                }
                k = Helper.KlonirajObjekat<Komentar>(k);
                k.VoznjaOBJ = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == k.Voznja);
                k.AutorOBJ = MainStorage.Instanca.NadjiKorisnikaPoId(k.Autor);
                
                return Json(k);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpDelete("{id}/{token}")]
        public JsonResult Delete(int id, string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Musterija | TipNaloga.Dispecer)) {
                Komentar k = MainStorage.Instanca.Komentari.FirstOrDefault(x => x.ID == id);

                if (k != null) {
                    MainStorage.Instanca.Komentari.Remove(k);
                }

                return Json("OK");
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("{token}")]
        public JsonResult Post(string token, string komentar, int autorId, int voznjaId, int ocena = 0) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Musterija | TipNaloga.Dispecer)) {
                if (ocena > 5 || ocena < 0) {
                    return Json("ERROR_OCENA_LOSA");
                }

                if (!Validator.StringValidator(komentar, null, null, false)) {
                    return Json("ERROR_COMMENT_MISSING");
                }

                Korisnik tmpK = MainStorage.Instanca.NadjiKorisnikaPoId(autorId);
                if (tmpK == null) {
                    return Json("ERROR_AUTHOR_DOES_NOT_EXIST");
                }

                Voznja tmpV = MainStorage.Instanca.Voznje.FirstOrDefault(x => x.ID == voznjaId);
                if (tmpV == null) {
                    return Json("ERROR_RIDE_DOES_NOT_EXIST");
                }

                Komentar k = new Komentar(postaviDatum: true) {
                    Autor = autorId,
                    OcenaVoznje = ocena,
                    Opis = komentar,
                    Voznja = voznjaId
                };

                MainStorage.Instanca.Komentari.Add(k);
                return Json("OK_" + k.ID.ToString());
            } else {
                return Helper.ForbidenAccessJson();
            }
        }
    }
}