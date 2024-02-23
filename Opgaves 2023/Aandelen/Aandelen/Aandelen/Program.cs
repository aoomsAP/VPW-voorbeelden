using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using static System.Net.Mime.MediaTypeNames;

public class Test
{
    public long startCapital { get; set; }
    public List<int> values { get; set; }

    public long Calc()
    {
        long remainingCapital = this.startCapital;

        // if there's no values or only one value, there won't be any buying/selling
        if (this.values.Count == 0 || this.values.Count == 1)
        {
            return this.startCapital;
        }

        // initialize first buy
        long buyPrice = this.values[0];
        long shares = remainingCapital / buyPrice;
        remainingCapital -= buyPrice * shares;

        for (int i = 0; i < this.values.Count; i++)
        {
            // -- buying

            // if current value is lower than buy price,
            // cancel last buy & reset
            if (this.values[i] < buyPrice)
            {
                remainingCapital += buyPrice * shares;
                buyPrice = this.values[i];
                shares = remainingCapital / buyPrice;
                remainingCapital -= buyPrice * shares;
            }

            // -- selling

            if (this.values[i] > buyPrice)
            {

                // only sell if next value isn't higher
                // in that case waiting to sell is more lucrative
                int nextValue = i != values.Count - 1 ? this.values[i + 1] : 0;
                if (!(nextValue > this.values[i]))
                {
                    // add gains to remainingCapital
                    remainingCapital += (shares * this.values[i]);

                    // reset buyPrice & shares
                    buyPrice = 1000;
                    shares = 0;
                }
            }
            else
            {
                // if last value & not sold, then cancel last buy
                if (i == this.values.Count - 1)
                {
                    remainingCapital += buyPrice * shares;
                }
            }
        }

        return remainingCapital;
    }
}

class Program
{
    private static TextReader stdin = System.Console.In;
    private static TextWriter stdout = System.Console.Out;

    private static void Main(string[] args)
    {
        // input
        int numberOfTests = Convert.ToInt16(stdin.ReadLine());
        int numberOfValues = -1;
        int startCapital = -1;
        var tests = new List<Test>();

        while (numberOfTests != 0)
        {
            string line = stdin.ReadLine();

            if (startCapital == -1)
            {
                startCapital = int.Parse(line);
            }
            else if (numberOfValues == -1)
            {
                numberOfValues = int.Parse(line);
            }
            else
            {
                List<int> values = new List<int>();
                if (line != "")
                {
                    foreach (var item in line.Split(" "))
                    {
                        values.Add(int.Parse(item));
                    }
                }

                Test test = new Test { startCapital = startCapital, values = values };
                tests.Add(test);

                startCapital = -1;
                numberOfValues = -1;
                numberOfTests--;
            }
        }

        // output
        for (int i = 0; i < tests.Count(); i++)
        {
            stdout.WriteLine($"{i + 1} {tests[i].Calc()}");
        }

    }
}