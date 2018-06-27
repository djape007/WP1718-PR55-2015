using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjekatWEB
{
    public class Helper
    {
        public static string Base64Decode(string base64EncodedData) {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static string Base64Encode(string plainText) {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static ContentResult ForbidenAccess() {
            return new ContentResult {
                ContentType = "text/html",
                StatusCode = (int)System.Net.HttpStatusCode.Forbidden,
                Content = ""
            };
        }

        public static JsonResult ForbidenAccessJson() {
            return new JsonResult("") { StatusCode = 403 };
        }

        public static double IzracunajCenuVoznje(Lokacija pocetak, Lokacija kraj) {
            double cenaPoJediniciRazdaljine = 0.0095;
            double razdaljina = Math.Sqrt(Math.Pow(kraj.X - pocetak.X, 2) + Math.Pow(kraj.Y - pocetak.Y,2));

            return razdaljina * cenaPoJediniciRazdaljine;
        }

        public static TipNaloga TipNalogaFromString(string tip) {
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

        public static TipVoznje TipVoznjeFromString(string tip) {
            if (tip == null || tip.Trim() == "") {
                throw new ArgumentException("uneti tip nije ispravan");
            }

            TipVoznje[] sviTipovi = new TipVoznje[] {
                TipVoznje.Zona1,
                TipVoznje.Zona2,
                TipVoznje.Zona3,
                TipVoznje.Zona4
            };

            bool nasaoTip = false;

            TipVoznje vrati = TipVoznje.Zona1;
            foreach(TipVoznje tmpTip in sviTipovi) {
                if (tip.Trim().ToLower() == tmpTip.ToString().ToLower()) {
                    nasaoTip = true;
                    vrati = tmpTip;
                    break;
                }
            }
            if (!nasaoTip) {
                throw new ArgumentException("uneti tip nije ispravan");
            }

            return vrati;
        }

        public static TipAutomobila TipAutomobilaFromString(string tip) {
            if (tip == null || tip.Trim() == "") {
                throw new ArgumentException("uneti tip nije ispravan");
            }

            TipAutomobila[] sviTipovi = new TipAutomobila[] {
                TipAutomobila.Kombi,
                TipAutomobila.PutnickiAuto
            };

            bool nasaoTip = false;

            TipAutomobila vrati = TipAutomobila.Kombi;
            foreach (TipAutomobila tmpTip in sviTipovi) {
                if (tip.Trim().ToLower() == tmpTip.ToString().ToLower()) {
                    nasaoTip = true;
                    vrati = tmpTip;
                    break;
                }
            }

            if (!nasaoTip) {
                throw new ArgumentException("uneti tip nije ispravan");
            }

            return vrati;
        }

        public static StatusVoznje StatusVoznjeFromString(string status) {
            if (status == null || status.Trim() == "") {
                throw new ArgumentException("uneti status nije ispravan");
            }

            StatusVoznje[] sviTipovi = new StatusVoznje[] {
                StatusVoznje.Formirana,
                StatusVoznje.Kreirana,
                StatusVoznje.Neuspesna,
                StatusVoznje.Obradjena,
                StatusVoznje.Otkazana,
                StatusVoznje.Prihvacena,
                StatusVoznje.Uspesna,
                StatusVoznje.UToku
            };

            bool nasaoTip = false;

            StatusVoznje vrati = StatusVoznje.Neuspesna;
            foreach (StatusVoznje tmpTip in sviTipovi) {
                if (status.Trim().ToLower() == tmpTip.ToString().ToLower()) {
                    nasaoTip = true;
                    vrati = tmpTip;
                    break;
                }
            }
            if (!nasaoTip) {
                throw new ArgumentException("uneti status nije ispravan");
            }

            return vrati;
        }

        public static T KlonirajObjekat<T>(T objekat) {
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(objekat));
        }
    }
}
