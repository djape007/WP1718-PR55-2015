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
        public Vozac VozacOBJ { get; set; }
        public int GodisteAutomobila { get; set; }
        public string BrojVozila {
            get {
                return brojVozila;
            }

            set {
                if (brojVozila != null && postojeciBrojVozila.Contains(brojVozila.ToLower())) {
                    postojeciBrojVozila.Remove(brojVozila.ToLower());
                }

                postojeciBrojVozila.Add(value.ToLower());
                brojVozila = value.ToLower();
            }
        }
        public TipAutomobila TipAutomobila { get; set; }

        public static bool ZauzetBrojVozila(string brVozila) {
            if (postojeciBrojVozila.Contains(brVozila.ToLower())) {
                return true;
            }
            return false;
        }
    }
}
