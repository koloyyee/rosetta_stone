import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';


@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective {
  private requiredRole: string | null = null;


  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input()
  set hasRole(role: string) {
    this.requiredRole = role;
    this.authService.currentUser$
      // .pipe(takeUntilDestroyed())
      .subscribe(user => {
        if (user?.authorities.some(a => a.authority === role)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      })

  }
}

