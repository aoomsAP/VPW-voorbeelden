using System.IO;

class Program
{
    private static TextReader stdin = System.Console.In;
    private static TextWriter stdout = System.Console.Out;

    private static void Main(string[] args)
    {
        // input
        int numLists = Convert.ToInt16(stdin.ReadLine());
        int listLength = 0;
        int listIndex = -1;
        List<int>[] lists = new List<int>[numLists];

        string input;
        while ((input = stdin.ReadLine()) != "")
        {
            int n = Convert.ToInt16(input);

            if (listLength == 0)
            {
                listIndex++;
                listLength = n;
            }
            else
            {
                if (lists[listIndex] == null) lists[listIndex] = new List<int>();
                lists[listIndex].Add(n);
                listLength--;
            }
        }

        // output
        for (int i = 0; i < lists.Count(); i++)
        {
            stdout.WriteLine($"{i + 1} {lists[i].Min()} {lists[i].Max()}");
        }
    }
}