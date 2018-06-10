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
            if (potvrdjeni.ContainsKey(accId) && potvrdjeni[accId].Equals(tipNaloga) && potvrdjeni[accId].Equals(potrebanTip)) {
                return true;
            }
            return false;
        }

        public static Dictionary<int, TipNaloga> PotvrdjeniNalozi {
            get { return potvrdjeni; }
            set { potvrdjeni = value; }
        }
    }
}
