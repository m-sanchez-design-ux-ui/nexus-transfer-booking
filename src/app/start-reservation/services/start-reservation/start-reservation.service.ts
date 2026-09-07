import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  IGetBookingsRequest,
  IGetBookingsResponse,
} from '@/app/start-reservation/interfaces/start-reservation.interface';
import { AppSettingsService } from '@/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class StartReservationService {
  private readonly httpClient = inject(HttpClient);
  private readonly appSettingsService = inject(AppSettingsService);

  constructor() {}

  getBookings(data: IGetBookingsRequest): Observable<IGetBookingsResponse> {
    let params = new HttpParams();
    params = params.set('Locator', data.locator);
    if (data.language && data.language !== '') {
      params = params.set('Language', data.language);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.appSettingsService.apiConfig()?.blueDiamondApiKey ?? '',
    });

    return this.httpClient.get<IGetBookingsResponse>(
      `${this.appSettingsService.apiConfig()?.blueDiamondApiUrl}/bookings`,
      { headers: headers, params: params }
    );
  }
}
