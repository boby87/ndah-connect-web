import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { Component, signal } from '@angular/core';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg fixed h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-blue-600">
            <span class="text-2xl mr-2">🤝</span>Ndah Connect
          </h1>
          <p class="text-xs text-gray-500 mt-1">Gestion Communautaire</p>
        </div>

        <nav class="mt-6">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              [class.bg-blue-50]="isActive(item.route)"
              [class.border-r-4]="isActive(item.route)"
              [class.border-blue-600]="isActive(item.route)"
              class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition">
              <span class="text-xl">{{ item.icon }}</span>
              <span class="font-medium">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="mt-8 mx-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-xs text-gray-600 font-semibold">BESOIN D'AIDE?</p>
          <p class="text-xs text-gray-500 mt-2">Contactez l'équipe support pour toute question</p>
          <button class="mt-3 w-full bg-blue-600 text-white text-xs py-2 rounded font-medium hover:bg-blue-700 transition">
            Obtenir Aide
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="ml-64 flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div class="flex justify-between items-center px-8 py-4">
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-800">{{ getPageTitle() }}</h2>
            </div>
            <div class="flex items-center gap-4">
              <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-lg">
                🔔
              </button>
              <button class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700">
                👤
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {
  navItems: NavItem[] = [
    { label: 'Tableau de Bord', route: '/dashboard', icon: '📊' },
    { label: 'Membres', route: '/members', icon: '👥' },
    { label: 'Prêts & Épargne', route: '/funds', icon: '💰' },
    { label: 'Solidarité', route: '/events', icon: '🤝' }
  ];

  currentRoute = signal('/');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  getPageTitle(): string {
    const titles: Record<string, string> = {
      '/dashboard': 'Tableau de Bord',
      '/members': 'Gestion des Membres',
      '/funds': 'Gestion des Fonds',
      '/events': 'Solidarité & Entraide'
    };

    for (const [route, title] of Object.entries(titles)) {
      if (this.router.url.startsWith(route)) {
        return title;
      }
    }

    return 'Ndah Connect';
  }
}

