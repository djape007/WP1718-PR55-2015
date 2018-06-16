using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Validator
    {
        public static bool StringValidator(string zaProveru, string[] moraDaSadrzi, string[] banovano, bool moraBitiBroj, int minDuzina = -1, int maxDuzina = -1) {
            if (zaProveru == null || zaProveru.Trim() == "") {
                return false;
            }

            if (minDuzina > 0 && zaProveru.Length < minDuzina) {
                return false;
            }

            if (maxDuzina > 0 && zaProveru.Length > maxDuzina) {
                return false;
            }

            if (moraDaSadrzi != null) {
                foreach (String s in moraDaSadrzi) {
                    if (!zaProveru.Contains(s)) {
                        return false;
                    }
                }
            }

            if (banovano != null) {
                foreach (string s in banovano) {
                    if (zaProveru.Contains(s)) {
                        return false;
                    }
                }
            }

            if (moraBitiBroj) {
                try {
                    long tmp = Int64.Parse(zaProveru);
                } catch {
                    return false;
                }
            }

            return true;
        }
    }
}
