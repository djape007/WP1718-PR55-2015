using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Komentar
    {
        static HashSet<int> zauzetiID = new HashSet<int>();
        static int brojacInstanci = 0;
        int id;

        public int ID {
            get {
                return id;
            }

            set {
                zauzetiID.Add(value);
                id = value;
            }
        }
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public int Autor { get; set; }
        public Korisnik AutorOBJ { get; set; }
        public int Voznja { get; set; }
        public Voznja VoznjaOBJ { get; set; }
        public int OcenaVoznje { get; set; }

        public Komentar(int id = -1, bool postaviDatum = false) {
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
                DatumObjave = DateTime.Now;
            }
        }
    }
}
