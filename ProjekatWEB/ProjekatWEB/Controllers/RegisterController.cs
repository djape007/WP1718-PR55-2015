﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProjekatWEB.Controllers
{
    [Produces("application/json")]
    [Route("api/Register/{token?}")]
    public class RegisterController : Controller
    {
        MainStorage ms = MainStorage.Instanca;

        [HttpPost]
        public JsonResult Post(string username, string password, string ime, string prezime, string pol, string email, string telefon, string jmbg, string tipNaloga_str, string token) {
            
            if (!Validator.StringValidator(username, null, null, false, 4, 20)) {
                return Json("ERROR_USERNAME_NOT_CORRECT");
            }

            if (!Validator.StringValidator(password, null, null, false, 4, 35)) {
                return Json("ERROR_PASSWORD_NOT_CORRECT");
            }

            if (!Validator.StringValidator(ime, null, null, false, 2, 25)) {
                return Json("ERROR_IME_NOT_CORRECT");
            }

            if (!Validator.StringValidator(prezime, null, null, false, 2, 25)) {
                return Json("ERROR_PREZIME_NOT_CORRECT");
            }

            if (!Validator.StringValidator(pol, null, null, false, 1, 1)) {
                return Json("ERROR_POL_NOT_CORRECT");
            }

            if (!Validator.StringValidator(email, new string[] { "@", "."}, null, false, 5, 50)) {
                return Json("ERROR_EMAIL_NOT_CORRECT");
            }

            telefon = telefon.Replace("+", "");
            telefon = telefon.Replace("-", "");
            telefon = telefon.Replace("/", "");
            telefon = telefon.Replace("  ", "");
            telefon = telefon.Replace(" ", "");
            if (!Validator.StringValidator(telefon, null, null, true, 5, 13)) {
                return Json("ERROR_PHONE_NOT_CORRECT");
            }

            if (!Validator.StringValidator(jmbg, null, null, true, 13, 13)) {
                return Json("ERROR_JMBG_NOT_CORRECT");
            }

            if (!Korisnik.UsernameIsFree(username)) {
                return Json("ERROR_USERNAME_ALREADY_IN_USE");
            }

            TipNaloga tipNaloga = Helper.TipNalogaFromString(tipNaloga_str);

            switch (tipNaloga) {
                case TipNaloga.Musterija:
                    Musterija m = new Musterija() {
                            Username = username,
                            Password = password,
                            Ime = ime,
                            Prezime = prezime,
                            Email = email,
                            JMBG = jmbg,
                            Telefon = telefon,
                            Pol = (pol == "M") ? PolOsobe.Musko : PolOsobe.Zensko
                        };
                    ms.Musterije.Add(m);

                    return Json("OK");

                case TipNaloga.Dispecer:
                    if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer)) {
                        Dispecer d = new Dispecer() {
                            Username = username,
                            Password = password,
                            Ime = ime,
                            Prezime = prezime,
                            Email = email,
                            JMBG = jmbg,
                            Telefon = telefon,
                            Pol = (pol == "M") ? PolOsobe.Musko : PolOsobe.Zensko
                        };
                        ms.Dispeceri.Add(d);
                        return Json("OK");
                    } else {
                        return Json("ERROR_NOT_ALLOWED");
                    }
                case TipNaloga.Vozac:
                    if (Authorize.IsAllowedToAccess(token, TipNaloga.Dispecer)) {
                        Vozac v = new Vozac() {
                            Username = username,
                            Password = password,
                            Ime = ime,
                            Prezime = prezime,
                            Email = email,
                            JMBG = jmbg,
                            Telefon = telefon,
                            Pol = (pol == "M") ? PolOsobe.Musko : PolOsobe.Zensko
                        };
                        ms.Vozaci.Add(v);
                        return Json("OK");
                    } else {
                        return Json("ERROR_NOT_ALLOWED");
                    }
                case TipNaloga.Greska:
                    return Json("ERROR_ACC_TYPE_NOT_VALID");
                default:
                    return Json("ERROR_ACC_TYPE_NOT_VALID");
            }
            
        }
    }
}