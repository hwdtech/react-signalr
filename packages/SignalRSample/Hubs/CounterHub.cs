using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace SignalRSample.Hubs
{
  public class CounterHub : Hub
  {
    public async IAsyncEnumerable<int> Count([EnumeratorCancellation] CancellationToken cancellationToken)
    {
      for (var i = 0; i < 5; i++)
      {
        // Check the cancellation token regularly so that the server will stop
        // producing items if the client disconnects.
        cancellationToken.ThrowIfCancellationRequested();

        yield return i;

        // Use the cancellationToken in other APIs that accept cancellation
        // tokens so the cancellation can flow down to them.
        await Task.Delay(5000, cancellationToken);
      }
    }
  }
}
