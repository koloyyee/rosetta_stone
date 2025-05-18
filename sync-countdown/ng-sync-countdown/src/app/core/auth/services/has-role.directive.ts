import { DestroyRef, Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit{
  private requiredRole: string | null = null;

  private destroyRef = inject(DestroyRef);
  private templateRef =  inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private authService = inject(AuthService);

  @Input({ required : true}) hasRole!: "ROLE_ADMIN";

  constructor(
  ) { }

  ngOnInit(): void {

    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe( user => {
      console.log(user)
      if (user?.authorities.some( a => a.authority === this.hasRole)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }


}

