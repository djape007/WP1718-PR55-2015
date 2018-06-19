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

        public Korisnik NadjiKorisnikaPoId(int id) {
            Korisnik k = null;

            foreach(Musterija m in musterije.Lista) {
                if (m.ID == id) {
                    k = m;
                    break;
                }
            }

            if (k == null) {
                foreach (Vozac v in vozaci.Lista) {
                    if (v.ID == id) {
                        k = v;
                        break;
                    }
                }
            }

            if (k == null) {
                foreach (Dispecer d in dispeceri.Lista) {
                    if (d.ID == id) {
                        k = d;
                        break;
                    }
                }
            }

            return k;
        }

        public void UpdateKorisnika(Korisnik k) {
            switch (k.TipNaloga) {
                case TipNaloga.Dispecer:
                    var d = dispeceri.Find(x => x.ID == k.ID);
                    if (d != null) {
                        dispeceri.Remove(d);
                    }
                    dispeceri.Add((Dispecer)k);
                    break;
                case TipNaloga.Musterija:
                    var m = musterije.Find(x => x.ID == k.ID);
                    if (m != null) {
                        musterije.Remove(m);
                    }
                    musterije.Add((Musterija)k);
                    break;
                case TipNaloga.Vozac:
                    var v = vozaci.Find(x => x.ID == k.ID);
                    if (v != null) {
                        vozaci.Remove(v);
                    }
                    vozaci.Add((Vozac)k);
                    break;
            }
        }

        public Korisnik NadjiKorisnikaPoUsernameu(string username) {
            Korisnik k = null;

            foreach (Musterija m in musterije.Lista) {
                if (m.Username == username) {
                    k = m;
                    break;
                }
            }

            if (k == null) {
                foreach (Vozac v in vozaci.Lista) {
                    if (v.Username == username) {
                        k = v;
                        break;
                    }
                }
            }

            if (k == null) {
                foreach (Dispecer d in dispeceri.Lista) {
                    if (d.Username == username) {
                        k = d;
                        break;
                    }
                }
            }

            return k;
        }
    }
}
