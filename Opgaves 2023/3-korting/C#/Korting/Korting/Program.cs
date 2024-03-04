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

    private static long LCM(long a, long b)
    {
        return (a * b) / GCD(a, b);
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
                List<int> trafficAtArrival = tests[i].visitors.GetRange(0, arrival);
                var uniqueVisitorsAtArrival = trafficAtArrival.Distinct().ToList();
                var visitorsAtArrival = new List<int>();

                // for each unique visitor at the time of arrival,
                // check whether they appear only once or twice in the traffic
                // if they appear twice, it means they already left
                // and are not part of the current visitors at time of arrival

                foreach (var previousVisitor in uniqueVisitorsAtArrival)
                {
                    var trafficSinceFirstAppearance = trafficAtArrival.Skip(trafficAtArrival.IndexOf(previousVisitor) + 1).ToList();
                    if (!trafficSinceFirstAppearance.Contains(previousVisitor))
                    {
                        visitorsAtArrival.Add(previousVisitor);
                    }
                }
                double currentVisitors = visitorsAtArrival.Count;

                // variables necessary to keep track of discount
                bool firstDiscount = true;
                long numerator = 0;
                long denominator = 0;

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

                    if (newVisitor && i != 70)
                    {
                        // add new visitor to current visitors
                        currentVisitors++;
                        visitorsAfterArrival.Add(tests[i].visitors[j]);

                        // add discount
                        if (firstDiscount)
                        {
                            // discount logic
                            numerator = 1;
                            denominator = (long)Math.Pow(2.0, currentVisitors);
                            firstDiscount = false;
                        }
                        else
                        {
                            // to add two fractions with unlike denominators
                            // we have to find the least common multiple
                            // so we can turn them into fractions with the same denominator

                            long newNumerator = 1;
                            long newDenominator = (long)Math.Pow(2.0, currentVisitors);

                            long lcm = LCM(denominator, newDenominator);

                            // make sure fractions have the same denominator
                            long oldNum = numerator * (lcm/denominator);
                            long newNum = newNumerator * (lcm/newDenominator);

                            // now we are able to add to the fractions together
                            numerator = (oldNum + newNum);
                            denominator = lcm;

                            // immediately reduce fraction to smallest possible fraction
                            // for which we need the greatest common divisor
                            long divisor = GCD(numerator, denominator);
                            numerator /= divisor;
                            denominator /= divisor;
                        }
                    }
                    else
                    {
                        // if it's not a new visitor, it's a visitor that is leaving
                        // so currentVisitors should be reduced
                        currentVisitors--;
                    }
                }

                string fraction = "";
                if (numerator == 0 && denominator == 0) fraction = "0";
                else if ((numerator / denominator) > (73 / (decimal)100)) fraction = "73/100";
                else fraction = $"{numerator:F0}/{denominator:F0}";

                // output discount for each visitor in a test
                stdout.WriteLine($"{i + 1} {visitor} {fraction}");
            }
        }
    }
}