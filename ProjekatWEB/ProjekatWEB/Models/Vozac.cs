using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Vozac : Korisnik
    {
        public Lokacija TrenutnaLokacija { get; set; }
        public string Automobil { get; set; }

        public Vozac() {
            base.TipNaloga = TipNaloga.Vozac;
        }
    }
}
