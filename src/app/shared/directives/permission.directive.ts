import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { TontineStore } from '../../store/tontine/tontine.store';
import { UserRole } from '../../core/enums';

@Directive({ selector: '[appPermission]', standalone: true })
export class PermissionDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly tontineStore = inject(TontineStore);

  readonly appPermission = input.required<UserRole[]>();

  constructor() {
    effect(() => {
      const roles = this.appPermission();
      const currentRole = this.tontineStore.currentMemberRole();

      this.viewContainer.clear();
      if (currentRole && roles.includes(currentRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
