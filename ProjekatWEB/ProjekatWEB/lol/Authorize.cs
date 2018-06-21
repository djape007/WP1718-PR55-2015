using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Authorize
    {
        static Dictionary<int, TipNaloga> potvrdjeni = new Dictionary<int, TipNaloga>();

        public static bool IsAllowedToAccess(int accId, TipNaloga tipNaloga, TipNaloga potrebanTip) {
            if (potvrdjeni.ContainsKey(accId) && potvrdjeni[accId].Equals(tipNaloga) && ((potvrdjeni[accId] & potrebanTip) != 0)) {
                return true;
            }
            return false;
        }

        public static bool IsAllowedToAccess(string b64token, TipNaloga potrebanTip) {
            if (b64token == null) {
                return false;
            }

            string[] podaci = Korisnik.GetTokenData(b64token);

            if (podaci.Length == 0) {
                return false;
            }

            try {
                int accId = int.Parse(podaci[1]);
                TipNaloga tp = Helper.TipNalogaFromString(podaci[2]);
                return IsAllowedToAccess(accId, tp, potrebanTip);
            } catch {
                return false;
            } 
        }

        public static Dictionary<int, TipNaloga> PotvrdjeniNalozi {
            get { return potvrdjeni; }
            set { potvrdjeni = value; }
        }

        public static void RemoveAllAccess(int accId) {
            if (PotvrdjeniNalozi.ContainsKey(accId)) {
                PotvrdjeniNalozi.Remove(accId);
            }
        }

        public static void RemoveAllAccess(string b64token) {
            string tokenNormal = "";
            try {
                tokenNormal = Helper.Base64Decode(b64token);
            } catch {
                return;
            }

            string[] podaci = tokenNormal.Split('|');

            if (podaci.Length != 3) {
                return;
            }

            try {
                int accId = int.Parse(podaci[1]);
                RemoveAllAccess(accId);
                return;
            } catch {
                return;
            }
        }
    }
}
