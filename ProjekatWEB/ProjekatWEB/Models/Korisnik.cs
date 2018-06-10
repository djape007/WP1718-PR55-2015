using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Korisnik
    {
        static HashSet<string> postojeciUsernameovi = new HashSet<string>();

        static int brojacInstanci = 0;

        string username;

        public int ID { get; set; }
        public string Username { 
            get {
                return username;
            }
            set {
                if (postojeciUsernameovi.Contains(value)) {
                    throw new Exception(value + " je zauzeto");
                } else {
                    username = value;
                    postojeciUsernameovi.Add(value);
                }
            }
        }
        public string Password { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public PolOsobe Pol { get; set; }
        public string JMBG { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public TipVoznje TipVoznje { get; set; }
        public TipNaloga TipNaloga { get; set; }
        public bool AktivanNalog { get; set; }

        public Korisnik(int id = -1) {
            AktivanNalog = true;
            if (id == -1) {
                brojacInstanci++;
                ID = brojacInstanci;
            }
        }
    }
}
