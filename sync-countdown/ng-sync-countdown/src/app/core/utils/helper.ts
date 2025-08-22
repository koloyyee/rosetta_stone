import { environment } from "@/app/environments/environment";

import pino from "pino";

export const envMode = environment.production ? "production" : "development";

export const logger = pino({
  level: environment.production ? "debug" : "info" ,
  transport: environment.production ? undefined : {
    target: "pino-pretty",
    options: { colorize: true}
  },
  browser: {asObjectBindingsOnly: true}
})
