using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Automobili")]
    public class AutomobiliController : Controller
    {
        [HttpGet("{id}/{token}")]
        public JsonResult Get(string id, string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac)) {
                Automobil a = MainStorage.Instanca.Automobili.FirstOrDefault(x => x.BrojVozila == id);

                if (a == null) {
                    return Json("ERROR_CAR_DOES_NOT_EXIST");
                }

                if (a.VozacID != Korisnik.GetIDFromToken(token)) {
                    return Json("ERROR_YOU_ARE_NOT_OWNER");
                }
                
                return Json(a);
            } else {
                return Helper.ForbidenAccessJson();
            }
        }

        [HttpPost("{token}")]
        public JsonResult Post(string token, string brojVozila, int godiste, string tip, int idVozaca = -1) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Automobil a = null;
                try {
                    a = new Automobil() {
                        BrojVozila = brojVozila,
                        GodisteAutomobila = godiste,
                        TipAutomobila = Helper.TipAutomobilaFromString(tip),
                        VozacID = idVozaca
                    };
                    return Json("OK_" + a.BrojVozila);
                } catch {
                    return Json("ERROR_DATA_NOT_CORRECT_OR_MISSING");
                }
            } else {
                return Helper.ForbidenAccessJson();
            }
        }
    }
}