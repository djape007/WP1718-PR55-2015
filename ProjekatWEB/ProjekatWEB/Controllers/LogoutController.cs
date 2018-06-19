using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Logout")]
    public class LogoutController : Controller
    {
        [HttpGet("{token}")]
        public JsonResult Logout(string token) {
            if (token != null && Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Vozac | TipNaloga.Dispecer)) {
                Authorize.RemoveAllAccess(token);
                return Json("OK");
            } else {
                return Helper.ForbidenAccessJson();
            }
        }
    }
}