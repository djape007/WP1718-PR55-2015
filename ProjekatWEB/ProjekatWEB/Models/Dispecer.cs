using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Dispecer : Korisnik
    {
        public Dispecer() {
            base.TipNaloga = TipNaloga.Dispecer;
        }
    }
}
