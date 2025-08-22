import { environment } from "@/app/environments/environment";
import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { logger } from "../utils/helper";

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const apiUrl = environment.apiUrl + req.url;
  const apiReq = req.clone({ url: `${apiUrl}` })
  console.log(apiUrl)
  return next(apiReq);
}

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  logger.info(req.url);
  logger.info(req);
  return next(req);
}
