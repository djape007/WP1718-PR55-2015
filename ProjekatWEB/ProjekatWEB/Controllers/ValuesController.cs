using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public JsonResult Get(int id, string tn_str)
        {
            TipNaloga tn = TipNaloga.Musterija;
            
            if (tn_str == null || tn_str == "") {
                return Json("VOJKO V NE MOZE");
            } else if (tn_str == TipNaloga.Dispecer.ToString()) {
                tn = TipNaloga.Dispecer;
            } else if (tn_str == TipNaloga.Musterija.ToString()) {
                tn = TipNaloga.Musterija;
            } else if (tn_str == TipNaloga.Vozac.ToString()) {
                tn = TipNaloga.Vozac;
            }
            
            if (Authorize.IsAllowedToAccess(id, tn, TipNaloga.Musterija)) {
                return Json("uspeo");
            } else {
                return Json("VOJKO V NE MOZE");
            }
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
