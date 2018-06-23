using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Korisnik
    {
        static HashSet<string> postojeciUsernameovi = new HashSet<string>();
        static HashSet<int> zauzetiID = new HashSet<int>();

        static int brojacInstanci = 0;

        int id;
        string username;

        public int ID { 
            get {
                return id;
            }
            set {
                id = value;
                zauzetiID.Add(id);
            }
        }
        public string Username { 
            get {
                return username;
            }
            set {
                if (postojeciUsernameovi.Contains(value.ToLower())) {
                    throw new Exception(value + " je zauzeto");
                } else {
                    username = value.ToLower();
                    postojeciUsernameovi.Add(value.ToLower());
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
                while (zauzetiID.Contains(brojacInstanci)) {
                    brojacInstanci++;
                }
                ID = brojacInstanci;
            } else {
                ID = id;
            }
        }

        public static int GetIDFromToken(string b64token) {
            var podaci = GetTokenData(b64token);
            return int.Parse(podaci[1]);
        }

        public static string GetUsernameFromToken(string b64token) {
            var podaci = GetTokenData(b64token);
            return podaci[0];
        }

        public static TipNaloga GetTypeFromToken(string b64token) {
            var podaci = GetTokenData(b64token);
            return Helper.TipNalogaFromString(podaci[2]);
        }

        public static string[] GetTokenData(string b64token) {
            string tokenNormal = "";
            try {
                tokenNormal = Helper.Base64Decode(b64token);
            } catch {
                return new string[0];
            }

            string[] podaci = tokenNormal.Split('|');

            if (podaci.Length != 3) {
                return new string[0];
            }

            return podaci;
        }

        public static String GenerateToken(Korisnik k) {
            return k.Username + "|" + k.ID.ToString() + "|" + k.TipNaloga.ToString();
        }

        public static bool UsernameIsFree(string username) {
            if (postojeciUsernameovi.Contains(username.ToLower())) {
                return false;
            }
            return true;
        }

        public static void RemoveUsernameInUse(string username) {
            if (postojeciUsernameovi.Contains(username.ToLower())) {
                postojeciUsernameovi.Remove(username.ToLower());
            }
        }
    }
}
