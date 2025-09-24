import { TrackerAPI } from "../preload";
declare global {
  interface Window {
    trackerAPI: TrackerAPI;
  }
}
