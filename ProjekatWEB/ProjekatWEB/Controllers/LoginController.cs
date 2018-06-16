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
            //tuple item1 - bool (uspesno logovanje)
            if (tmpTuple.Item1) {
                string korisnickoIme = tmpTuple.Item2.Username;
                string accId = tmpTuple.Item2.ID.ToString();
                string accType = tmpTuple.Item2.TipNaloga.ToString();

                string tokenStr = korisnickoIme + "|" + accId + "|" + accType;

                return Json(new Dictionary<string, string>() {
                    {"result", "OK"},
                    {"accUsername", korisnickoIme },
                    {"accID", accId },
                    {"accType", accType },
                    {"token", Helper.Base64Encode(tokenStr)}
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