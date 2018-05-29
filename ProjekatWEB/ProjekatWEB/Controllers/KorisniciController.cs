using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Data.SqlClient;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Korisnici")]
    public class KorisniciController : Controller {
        MainStorage ms = MainStorage.Instanca;
        // GET: api/Korisnici
        [HttpGet]
        public JsonResult Get() {
            List<Korisnik> v = new List<Korisnik>();
            if (ms.Musterije.Lista.Count > 0) {
                foreach (Korisnik k in ms.Musterije.Lista) {
                    //var jsonObj = JsonConvert.SerializeObject(k, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
                    //System.Diagnostics.Debug.WriteLine(jsonObj);
                    v.Add(k);
                }
            } else {
            }

            return Json(v);
        }

        // GET: api/Korisnici/5
        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {

            if (id >= 0) {
                //s = JsonConvert.SerializeObject(ms.Musterije.Lista[id], Newtonsoft.Json.Formatting.None, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore});
                return Json(ms.Musterije.Lista[id]);
            }

            return Json(null);
        }
        
        // POST: api/Korisnici
        [HttpPost]
        public void Post(string username, string password, string ime, string prezime)
        {
            if (username.Trim() != "" && password.Trim() != "" && ime.Trim() != "" && prezime.Trim() != "") {
                Musterija m = new Musterija() { Ime = ime, Username = username, Password = password, Prezime = prezime };
                ms.Musterije.AddAndSave(m);
            }
        }
        
        // PUT: api/Korisnici/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
