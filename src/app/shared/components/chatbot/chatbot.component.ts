import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';
import { ChatbotConfig, ChatbotMessage } from '@/app/shared/components/chatbot/chatbot.interface';

// Declaración global para el widget
declare global {
  interface Window {
    ChatbotNexusWidget: {
      init: (config: ChatbotConfig) => void;
      enableEngagement: (enabled: boolean) => void;
      clearCues: () => void;
      testAudio: () => void;
      toggleWidget?: () => void;
      addMessageToUI?: (role: string, content: string, timestamp: string, messageId: string) => boolean;
    };
  }
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  template: `
    <!-- El widget se renderiza automáticamente por el script JavaScript -->
    <!-- Este componente maneja la lógica de inicialización y control -->
  `,
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private readonly appSettings = inject(AppSettingsService);

  // Estado del componente
  private readonly _isLoading = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _isInitialized = signal(false);
  private readonly _isOpen = signal(false);
  private readonly _isConnected = signal(false);
  private readonly _messages = signal<ChatbotMessage[]>([]);

  // Configuración por defecto
  private readonly defaultConfig: ChatbotConfig = {
    apiUrl: 'https://nexus-staging-dupl.onrender.com',
    companyName: 'NexusTours',
    primaryColor: '#E73A4E',
    textColor: '#FFFFFF',
    position: 'bottom-right',
    enableGlow: true,
    enableSound: true,
    enablePulse: true,
    initialDelay: 3000,
    reminderInterval: 45000,
    maxReminders: 3,
    pollingInterval: 5000
  };

  // Getters públicos
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isInitialized = this._isInitialized.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly isConnected = this._isConnected.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly messageCount = computed(() => this._messages().length);

  // Configuración computada
  readonly config = computed(() => {
    const settings = this.appSettings.settings();
    return {
      ...this.defaultConfig,
      // Sobrescribir con configuración de la app si está disponible
      apiUrl: settings?.chatbot?.apiUrl || this.defaultConfig.apiUrl,
      companyName: settings?.chatbot?.companyName || this.defaultConfig.companyName,
      primaryColor: settings?.chatbot?.primaryColor || this.defaultConfig.primaryColor,
      textColor: settings?.chatbot?.textColor || this.defaultConfig.textColor,
      position: settings?.chatbot?.position || this.defaultConfig.position,
      enableGlow: settings?.chatbot?.enableGlow ?? this.defaultConfig.enableGlow,
      enableSound: settings?.chatbot?.enableSound ?? this.defaultConfig.enableSound,
      enablePulse: settings?.chatbot?.enablePulse ?? this.defaultConfig.enablePulse,
      initialDelay: settings?.chatbot?.initialDelay || this.defaultConfig.initialDelay,
      reminderInterval: settings?.chatbot?.reminderInterval || this.defaultConfig.reminderInterval,
      maxReminders: settings?.chatbot?.maxReminders || this.defaultConfig.maxReminders,
      pollingInterval: settings?.chatbot?.pollingInterval || this.defaultConfig.pollingInterval,
    };
  });

  ngOnInit(): void {
    this._isLoading.set(true);
    this._error.set(null);

    // Esperar a que la configuración de la app esté lista
    this.appSettings.waitForSettings()
      .then(() => {
        // Inicializar el chatbot
        return this.initialize();
      })
      .then(() => {
        console.log('✅ Chatbot component inicializado correctamente');
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        this._error.set(errorMessage);
        console.error('❌ Error inicializando chatbot component:', error);
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    // Limpiar el widget del DOM
    this.destroy();
    console.log('🧹 Chatbot component destruido');
  }

  /**
   * Inicializa el widget del chatbot
   */
  private initialize(): Promise<void> {
    if (this._isInitialized()) {
      console.log('Chatbot ya está inicializado');
      return Promise.resolve();
    }

    return this.loadWidgetScript()
      .then(() => {
        // Inicializar el widget con la configuración
        const config = this.config();
        this.initWidget(config);
        
        this._isInitialized.set(true);
        console.log('✅ Chatbot inicializado correctamente');
      })
      .catch((error) => {
        console.error('❌ Error inicializando chatbot:', error);
        throw error;
      });
  }

  /**
   * Carga el script del widget de manera asíncrona
   */
  private loadWidgetScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si el script ya está cargado
      if (document.getElementById('nexus-widget-script')) {
        resolve();
        return;
      }

      // Verificar si el widget ya está disponible globalmente
      if (window.ChatbotNexusWidget) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'nexus-widget-script';
      script.src = 'assets/chatbot/nexus-widget.js';
      script.defer = true;
      
      script.onload = () => {
        console.log('📜 Script del chatbot cargado');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ Error cargando script del chatbot:', error);
        reject(new Error(`Error cargando script del chatbot: ${error}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Inicializa el widget con la configuración proporcionada
   */
  private initWidget(config: ChatbotConfig): void {
    if (!window.ChatbotNexusWidget) {
      throw new Error('ChatbotNexusWidget no está disponible en el objeto window');
    }

    console.log('🔧 Inicializando widget con configuración:', config);
    
    window.ChatbotNexusWidget.init(config);
    
    // Configurar listeners para eventos del widget
    this.setupWidgetListeners();
  }

  /**
   * Configura los listeners para eventos del widget
   */
  private setupWidgetListeners(): void {
    // Escuchar cambios en el estado del widget
    const originalToggle = window.ChatbotNexusWidget?.toggleWidget;
    if (originalToggle) {
      window.ChatbotNexusWidget.toggleWidget = () => {
        originalToggle();
        this._isOpen.set(!this._isOpen());
      };
    }

    // Escuchar nuevos mensajes
    const originalAddMessage = window.ChatbotNexusWidget?.addMessageToUI;
    if (originalAddMessage) {
      window.ChatbotNexusWidget.addMessageToUI = (role: string, content: string, timestamp: string, messageId: string) => {
        const result = originalAddMessage(role, content, timestamp, messageId);
        
        // Actualizar el estado local
        const newMessage: ChatbotMessage = {
          id: messageId || Date.now().toString(),
          content,
          sender_type: role as 'customer' | 'assistant' | 'system',
          created_at: timestamp || new Date().toISOString()
        };
        
        this._messages.update(messages => [...messages, newMessage]);
        
        return result;
      };
    }
  }

  /**
   * Abre el widget del chatbot
   */
  openChatbot(): void {
    if (!this._isInitialized()) {
      console.warn('⚠️ Chatbot no está inicializado');
      return;
    }

    const chatButton = document.getElementById('nexus-widget-button');
    if (chatButton) {
      chatButton.click();
    }
  }

  /**
   * Cierra el widget del chatbot
   */
  closeChatbot(): void {
    if (!this._isInitialized()) {
      console.warn('⚠️ Chatbot no está inicializado');
      return;
    }

    const closeButton = document.getElementById('nexus-widget-close');
    if (closeButton) {
      closeButton.click();
    }
  }

  /**
   * Envía un mensaje al chatbot
   */
  sendMessage(message: string): void {
    if (!this._isInitialized()) {
      console.warn('⚠️ Chatbot no está inicializado');
      return;
    }

    const messageInput = document.getElementById('nexus-widget-message-input') as HTMLTextAreaElement;
    const sendButton = document.getElementById('nexus-widget-send');
    
    if (messageInput && sendButton) {
      messageInput.value = message;
      sendButton.click();
    }
  }

  /**
   * Limpia las señales de engagement del chatbot
   */
  clearEngagementCues(): void {
    if (window.ChatbotNexusWidget?.clearCues) {
      window.ChatbotNexusWidget.clearCues();
    }
  }

  /**
   * Habilita o deshabilita las características de engagement
   */
  setEngagementEnabled(enabled: boolean): void {
    if (window.ChatbotNexusWidget?.enableEngagement) {
      window.ChatbotNexusWidget.enableEngagement(enabled);
    }
  }

  /**
   * Prueba el audio del chatbot
   */
  testAudio(): void {
    if (window.ChatbotNexusWidget?.testAudio) {
      window.ChatbotNexusWidget.testAudio();
    }
  }

  /**
   * Obtiene el estado actual del widget
   */
  getWidgetState(): { isOpen: boolean; isConnected: boolean; messageCount: number } {
    return {
      isOpen: this._isOpen(),
      isConnected: this._isConnected(),
      messageCount: this._messages().length
    };
  }

  /**
   * Reinicializa el chatbot en caso de error
   */
  retryInitialization(): void {
    this._error.set(null);
    this._isInitialized.set(false);
    this.ngOnInit();
  }

  /**
   * Destruye el widget y limpia los recursos
   */
  private destroy(): void {
    // Limpiar listeners y estado
    this._isInitialized.set(false);
    this._isOpen.set(false);
    this._isConnected.set(false);
    this._messages.set([]);

    // Remover el script del DOM
    const script = document.getElementById('nexus-widget-script');
    if (script) {
      script.remove();
    }

    // Limpiar el widget del DOM
    const widgetContainer = document.getElementById('nexus-widget-container');
    if (widgetContainer) {
      widgetContainer.remove();
    }

    console.log('🧹 Chatbot destruido y recursos limpiados');
  }
}
