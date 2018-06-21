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
        }

        public void Add(T t) {
            l.Add(t);
            SacuvajNaHDD();
        }

        public void RemoveAt(int indeks) {
            l.RemoveAt(indeks);
            SacuvajNaHDD();
        }

        public void Remove(T t) {
            l.Remove(t);
            SacuvajNaHDD();
        }

        public void Replace(T old, T _new) {
            l.Remove(old);
            l.Add(_new);
            SacuvajNaHDD();
        }

        public void RemoveAll(Predicate<T> predicate) {
            l.RemoveAll(predicate);
            SacuvajNaHDD();
        }

        public void Clear() {
            l.Clear();
            SacuvajNaHDD();
        }

        public int Count {
            get { return l.Count; }
        }

        public T Find(Predicate<T> predicate) {
            return l.Find(predicate);
        }

        public void ForEach(Action<T> action) {
            l.ForEach(action);
            SacuvajNaHDD();
        }

        public T FirstOrDefault(Func<T, bool> predicate) {
            return l.FirstOrDefault(predicate);
        }
        
        public IEnumerable<T> Where(Func<T, bool> func) {
            return l.Where(func);
        }

        public List<T> FindAll(Predicate<T> predicate) {
            return l.FindAll(predicate);
        }

        public void SacuvajNaHDD() {
            using (StreamWriter sw = new StreamWriter(putanja, false, System.Text.Encoding.UTF8)) {
                var zaUpis = JsonConvert.SerializeObject(l, Formatting.Indented);
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
