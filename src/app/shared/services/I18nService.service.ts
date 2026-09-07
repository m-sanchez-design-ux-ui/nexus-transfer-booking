import { Injectable, signal, computed } from '@angular/core';
import {
  IContentfulDataTextResponse,
  DynamicTranslations,
  LanguageInfo,
  SelectedLanguage,
  Item,
} from '@/app/shared/interfaces/contentful-text-data.interface';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly STORAGE_KEY = 'selected-language';
  private readonly TRANSLATIONS_KEY = 'app-translations';
  private readonly AVAILABLE_LANGUAGES_KEY = 'available-languages';
  private readonly DEFAULT_LANGUAGE = {
    code: 'English',
    displayName: 'English',
    isoCode: 'en-US',
  }; // Fallback por defecto

  private readonly selectedLanguage = signal<SelectedLanguage>(
    this.getStoredLanguage()
  );
  private readonly translations = signal<DynamicTranslations | null>(null);
  private readonly languagesInfo = signal<LanguageInfo[]>([]);

  // Computed signals para reactividad automática
  public readonly language = this.selectedLanguage.asReadonly();
  public readonly languages = computed(() =>
    this.languagesInfo().map((lang) => lang.code)
  );
  public readonly availableLanguages = computed(() =>
    this.languagesInfo().map((lang) => lang.code)
  );
  public readonly languagesWithInfo = this.languagesInfo.asReadonly();
  public readonly isLoaded = computed(() => this.translations() !== null);

  constructor() {
    this.loadStoredData();
  }

  /**
   * Obtiene el idioma almacenado en sessionStorage
   */
  private getStoredLanguage(): SelectedLanguage {
    if (typeof sessionStorage === 'undefined') {
      return this.DEFAULT_LANGUAGE;
    }

    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        // Intentar parsear como objeto (nuevo formato)
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.code &&
          parsed.isoCode
        ) {
          return parsed as SelectedLanguage;
        }
      }
    } catch (error) {
      console.warn('Error parsing stored language:', error);
      return this.DEFAULT_LANGUAGE;
    }

    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Carga los datos almacenados desde sessionStorage
   */
  private loadStoredData(): void {
    this.loadStoredTranslations();
    this.loadLanguagesInfo();
  }

  /**
   * Carga las traducciones desde sessionStorage si existen
   */
  private loadStoredTranslations(): void {
    if (typeof sessionStorage === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(this.TRANSLATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DynamicTranslations;
        this.translations.set(parsed);
      }
    } catch (error) {
      console.warn('Error loading stored translations:', error);
      this.clearStoredTranslations();
    }
  }

  /**
   * Carga la información de idiomas desde sessionStorage
   */
  private loadLanguagesInfo(): void {
    if (typeof sessionStorage === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(this.AVAILABLE_LANGUAGES_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as LanguageInfo[];
        const selectedLanguageStorage = this.getStoredLanguage();
        this.languagesInfo.set(parsed);

        // Validar que el idioma actual esté disponible
        const availableCodes = parsed.map((lang) => lang);
        if (!availableCodes.includes(this.language())) {
          this.setLanguage(
            availableCodes.find(
              (code) => code.code === selectedLanguageStorage.code
            ) ?? this.DEFAULT_LANGUAGE
          );
        }
      }
    } catch (error) {
      console.warn('Error loading languages info:', error);
    }
  }

  /**
   * Guarda las traducciones en sessionStorage
   */
  private saveTranslationsToStorage(translations: DynamicTranslations): void {
    if (typeof sessionStorage === 'undefined') return;

    try {
      sessionStorage.setItem(
        this.TRANSLATIONS_KEY,
        JSON.stringify(translations)
      );
    } catch (error) {
      console.warn('Error saving translations to storage:', error);
    }
  }

  /**
   * Guarda la información de idiomas en sessionStorage
   */
  private saveLanguagesInfoToStorage(languagesInfo: LanguageInfo[]): void {
    if (typeof sessionStorage === 'undefined') return;

    try {
      sessionStorage.setItem(
        this.AVAILABLE_LANGUAGES_KEY,
        JSON.stringify(languagesInfo)
      );
    } catch (error) {
      console.warn('Error saving languages info to storage:', error);
    }
  }

  /**
   * Limpia las traducciones almacenadas
   */
  private clearStoredTranslations(): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(this.TRANSLATIONS_KEY);
    sessionStorage.removeItem(this.AVAILABLE_LANGUAGES_KEY);
  }

  /**
   * Normaliza la respuesta de Contentful al formato interno
   */
  private normalizeContentfulResponse(
    contentfulResponse: IContentfulDataTextResponse
  ): {
    translations: DynamicTranslations;
    languagesInfo: LanguageInfo[];
  } {
    const translations: DynamicTranslations = {};
    const languagesInfo: LanguageInfo[] = [];

    contentfulResponse.items.forEach((item: Item) => {
      const { language, value, isoCode } = item.fields;

      if (language && value) {
        // Buscar si ya existe este idioma en la info
        let existingLangInfo = languagesInfo.find(
          (lang) => lang.code === language
        );

        if (!existingLangInfo) {
          // Crear nueva entrada de información del idioma
          const newLanguageInfo: LanguageInfo = {
            code: language,
            isoCode: isoCode || language, // Usar isoCode si está disponible, sino usar language
            displayName: this.getLanguageDisplayName(language),
          };
          languagesInfo.push(newLanguageInfo);
        }

        // Combinar las traducciones si ya existe el idioma
        translations[language] = {
          ...translations[language],
          ...value,
        };
      }
    });

    // Ordenar idiomas alfabéticamente, pero spanish primero si existe
    languagesInfo.sort((a, b) => {
      if (a.code === 'spanish') return -1;
      if (b.code === 'spanish') return 1;
      return a.displayName!.localeCompare(b.displayName!);
    });

    return { translations, languagesInfo };
  }

  /**
   * Establece las traducciones obtenidas de Contentful
   */
  public setTranslations(
    contentfulResponse: IContentfulDataTextResponse
  ): void {
    const { translations, languagesInfo } =
      this.normalizeContentfulResponse(contentfulResponse);

    this.translations.set(translations);
    this.languagesInfo.set(languagesInfo);

    this.saveTranslationsToStorage(translations);
    this.saveLanguagesInfoToStorage(languagesInfo);

    // Si el idioma actual no está disponible, cambiar al primero disponible
    const availableCodes = languagesInfo.map((lang) => lang);
    if (
      availableCodes.length > 0 &&
      !availableCodes.includes(this.language())
    ) {
      this.setLanguage(availableCodes[0]);
    }
  }

  /**
   * Cambia el idioma actual
   */
  public setLanguage(language: SelectedLanguage): void {
    const availableLanguages = this.languagesInfo().map((lang) => lang.code);

    if (
      availableLanguages.length > 0 &&
      !availableLanguages.includes(language.code)
    ) {
      console.warn(
        `Language '${language.code}' is not available. Available languages:`,
        availableLanguages
      );
      return;
    }

    this.selectedLanguage.set(language);

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(language));
    }
  }

  /**
   * Obtiene las traducciones del idioma especificado de manera type-safe
   */
  private getTranslationsForLanguage(
    translations: DynamicTranslations,
    language: string
  ): { [key: string]: string } {
    return translations[language] || {};
  }

  /**
   * Obtiene una traducción por clave
   */
  public translate(key: string, fallback?: string): string {
    const currentTranslations = this.translations();

    if (!currentTranslations) {
      return fallback || key;
    }

    const currentLang = this.language();
    const languageTranslations = this.getTranslationsForLanguage(
      currentTranslations,
      currentLang.code
    );

    if (!languageTranslations || !languageTranslations[key]) {
      // Fallback al primer idioma disponible si no existe la traducción
      const availableLanguages = this.availableLanguages();
      for (const fallbackLang of availableLanguages) {
        if (fallbackLang !== currentLang.code) {
          const fallbackTranslations = this.getTranslationsForLanguage(
            currentTranslations,
            fallbackLang
          );
          if (fallbackTranslations && fallbackTranslations[key]) {
            return fallbackTranslations[key];
          }
        }
      }

      return fallback || key;
    }

    return languageTranslations[key];
  }

  /**
   * Obtiene todas las traducciones del idioma actual
   */
  public getCurrentTranslations(): { [key: string]: string } | null {
    const currentTranslations = this.translations();

    if (!currentTranslations) {
      return null;
    }

    const currentLang = this.language().code;
    return this.getTranslationsForLanguage(currentTranslations, currentLang);
  }

  /**
   * Verifica si las traducciones están cargadas
   */
  public hasTranslations(): boolean {
    return this.translations() !== null;
  }

  /**
   * Obtiene los idiomas disponibles (solo códigos)
   */
  public getAvailableLanguages(): string[] {
    return this.languagesInfo().map((lang) => lang.code);
  }

  /**
   * Obtiene la información completa de los idiomas disponibles
   */
  public getLanguagesInfo(): LanguageInfo[] {
    return this.languagesInfo();
  }

  /**
   * Obtiene el isoCode de un idioma específico
   */
  public getLanguageIsoCode(languageCode: string): string | null {
    const langInfo = this.languagesInfo().find(
      (lang) => lang.code === languageCode
    );
    return langInfo?.isoCode || null;
  }

  /**
   * Obtiene el isoCode del idioma actual
   */
  public getCurrentLanguageIsoCode(): string | null {
    return this.getLanguageIsoCode(this.language().isoCode);
  }

  /**
   * Verifica si un idioma está disponible
   */
  public isLanguageAvailable(language: string): boolean {
    return this.languagesInfo().some((lang) => lang.code === language);
  }

  /**
   * Obtiene el nombre display del idioma
   */
  public getLanguageDisplayName(language: string): string {
    const displayNames: { [key: string]: string } = {
      spanish: 'Español',
      english: 'English',
      french: 'Français',
      german: 'Deutsch',
      italian: 'Italiano',
      portuguese: 'Português',
    };

    return (
      displayNames[language] ||
      language.charAt(0).toUpperCase() + language.slice(1)
    );
  }

  /**
   * Obtiene información de debug sobre las traducciones cargadas
   */
  public getDebugInfo(): any {
    const currentTranslations = this.translations();
    const languagesInfo = this.languagesInfo();

    if (!currentTranslations) {
      return {
        loaded: false,
        languages: [],
        totalKeys: 0,
        languagesInfo: [],
      };
    }

    const info = {
      loaded: true,
      currentLanguage: this.language(),
      currentLanguageIsoCode: this.getCurrentLanguageIsoCode(),
      languagesInfo: languagesInfo,
      availableLanguageCodes: languagesInfo.map((lang) => lang.code),
      languages: Object.keys(currentTranslations),
      keyCounts: {} as { [key: string]: number },
      totalKeys: 0,
      sampleKeys: {} as { [key: string]: string[] },
    };

    Object.keys(currentTranslations).forEach((lang) => {
      const langTranslations = currentTranslations[lang];
      if (langTranslations) {
        const keys = Object.keys(langTranslations);
        info.keyCounts[lang] = keys.length;
        info.sampleKeys[lang] = keys.slice(0, 5); // Primeras 5 keys como muestra

        if (info.totalKeys === 0) {
          info.totalKeys = keys.length;
        }
      }
    });

    return info;
  }

  /**
   * Limpia el cache de traducciones (útil para actualizaciones)
   */
  public clearCache(): void {
    this.translations.set(null);
    this.languagesInfo.set([]);
    this.clearStoredTranslations();
  }
}
