// pipes/translate.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';

import { I18nService } from '@/app/shared/services/I18nService.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Para que reaccione a cambios de idioma
})
export class TranslatePipe implements PipeTransform {
  private i18nService = inject(I18nService);

  transform(key: string, fallback?: string): string {
    return this.i18nService.translate(key, fallback);
  }
}
