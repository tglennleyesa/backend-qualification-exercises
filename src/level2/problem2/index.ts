export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  /**
   * insert your code here
   */

  // combine logs in a single array
  const allLogs: DowntimeLogs = args.flat();

  if (allLogs.length === 0) return [];

  // sort by start time
  allLogs.sort((a, b) => a[0].getTime() - b[0].getTime());

  const merged: DowntimeLogs = [];
  let [currentStart, currentEnd] = allLogs[0];

  for (let i = 1; i < allLogs.length; i++) {
    const [start, end] = allLogs[i];

    // overlap
    if (start.getTime() <= currentEnd.getTime()) {
      // validate end time
      if (end.getTime() > currentEnd.getTime()) {
        currentEnd = end;
      }
    } else {
      merged.push([currentStart, currentEnd]);

      currentStart = start;
      currentEnd = end;
    }
  }

  // merged last interval
  merged.push([currentStart, currentEnd]);

  return merged;
}