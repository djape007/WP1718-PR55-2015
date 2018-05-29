using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class MainStorage
    {
        private static readonly string Lokacija =  "dataStorage/";
        private static MainStorage instanca = null;
        private static object katanac = new object();

        private ListPP<Musterija> musterije;
        private ListPP<Vozac> vozaci;
        private ListPP<Voznja> voznje;
        private ListPP<Dispecer> dispeceri;

        private MainStorage() {
            musterije = new ListPP<Musterija>(Lokacija + "musterije.json");
            vozaci = new ListPP<Vozac>(Lokacija + "vozaci.json");
            voznje = new ListPP<Voznja>(Lokacija + "voznje.json");
            dispeceri = new ListPP<Dispecer>(Lokacija + "dispeceri.json");
        }

        public static MainStorage Instanca {
            get {
                if (instanca == null) {
                    lock(katanac) {
                        if (instanca == null) {
                            instanca = new MainStorage();
                        }
                    }
                }

                return instanca;
            }
        }

        public ListPP<Musterija> Musterije { get => musterije; set => musterije = value; }
        public ListPP<Vozac> Vozaci { get => vozaci; set => vozaci = value; }
        public ListPP<Voznja> Voznje { get => voznje; set => voznje = value; }
        public ListPP<Dispecer> Dispeceri { get => dispeceri; set => dispeceri = value; }
    }
}
