using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Voznja
    {
        static HashSet<int> zauzetiID = new HashSet<int>();
        static int brojacInstanci = 0;

        int id;

        public int ID {
            get { return id; }
            set {
                zauzetiID.Add(value);
                id = value;
            }
        }

        public DateTime DatumNarucivanja { get; set; }
        public Lokacija PocetnaLokacija { get; set; }
        public int MusterijaID { get; set; }
        public Musterija MusterijaOBJ { get; set; }
        public Lokacija Odrediste { get; set; }
        public int DispecerID { get; set; }
        public Dispecer DispecerOBJ { get; set; }
        public int VozacID { get; set; }
        public Vozac VozacOBJ { get; set; }
        public double Iznos { get; set; }
        public List<int> KomentarID { get; set; }
        public List<Komentar> KomentariOBJ { get; set; }
        public StatusVoznje Status { get; set; }
        public TipVoznje TipVoznje { get; set; }
        public TipAutomobila TipAutomobila { get; set; }

        public Voznja(int id = -1, bool postaviDatum = false) {
            if (id == -1) {
                brojacInstanci++;
                while (zauzetiID.Contains(brojacInstanci)) {
                    brojacInstanci++;
                }
                ID = brojacInstanci;
            } else {
                ID = id;
            }

            if (postaviDatum) {
                DatumNarucivanja = DateTime.Now;
            }
        }
    }
}
