using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Voznje")]
    public class VoznjeController : Controller {
        
        [HttpGet("{token}")]
        public ContentResult Get(string token) {
            if (token != null && Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac)) {
                return new ContentResult {
                    ContentType = "text/html",
                    StatusCode = (int)System.Net.HttpStatusCode.Forbidden,
                    Content = "<html>JEJ</html>"
                };
            } else {
                return Helper.ForbidenAccess();
            }
        }

        [HttpGet("{id}/{token}")]
        public ContentResult Get(int id, string token) {
            if (token != null && Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac)) {
                return new ContentResult {
                    ContentType = "text/html",
                    StatusCode = (int)System.Net.HttpStatusCode.Forbidden,
                    Content = "<html>JEJ " + id.ToString() + "</html>"
                };
            } else {
                return Helper.ForbidenAccess();
            }
        }

        [HttpPost("{token}")]
        public ContentResult Post(int id, string token, string destinacija) {
            if (token != null && Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer | TipNaloga.Vozac)) {
                return new ContentResult {
                    ContentType = "text/html",
                    StatusCode = (int)System.Net.HttpStatusCode.Forbidden,
                    Content = "<html>POST USPESAN " + id.ToString() + destinacija  +"</html>"
                };
            } else {
                return Helper.ForbidenAccess();
            }
        }
    }
}