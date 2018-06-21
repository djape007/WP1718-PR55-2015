using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Voznja
    {
        static int brojacInstanci = 0;

        public int ID { get; set; }
        public DateTime DatumNarucivanja { get; set; }
        public Lokacija PocetnaLokacija { get; set; }
        public int MusterijaID { get; set; }
        public Lokacija Odrediste { get; set; }
        public int DispecerID { get; set; }
        public int VozacID { get; set; }
        public double Iznos { get; set; }
        public List<int> KomentarID { get; set; }
        public StatusVoznje Status { get; set; }
        public TipVoznje TipVoznje { get; set; }

        public Voznja(int id = -1, bool postaviDatum = false) {
            if (id == -1) {
                brojacInstanci++;
                ID = brojacInstanci;
            }

            if (postaviDatum) {
                DatumNarucivanja = DateTime.Now;
            }
        }
    }
}
