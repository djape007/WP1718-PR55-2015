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
                id = value;
                zauzetiID.Add(value);
            }
        }
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
                while (zauzetiID.Contains(brojacInstanci)) {
                    brojacInstanci++;
                }
                ID = brojacInstanci;
            }

            if (postaviDatum) {
                DatumNarucivanja = DateTime.Now;
            }
        }
    }
}
