import {
  Component,
  inject,
  effect,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ContentfulService } from '@/app/shared/services/contenful.service';
import { PrefixContextService } from '@/app/shared/services/prefix-context.service';
import { ItemFields } from '@/app/shared/interfaces/contentful.interface';
import { I18nService } from '@/app/shared/services/I18nService.service';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import { ChatbotComponent } from '@/app/shared/components/chatbot/chatbot.component';

// Agregar imágenes dinámicamente
const imageKeys = [
  'backgroundImage01',
  'backgroundImage02',
  'backgroundImage03',
  'backgroundImage04',
  'backgroundImage05',
  'backgroundImageGraphicElement01',
  'backgroundImageGraphicElement02',
  'backgroundImageGraphicElement03',
  'backgroundImageGraphicElement04',
  'backgroundImageLogo',
  'backgroundImageQr',
  'backgroundImageLogoGroupDesktop',
  'backgroundImageLogoGroupMobile',
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatbotComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'BDR-Landing';

  private readonly contentfulService = inject(ContentfulService);
  private readonly prefixContext = inject(PrefixContextService);
  private readonly i18nService = inject(I18nService);
  private readonly appSettings = inject(AppSettingsService);

  private readonly validPrefix = computed(() => this.prefixContext.prefix());
  private readonly data = signal<ItemFields | null>(null);

  constructor() {
    // DEMO NOTE: airports/airlines fetched from FlightStats are cached in
    // localStorage by the real app (AirportDataService/AirlinesDataService)
    // to avoid refetching every visit. That cache persists across page
    // reloads and can hold onto a stale (or empty) result from an earlier
    // test of this demo, silently hiding updates to the mocked data. This
    // clears both caches once per app load so the demo's airport/airline
    // selectors always reflect the current mock.
    localStorage.removeItem('airports');
    localStorage.removeItem('airlines');

    effect(() => {
      const prefix = this.validPrefix();
      const isLoaded = this.appSettings.isLoaded();

      if (prefix && isLoaded) {
        this.getDataFromContentful(prefix);
      }
    });

    effect(() => {
      const contentfulData = this.data();

      if (contentfulData) {
        this.addStylesFromContentful(contentfulData);
      }
    });
  }

  ngOnInit(): void {
    this.appSettings
      .waitForSettings()
      .then(() => {
        // DEMO NOTE: the real app skips re-fetching if translations are
        // already cached in sessionStorage from an earlier visit. While
        // iterating on this demo's mocked translations, that cache can
        // hold onto a stale (or empty) copy from an earlier test and mask
        // any updates — so this always re-fetches instead of checking
        // `hasTranslations()` first. Harmless for a demo (the mock
        // resolves instantly), and avoids confusing stale-cache bugs.
        this.contentfulService.getContentfulTextData().subscribe({
          next: (contentfulResponse) => {
            this.i18nService.setTranslations(contentfulResponse);
          },
          error: (error) => {
            console.error('❌ Error cargando traducciones:', error);
          },
        });
      })
      .catch((err) => {
        console.error('❌ Error esperando configuración:', err);
      });
  }

  private getDataFromContentful(prefix: string) {
    this.contentfulService.getContentfulWitheLabelData(prefix).subscribe({
      next: (fields) => {
        this.data.set(fields);
      },
      error: (err) => {
        console.error('❌ Error obteniendo datos de Contentful:', err);
      },
    });
  }

  private addStylesFromContentful(contentfulData: ItemFields) {
    let cssContent = ':root {\n';

    cssContent += contentfulData.cssRoot;

    imageKeys.forEach((key) => {
      const image = (contentfulData as any)[key];
      if (image?.fields?.file?.url) {
        const rawUrl = image.fields.file.url;
        // DEMO NOTE: Contentful URLs are protocol-relative ("//cdn...")
        // and need "https:" prefixed. This demo's images are local static
        // assets instead, so the prefix is only added when the URL
        // actually looks protocol-relative.
        const imageUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
        cssContent += `\n--${key}: url('${imageUrl}');\n`;
      }
    });

    cssContent += '}\n\n';

    cssContent += contentfulData.fontFace;

    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);
  }
}
