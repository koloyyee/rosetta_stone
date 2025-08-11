import { environment } from "../environment";

export const envMode = environment.production ? "production" : "development";

export function logger(message: unknown, options: { level: "debug" | "warn" | "error" | "info" } = { level: "info" }) {
  if (envMode === "development") {

    const styles = {
      info: "color: blue; font-weight: bold;",
      debug: "color: green; font-weight: bold;",
      warn: "color: orange; font-weight: bold;",
      error: "color: red; font-weight: bold;",
    };
    const body = JSON.stringify(message, null, 2);

    switch (options.level) {
      case "info":
        console.log(`%c[INFO] ${body}`, styles.info);
        break;
      case "debug":
        console.debug(`%c[DEBUG] ${body}`, styles.debug);
        break;
      case "warn":
        console.warn(`%c[WARNING] ${body}`, styles.warn);
        break;
      case "error":
        console.error(`%c[ERROR] ${body}`, styles.error);
        break;
      default:
        break;
    }
  }
}
