using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Automobil
    {
        public Korisnik Vozac { get; set; }
        public int GodisteAutomobila { get; set; }
        public string BrojVozila { get; set; }
        public TipAutomobila TipAutomobila { get; set; }
    }
}
