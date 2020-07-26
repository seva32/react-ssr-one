/* eslint-disable max-len */
// logic for an angular base interceptor
// intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//  const accessToken = this.localStorageService.getItem('token'); return next.handle(this.addAuthorizationHeader(req, accessToken)).pipe(
//   catchError(err => {
//    // in case of 401 http error
//    if (err instanceof HttpErrorResponse && err.status === 401) {
//     // get refresh tokens
//     const refreshToken = this.localStorageService.getItem('refreshToken');    // if there are tokens then send refresh token request
//     if (refreshToken && accessToken) {
//      return this.refreshToken(req, next);
//     }    // otherwise logout and redirect to login page
//     return this.logoutAndRedirect(err);
//    }   // in case of 403 http error (refresh token failed)
//    if (err instanceof HttpErrorResponse && err.status === 403) {
//     // logout and redirect to login page
//     return this.logoutAndRedirect(err);
//    }
//    // if error has status neither 401 nor 403 then just return this error
//    return throwError(err);
//   })
//  );
// }private logoutAndRedirect(err): Observable<HttpEvent<any>> {
//  this.authService.logout();
//  this.router.navigateByUrl('/login'); return throwError(err);
// }private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//  if (!this.refreshingInProgress) {
//   this.refreshingInProgress = true;
//   this.accessTokenSubject.next(null);  return this.authService.refreshToken().pipe(
//    switchMap((res) => {
//     this.refreshingInProgress = false;
//     this.accessTokenSubject.next(res.accessToken);
//     // repeat failed request with new token
//     return next.handle(this.addAuthorizationHeader(request, res.accessToken));
//    })
//   );
//  } else {
//   // wait while getting new token
//   return this.accessTokenSubject.pipe(
//    filter(token => token !== null),
//    take(1),
//    switchMap(token => {
//     // repeat failed request with new token
//     return next.handle(this.addAuthorizationHeader(request, token));
//    }));
//  }
// }
