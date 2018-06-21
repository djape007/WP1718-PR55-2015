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
                return Json(MainStorage.Instanca.Komentari.Lista);
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
    }
}