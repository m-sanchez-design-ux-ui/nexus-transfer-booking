import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom } from 'rxjs';

import {
  AppSettings,
  IApiConfig,
  IContentfulConfig,
  IFlightStatsConfig,
  IChatbotConfig,
} from '@/app/shared/interfaces/app-settings.interface';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private readonly http = inject(HttpClient);
  
  // Signal principal para la configuración
  private readonly _settings = signal<AppSettings | null>(null);
  
  // Signal de estado de carga
  private readonly _isLoaded = signal<boolean>(false);
  
  // Computed signals para cada sección de configuración
  readonly apiConfig = computed((): IApiConfig | null => {
    const settings = this._settings();
    return settings?.api ?? null;
  });

  readonly contentfulConfig = computed((): IContentfulConfig | null => {
    const settings = this._settings();
    return settings?.contentful ?? null;
  });

  readonly flightStatsConfig = computed((): IFlightStatsConfig | null => {
    const settings = this._settings();
    return settings?.flightStats ?? null;
  });

  readonly chatbotConfig = computed((): IChatbotConfig | null => {
    const settings = this._settings();
    return settings?.chatbot ?? null;
  });

  // Computed para verificar si está cargado
  readonly isLoaded = computed(() => this._isLoaded());
  
  // Getter para toda la configuración
  readonly settings = this._settings.asReadonly();

  constructor() {}

  public async init(): Promise<void> {
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      const settings = await firstValueFrom(this.getSettingsFromFile());
      this._settings.set(settings);
      this._isLoaded.set(true);
    } catch (error) {
      console.error('❌ Error al cargar la configuración:', error);
      const defaultSettings = this.getDefaultSettings();
      this._settings.set(defaultSettings);
      this._isLoaded.set(true);
    }
  }

  private getSettingsFromFile(): Observable<AppSettings> {
    return this.http.get<AppSettings>('/assets/config/appsettings.json').pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  public async reloadSettings(): Promise<void> {
    this._isLoaded.set(false);
    await this.loadSettings();
  }

  public getConfig<K extends keyof AppSettings>(key: K): AppSettings[K] | null {
    return this.settings()?.[key] ?? null;
  }

  public hasConfig(key: keyof AppSettings): boolean {
    const settings = this.settings();
    return settings !== null && key in settings;
  }

  private getDefaultSettings(): AppSettings {
    return {
      contentful: {
        space: '',
        accessToken: '',
        environment: 'staging',
        styleContentTypeId: '',
        textContentTypeId: '',
      },
      flightStats: {
        baseUrl: '',
        appId: '',
        appKey: '',
      },
      api: {
        blueDiamondApiUrl: '',
        blueDiamondApiKey: '',
        experiencesHubApiUrl: '',
        ipifyApiUrl: '',
        ipapiApiUrl: '',
      },
      contact: {
        phoneCall: '',
      },
      chatbot: {
        apiUrl: 'https://nexus-staging-dupl.onrender.com',
        companyName: 'NexusTours',
        primaryColor: '#E73A4E',
        textColor: '#FFFFFF',
        position: 'bottom-right' as const,
        enableGlow: true,
        enableSound: true,
        enablePulse: true,
        initialDelay: 3000,
        reminderInterval: 45000,
        maxReminders: 3,
        pollingInterval: 5000,
      },
    };
  }

  // Método para esperar a que la configuración esté lista
  public async waitForSettings(): Promise<AppSettings> {
    return new Promise((resolve) => {
      const checkSettings = () => {
        const settings = this._settings();
        const isLoaded = this._isLoaded();
        
        if (isLoaded && settings) {
          resolve(settings);
        } else {
          setTimeout(checkSettings, 50); // Verificar cada 50ms
        }
      };
      
      checkSettings();
    });
  }
}
