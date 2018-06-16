using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public enum PolOsobe {
        Musko,
        Zensko
    }

    public enum TipVoznje {
        Zona1,
        Zona2,
        Zona3,
        Zona4
    }

    [Flags]
    public enum TipNaloga {
        Greska = 0,
        Musterija = 1,
        Vozac = 2,
        Dispecer = 4
    }

    public enum StatusVoznje {
        Kreirana,
        Otkazana,
        Formirana,
        Obradjena,
        Prihvacena,
        Neuspesna,
        Uspesna,
        UToku
    }

    public enum TipAutomobila {
        PutnickiAuto,
        Kombi
    }
}
