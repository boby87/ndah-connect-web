import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, searchTerm: string): SafeHtml {
    if (!value || !searchTerm) return value || '';
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const highlighted = value.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
