import { environment } from "@/shared/environment";
import { logger } from "@/shared/utils/helper";
import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const apiUrl = environment.apiUrl + req.url;
  const apiReq = req.clone({ url: `${apiUrl}` })
  console.log(apiUrl)
  return next(apiReq);
}

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  logger(req.url);
  logger(req);
  return next(req);
}
