using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Musterija : Korisnik
    {

        public Musterija() {
            base.TipNaloga = TipNaloga.Musterija;
        }
    }
}
