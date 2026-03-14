import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { TontineStore } from '../../store/tontine/tontine.store';
import { UserRole } from '../../core/enums';

@Directive({ selector: '[appRole]', standalone: true })
export class RoleDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly tontineStore = inject(TontineStore);

  readonly appRole = input.required<UserRole | UserRole[]>();

  constructor() {
    effect(() => {
      const roles = Array.isArray(this.appRole()) ? this.appRole() as UserRole[] : [this.appRole() as UserRole];
      const currentRole = this.tontineStore.currentMemberRole();

      this.viewContainer.clear();
      if (currentRole && roles.includes(currentRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
