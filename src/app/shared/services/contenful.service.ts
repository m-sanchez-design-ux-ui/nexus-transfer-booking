import { inject, Injectable, computed } from '@angular/core';
import { Observable, defer } from 'rxjs';

import { ItemFields } from '@/app/shared/interfaces/contentful.interface';
import { IContentfulDataTextResponse } from '@/app/shared/interfaces/contentful-text-data.interface';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import {
  buildMockContentfulStyleFields,
  buildMockContentfulTextResponse,
} from '@/app/shared/mocks/mock-data';

// ---------------------------------------------------------------------------
// DEMO NOTE
// ---------------------------------------------------------------------------
// The real ContentfulService fetches copy/branding from Contentful via its
// own SDK (createClient), which doesn't go through Angular's HttpClient —
// so it can't be intercepted the way the rest of this demo's API calls are.
// Instead, this whole service was replaced with local mock data. No real
// Contentful client, space, or access token is created or used here.
// ---------------------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private readonly appSettings = inject(AppSettingsService);

  getContentfulWitheLabelData(tag: string = 'default'): Observable<any> {
    return defer(async () => {
      await this.appSettings.waitForSettings();
      return buildMockContentfulStyleFields();
    });
  }

  checkContentfulSlugExists(slug: string): Observable<boolean> {
    return defer(async () => {
      await this.appSettings.waitForSettings();
      // Any slug "exists" in this demo — there's no real white-label
      // catalog to validate against.
      return true;
    });
  }

  getContentfulTextData(): Observable<IContentfulDataTextResponse> {
    return defer(async () => {
      await this.appSettings.waitForSettings();
      return buildMockContentfulTextResponse() as unknown as IContentfulDataTextResponse;
    });
  }

  getContentfulData(): Observable<any> {
    return defer(async () => {
      await this.appSettings.waitForSettings();
      return buildMockContentfulStyleFields();
    });
  }
}
