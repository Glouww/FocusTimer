/*
*
*   Simple helper function to convert the time in ms
*   and convert it into a human-readable format for 
*   debugging and frontend purposes.
*
*/

export function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;

  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}
