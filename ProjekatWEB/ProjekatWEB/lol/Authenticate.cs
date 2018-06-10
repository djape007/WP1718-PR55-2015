using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Authenticate
    {
        public static Tuple<bool, Korisnik> IsLoginValid(string username, string password) {
            MainStorage ms = MainStorage.Instanca;

            Korisnik k = ms.NadjiKorisnikaPoUsernameu(username);

            if (k != null && password == k.Password && k.AktivanNalog) {
                //da moze login sa vise browsera :D
                if (!Authorize.PotvrdjeniNalozi.ContainsKey(k.ID)) {
                    Authorize.PotvrdjeniNalozi.Add(k.ID, k.TipNaloga);
                }
                return new Tuple<bool, Korisnik>(true, k);
            } else {
                return new Tuple<bool, Korisnik>(false, null);
            }
        }
    }
}
