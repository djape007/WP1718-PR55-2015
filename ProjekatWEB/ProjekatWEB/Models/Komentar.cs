using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Komentar
    {
        static int brojacInstanci = 0;

        public int ID { get; set; }
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public int Autor { get; set; }
        public int Voznja { get; set; }
        public int OcenaVoznje { get; set; }

        public Komentar(int id = -1, bool postaviDatum = false) {
            if (id == -1) {
                brojacInstanci++;
                ID = brojacInstanci;
            }

            if (postaviDatum) {
                DatumObjave = DateTime.Now;
            }
        }
    }
}
