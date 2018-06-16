using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class TipNalogaConvert
    {
        public static TipNaloga FromString(string tip) {
            TipNaloga ret = TipNaloga.Greska;

            TipNaloga[] sviTipovi = new TipNaloga[] {
                TipNaloga.Greska,
                TipNaloga.Dispecer,
                TipNaloga.Musterija,
                TipNaloga.Vozac
            };

            if (tip == null || tip.Trim() == "") {
                return TipNaloga.Greska;
            }

            foreach (TipNaloga tmpTip in sviTipovi) {
                if (tip.Trim().ToLower() == tmpTip.ToString().ToLower()) {
                    ret = tmpTip;
                    break;
                }
            }

            return ret;
        }
    }
}
