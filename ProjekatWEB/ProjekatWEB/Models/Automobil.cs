using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Automobil
    {
        static HashSet<string> postojeciBrojVozila = new HashSet<string>();
        string brojVozila = "";

        public int VozacID { get; set; }
        public int GodisteAutomobila { get; set; }
        public string BrojVozila {
            get {
                return brojVozila;
            }

            set {
                if (postojeciBrojVozila.Contains(value.ToLower())) {
                    throw new Exception("Vec postoji auto sa tim brojem");
                } else {
                    postojeciBrojVozila.Add(value.ToLower());
                    brojVozila = value.ToLower();
                }
            }
        }
        public TipAutomobila TipAutomobila { get; set; }
    }
}
