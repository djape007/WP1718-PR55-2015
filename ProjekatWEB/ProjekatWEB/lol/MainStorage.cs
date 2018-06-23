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
        private ListPP<Komentar> komentari;
        private ListPP<Automobil> automobili;

        private MainStorage() {
            musterije = new ListPP<Musterija>(Lokacija + "musterije.json");
            vozaci = new ListPP<Vozac>(Lokacija + "vozaci.json");
            voznje = new ListPP<Voznja>(Lokacija + "voznje.json");
            dispeceri = new ListPP<Dispecer>(Lokacija + "dispeceri.json");
            komentari = new ListPP<Komentar>(Lokacija + "komentari.json");
            automobili = new ListPP<Automobil>(Lokacija + "automobili.json");
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
        public ListPP<Komentar> Komentari { get => komentari; set => komentari = value; }
        public ListPP<Automobil> Automobili { get => automobili; set => automobili = value; }

        public Korisnik NadjiKorisnikaPoId(int id) {
            Korisnik k = null;
            
            k = musterije.FirstOrDefault(x => x.ID == id);

            if (k == null) {
                k = vozaci.FirstOrDefault(x => x.ID == id);
            }

            if (k == null) {
                k = dispeceri.FirstOrDefault(x => x.ID == id);
            }

            return k;
        }

        public void UpdateKorisnika(Korisnik k) {
            switch (k.TipNaloga) {
                case TipNaloga.Dispecer:
                    var d = dispeceri.FirstOrDefault(x => x.ID == k.ID);
                    if (d != null) {
                        dispeceri.Remove(d);
                    }
                    dispeceri.Add((Dispecer)k);
                    break;
                case TipNaloga.Musterija:
                    var m = musterije.FirstOrDefault(x => x.ID == k.ID);
                    if (m != null) {
                        musterije.Remove(m);
                    }
                    musterije.Add((Musterija)k);
                    break;
                case TipNaloga.Vozac:
                    var v = vozaci.FirstOrDefault(x => x.ID == k.ID);
                    if (v != null) {
                        vozaci.Remove(v);
                    }
                    vozaci.Add((Vozac)k);
                    break;
            }
        }

        public void UpdateVoznju(Voznja v) {
            var vOld = Voznje.FirstOrDefault(x => x.ID == v.ID);
            if (vOld != null) {
                Voznje.Replace(vOld, v);
            }
        }

        public void UpdateAutomobil(Automobil a) {
            var vOld = Automobili.FirstOrDefault(x => x.BrojVozila == a.BrojVozila);
            if (vOld != null) {
                Automobili.Replace(vOld, a);
            }
        }

        public void UpdateKomentar(Komentar k) {
            var oldKom = Komentari.FirstOrDefault(x => x.ID == k.ID);
            if (oldKom != null) {
                Komentari.Replace(oldKom, k);
            }
        }

        public Korisnik NadjiKorisnikaPoUsernameu(string username) {
            Korisnik k = null;
            
            k = musterije.FirstOrDefault(x => x.Username.ToLower() == username.ToLower());

            if (k == null) {
                k = vozaci.FirstOrDefault(x => x.Username.ToLower() == username.ToLower());
            }

            if (k == null) {
                k = dispeceri.FirstOrDefault(x => x.Username.ToLower() == username.ToLower());
            }

            return k;
        }

        public List<Komentar> GetKomentareSaIdem(List<int> ideviKomentara) {
            return Instanca.Komentari.FindAll(x => (ideviKomentara.Contains(x.ID)));
        }
    }
}
