using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Korisnik
    {
        static int brojacInstanci = 0;

        public int ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public PolOsobe Pol { get; set; }
        public string JMBG { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public TipVoznje TipVoznje { get; set; }

        public Korisnik(int id = -1) {
            if (id == -1) {
                brojacInstanci++;
                ID = brojacInstanci;
            }
        }
    }
}
