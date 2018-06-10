using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Login")]
    public class LoginController : Controller
    {
        [HttpPost]
        public JsonResult Login(string username, string password) {
            Tuple<bool, Korisnik> tmpTuple = Authenticate.IsLoginValid(username, password);
            if (tmpTuple.Item1) {
                return Json(new Dictionary<string, string>() {
                    {"result", "OK"},
                    {"accID", tmpTuple.Item2.ID.ToString() },
                    {"accType", tmpTuple.Item2.TipNaloga.ToString() }
                });
            } else {
                return Json(new Dictionary<string, string>() {
                    {"result", "ERROR"},
                    {"message", "Username or password is not correct"}
                });
            }

        }
    }
}