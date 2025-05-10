export interface Room {
  id?: string;
  name: string;
  startTime?: string;
  endTime?: string;
  isTimerRunning: boolean;
  state: "RUNNING" | "PAUSED" | "STOPPED" | "FINISHED";
}
