using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;

internal class Program
{
    class Street
    {
        public static List<Street> AllStreets = new List<Street>();

        public int Start;
        public int End;
        public bool StartDeadends = false;
        public bool EndDeadends = false;
        public bool HasDeadEnd = false;

        public Street(int start, int end)
        {
            this.Start = Math.Min(start, end);
            this.End = Math.Max(end, start);

            AllStreets.Add(this);
        }

        public bool DeadEndsOnOtherSide(int currentSide)
        {
            if (this.Start == currentSide && this.EndDeadends) { return true; }
            else if (this.End == currentSide && this.StartDeadends) { return true; }
            return false;
        }

        public void DeadEnd(int at)
        {
            if (this.Start == at)
            {
                this.StartDeadends = true;

            }
            else
            {

                this.EndDeadends = true;
            }
        }

        public int GetOtherSide(int thisSide)
        {
            if (this.Start == thisSide)
            {
                return this.End;
            }
            else if (this.End == thisSide)
            {
                return this.Start;
            }
            else
            {
                throw new InvalidOperationException();
            }
        }
    }
    class Sign : IComparable
    {
        public int beginCrossing;
        public int endCrossing;

        public Sign(int start, int end)
        {
            this.beginCrossing = start;
            this.endCrossing = end;

        }

        public int CompareTo(object obj)
        {
            if (obj == null) return -1;

            Sign signB = obj as Sign;

            if (signB != null)
            {
                if (this.beginCrossing < signB.beginCrossing)
                {
                    return -1;
                }
                else if (signB.beginCrossing < this.beginCrossing)
                {
                    return 1;
                }
                else
                {
                    if (this.endCrossing < signB.endCrossing)
                    {
                        return -1;
                    }
                    return 1;
                }
            }
            else
            {
                throw new ArgumentException("Object is not a Sign");
            }
        }
    }

    private static TextReader stdin = System.Console.In;
    private static TextWriter stdout = System.Console.Out;
    static void Main(string[] args)
    {
        int nbrOfTests = int.Parse(stdin.ReadLine());
        List<ushort>[] tests = new List<ushort>[nbrOfTests - 1];
        ImmutableList<Sign>[] signsToPlace = new ImmutableList<Sign>[nbrOfTests];


        for (int i = 0; i < nbrOfTests; i++)
        {
            int nbrOfStreets = int.Parse(stdin.ReadLine());

            List<Street> allStreets = Street.AllStreets;
            List<Sign> signsForThisTest = new List<Sign>();

            Dictionary<int, int> crossingsCatalog = new Dictionary<int, int>();

            for (int j = 0; j < nbrOfStreets; j++)
            {
                string[] streetEnds = stdin.ReadLine().Split(" ");
                int cros1 = Convert.ToInt32(streetEnds[0]);
                int cros2 = Convert.ToInt32(streetEnds[1]);

                Street thisStreet = new Street(cros1, cros2);



                if (!crossingsCatalog.ContainsKey(cros1))
                {
                    crossingsCatalog.Add(cros1, 0);
                }
                if (!crossingsCatalog.ContainsKey(cros2))
                {
                    crossingsCatalog.Add(cros2, 0);
                }

                crossingsCatalog[cros1]++;
                crossingsCatalog[cros2]++;
            }

            // Mark deadEnds

            var standardDeadends = crossingsCatalog.Where(c => c.Value == 1).Select(c => c.Key).ToArray();

            var deadEnds = crossingsCatalog.Where(c => c.Value == 1);

            while (deadEnds.Any())
            {

                foreach (var deadEnd in deadEnds)
                {
                    // FindPath
                    int currentPossition = deadEnd.Key;


                    var relatedStreets = allStreets.Where(s => s.End == currentPossition || s.Start == currentPossition);
                    foreach (var street in relatedStreets)
                    {
                        Street currentStreet = street;
                        currentStreet.HasDeadEnd = true;
                        currentStreet.DeadEnd(currentPossition);

                        crossingsCatalog[currentStreet.End]--;
                        crossingsCatalog[currentStreet.Start]--;
                    }

                }

                deadEnds = crossingsCatalog.Where(c => c.Value == 1);
            }

            var possibleDeadendStreets = allStreets.Where(s => s.HasDeadEnd);

            foreach (var street in possibleDeadendStreets)
            {
                //assume there needs to be a sign at everyone of these crossings
                signsForThisTest.Add(new Sign(street.Start, street.End));
                signsForThisTest.Add(new Sign(street.End, street.Start));

            }



            bool AllLinksHaveASign(int crossing, int from)
            {
                if (standardDeadends.Contains(crossing)) return true;


                var allLinkedStreets = allStreets.Where(s => s.End == crossing || s.Start == crossing);

                foreach (Street linkedStreet in allLinkedStreets)
                {
                    if (linkedStreet.End == Math.Max(crossing, from) && linkedStreet.Start == Math.Min(crossing, from)) continue;

                    int destination = linkedStreet.End;
                    if (destination == crossing) destination = linkedStreet.Start;

                    if (signsForThisTest.FirstOrDefault(s => s.beginCrossing == crossing && s.endCrossing == destination) is not null)
                    {
                        // there is a sign here
                    }
                    else
                    {
                        return false;
                    }
                }
                return true;
            }


            Sign signToRemove;
            do
            {
                signToRemove = null;

                foreach (var sign in signsForThisTest)
                {
                    Street thisStreet = allStreets.Find(
                        s => s.Start == Math.Min(sign.beginCrossing, sign.endCrossing)
                        && s.End == Math.Max(sign.beginCrossing, sign.endCrossing));




                    if (AllLinksHaveASign(sign.endCrossing, sign.beginCrossing))
                    {
                        // Sign can stay
                    }
                    else
                    {
                        signToRemove = sign;
                        break;
                    }


                }



                signsForThisTest.Remove(signToRemove);



            } while (signToRemove is not null);




            signsToPlace[i] = signsForThisTest.ToImmutableList().Sort();
            Street.AllStreets.Clear();


        }

        int si = 1;
        foreach (var signs in signsToPlace)
        {
            string output = "";
            if (signs.Count == 0) { output += " geen"; }
            else
            {
                foreach (var sign in signs) { output += $" ({sign.beginCrossing},{sign.endCrossing})"; }
            }

            stdout.WriteLine(si++ + output);

        }
    }
}