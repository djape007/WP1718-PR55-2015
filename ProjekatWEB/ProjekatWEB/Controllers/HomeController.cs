using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("Home")]
    [Route("home.html")]
    public class HomeController : Controller
    {
        [HttpGet("{token?}")]
        public ContentResult Get(string token) {
            if (Authorize.IsAllowedToAccess(token, TipNaloga.Musterija | TipNaloga.Dispecer | TipNaloga.Vozac)) {
                string sadrzajFajla = "";

                using (System.IO.StreamReader sr = new System.IO.StreamReader("wwwroot/home.html")) {
                    sadrzajFajla = sr.ReadToEnd();
                }

                return new ContentResult {
                    ContentType = "text/html",
                    StatusCode = (int)System.Net.HttpStatusCode.OK,
                    Content = sadrzajFajla
                };
            } else {
                return Helper.ForbidenAccess();
            }
        }
    }
}