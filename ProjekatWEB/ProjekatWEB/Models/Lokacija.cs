using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Lokacija
    {
        public double X { get; set; }
        public double Y { get; set; }
        public Adresa Adresa { get; set; }

        public override string ToString() {
            return "X: " + X.ToString() + " Y: " + Y.ToString() + " ADR:" + Adresa.ToString();  
        }
    }
}
