using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Collections.Generic;

public class Test
{
    public long numberOfVisitors { get; set; }
    public List<int> visitors { get; set; }
}

class Program
{
    private static TextReader stdin = System.Console.In;
    private static TextWriter stdout = System.Console.Out;

    // greatest commmon divisor function
    private static long GCD(long a, long b)
    {
        while (a != 0 && b != 0)
        {
            if (a > b)
                a %= b;
            else
                b %= a;
        }

        return a | b;
    }

    public static string formatDecimalAsSmallestFraction(decimal finalDiscount)
    {
        // turn discount decimal into an integer by multiplying by 10
        long denominator = (long)Math.Pow(10, finalDiscount.ToString().Length - 2);
        // get numerator by multiplying decimal with denominator
        long numerator = (long)(finalDiscount * denominator);
        // calculate greatest common divisor
        long divisor = GCD(numerator, denominator);
        // divide numerator and denominator by greatest common divisor
        return $"{(numerator / divisor):F0}/{denominator / divisor}";
    }

    private static void Main(string[] args)
    {
        // input
        int numberOfTests = Convert.ToInt16(stdin.ReadLine());
        int numberOfVisitors = -1;
        var tests = new List<Test>();

        while (numberOfTests != 0)
        {
            string line = stdin.ReadLine();

            if (numberOfVisitors == -1)
            {
                numberOfVisitors = int.Parse(line);
            }
            else
            {
                List<int> visitors = new List<int>();
                if (line != "")
                {
                    foreach (var item in line.Split(" "))
                    {
                        visitors.Add(int.Parse(item));
                    }
                }

                Test test = new Test { numberOfVisitors = numberOfVisitors, visitors = visitors };
                tests.Add(test);

                numberOfVisitors = -1;
                numberOfTests--;
            }
        }

        // output
        for (int i = 0; i < tests.Count(); i++)
        {
            // for each unique visitor
            for (int v = 1; v <= tests[i].numberOfVisitors; v++)
            {
                int visitor = v;

                // get index of arrival and index of leaving
                int arrival = tests[i].visitors.IndexOf(visitor);
                int leaving = tests[i].visitors.IndexOf(visitor, arrival + 1);

                // how many visitors are at restaurant at time of arrival
                List<int> trafficAtArrival = tests[i].visitors.GetRange(0,arrival);
                var uniqueVisitorsAtArrival = trafficAtArrival.Distinct().ToList();
                var visitorsAtArrival = new List<int>();

                // for each unique visitor at the time of arrival,
                // check whether they appear only once or twice in the traffic
                // if they appear twice, it means they already left
                // and are not part of the current visitors at time of arrival

                foreach (var previousVisitor in uniqueVisitorsAtArrival)
                {
                    var trafficSinceFirstAppearance = trafficAtArrival.Skip(trafficAtArrival.IndexOf(previousVisitor)+1).ToList();
                    if (!trafficSinceFirstAppearance.Contains(previousVisitor))
                    {
                        visitorsAtArrival.Add(previousVisitor);
                    }
                }
                int currentVisitors = visitorsAtArrival.Count;

                // discount logic = 1/(Math.pow(2,currentVisitors)
                decimal discount = 0;

                List<int> visitorsAfterArrival = new List<int>();
                // add new discount for each new visitor, until current visitor leaves
                for (int j = arrival + 1; j < leaving; j++)
                {

                    // if next visitor is current visitor, it means current visitor is leaving
                    if (tests[i].visitors[j] == visitor)
                    {
                        break;
                    }

                    // if next visitor is included in the visitors at arrival,
                    // or next visitor is included in the visitors after arrival,
                    // it means this visitor is not newly arriving,
                    // but that this visitor is leaving (and should be excluded from count)
                    bool newVisitor = !visitorsAtArrival.Contains(tests[i].visitors[j])
                        && !visitorsAfterArrival.Contains(tests[i].visitors[j]);

                    if (newVisitor)
                    {
                        // add new visitor to current visitors
                        currentVisitors++;
                        visitorsAfterArrival.Add(tests[i].visitors[j]);

                        // add discount
                        discount += (decimal) (1 / (Math.Pow(2, currentVisitors)));
                    }
                    else
                    {
                        // if it's not a new visitor, it's a visitor that is leaving
                        // so currentVisitors should be reduced
                        currentVisitors--;
                    }
                }

                // discount amount has a cap of 73/100
                decimal finalDiscount = Math.Min((decimal) discount, (decimal) (73.0 / 100.0));

                // format discount in smallest possible fraction
                string fraction = "";
                if (finalDiscount != 0) fraction = formatDecimalAsSmallestFraction(finalDiscount);

                // output discount for each visitor in a test
                if (finalDiscount == 0) stdout.WriteLine($"{i + 1} {visitor} {finalDiscount}");
                else stdout.WriteLine($"{i + 1} {visitor} {fraction}");
            }
        }
    }
}