import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { JwtService } from "../auth/services/jwt.service";

/**
 * Interceptors are middleware, every HttpClient function call e.g. http.get(), http.post(),
 * it will intercept the HttpRequest,
 * the next() is to pass the request to the next chain.
 *
 * This is a similar model of the Servlet doFilter,
 * in modern days we can see it used in the Spring Security Filter Chain.
 *
 * @param req
 * @param next
 * @returns
 */
export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // For login() not access the current jwt token.
  if (req.headers.has('Skip')) {
    const skippedReq = req.clone({
      headers: req.headers.delete('Skip')
    });
    return next(skippedReq);
  }

  const token = inject(JwtService).get();

  if(token) {
    const clone = req.clone({
      setHeaders : {
        Authorization : `Bearer ${token}`
      }
    });
    return next(clone);
  }
  return next(req);
}
