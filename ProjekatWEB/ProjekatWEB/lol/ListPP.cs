using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ProjekatWEB
{
    public class ListPP<T> {

        private List<T> l;
        private string putanja;

        public string Putanja {
            get { return putanja; }
            set { putanja = value; }
        }

        public ListPP(string putanja) {
            Putanja = putanja;
            l = new List<T>();
            UcitajSaHDD();
        }

        public List<T> Lista {
            get { return l; }
            set { l = value; }
        }

        public void AddAndSave(T t) {
            l.Add(t);
            SacuvajNaHDD();
        }

        public void RemoveAtAndSave(int indeks) {
            l.RemoveAt(indeks);
            SacuvajNaHDD();
        }

        public void RemoveAllAndSave(Predicate<T> predicate) {
            l.RemoveAll(predicate);
            SacuvajNaHDD();
        }

        public void ClearAndSave() {
            l.Clear();
            SacuvajNaHDD();
        }

        public void SacuvajNaHDD() {
            using (StreamWriter sw = new StreamWriter(putanja, false, System.Text.Encoding.UTF8)) {
                var zaUpis = JsonConvert.SerializeObject(l);
                sw.Write(zaUpis);
            }
        }

        public void UcitajSaHDD() {
            try {
                using (StreamReader sr = new StreamReader(putanja, System.Text.Encoding.UTF8)) {
                    var s = sr.ReadToEnd();
                    l = JsonConvert.DeserializeObject<List<T>>(s);
                }
            } catch (Exception e){
                System.Diagnostics.Debug.WriteLine("GRESKA JBT:" + e.ToString());
                l = new List<T>();
            }
        }
    }
}
