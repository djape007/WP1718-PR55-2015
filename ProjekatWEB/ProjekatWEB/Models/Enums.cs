using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB.Models
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

    public enum TipNaloga {
        Musterija,
        Vozac,
        Dispecer
    }

    public enum StatusVoznje {
        Kreirana,
        Otkazana,
        Formirana,
        Obradjena,
        Prihvacena,
        Neuspesna,
        Uspesna
    }

    public enum TipAutomobila {
        PutnickiAuto,
        Kombi
    }
}
