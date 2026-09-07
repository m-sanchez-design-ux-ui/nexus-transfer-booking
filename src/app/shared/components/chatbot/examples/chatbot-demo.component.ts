import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '@/app/shared/components/chatbot/chatbot.component';

/**
 * Componente de demostración que muestra cómo usar el chatbot
 * de manera avanzada con todas sus características
 */
@Component({
  selector: 'app-chatbot-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Chatbot Demo - NexusTours</h1>

      <!-- Estado del Chatbot -->
      <div class="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-3">Estado del Chatbot</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-600">Inicializado</div>
            <div class="text-lg font-bold" [class]="isInitialized() ? 'text-green-600' : 'text-red-600'">
              {{ isInitialized() ? '✅' : '❌' }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Abierto</div>
            <div class="text-lg font-bold" [class]="isOpen() ? 'text-green-600' : 'text-gray-600'">
              {{ isOpen() ? '✅' : '❌' }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Conectado</div>
            <div class="text-lg font-bold" [class]="isConnected() ? 'text-green-600' : 'text-red-600'">
              {{ isConnected() ? '✅' : '❌' }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Mensajes</div>
            <div class="text-lg font-bold text-blue-600">{{ messageCount() }}</div>
          </div>
        </div>
      </div>

      <!-- Controles del Chatbot -->
      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="text-xl font-semibold mb-3">Controles del Chatbot</h2>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            (click)="openChatbot()"
            [disabled]="!isInitialized()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
            Abrir Chatbot
          </button>
          <button
            (click)="closeChatbot()"
            [disabled]="!isInitialized()"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300">
            Cerrar Chatbot
          </button>
          <button
            (click)="testAudio()"
            [disabled]="!isInitialized()"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300">
            Probar Audio
          </button>
          <button
            (click)="clearEngagementCues()"
            [disabled]="!isInitialized()"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300">
            Limpiar Engagement
          </button>
        </div>

        <!-- Envío de mensaje -->
        <div class="flex gap-2">
          <input
            [(ngModel)]="messageToSend"
            placeholder="Escribe un mensaje..."
            class="flex-1 px-3 py-2 border rounded"
            (keyup.enter)="sendMessage()"
            [disabled]="!isInitialized()">
          <button
            (click)="sendMessage()"
            [disabled]="!isInitialized() || !messageToSend.trim()"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300">
            Enviar
          </button>
        </div>
      </div>

      <!-- Configuración de Engagement -->
      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="text-xl font-semibold mb-3">Configuración de Engagement</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="engagementSettings.glow"
              (change)="updateEngagementSettings()"
              class="mr-2">
            <span>Efecto Glow</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="engagementSettings.sound"
              (change)="updateEngagementSettings()"
              class="mr-2">
            <span>Sonido</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="engagementSettings.pulse"
              (change)="updateEngagementSettings()"
              class="mr-2">
            <span>Efecto Pulse</span>
          </label>
        </div>
      </div>

      <!-- Mensajes Recientes -->
      <div class="bg-white border rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3">Mensajes Recientes</h2>
        <div class="max-h-64 overflow-y-auto">
          @if (messages().length === 0) {
            <p class="text-gray-500 text-center py-4">No hay mensajes aún</p>
          } @else {
            @for (message of messages(); track message.id) {
              <div class="mb-2 p-2 rounded"
                   [class]="getMessageClass(message.sender_type)">
                <div class="text-sm font-semibold">{{ getSenderLabel(message.sender_type) }}</div>
                <div class="text-sm">{{ message.content }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(message.created_at) }}</div>
              </div>
            }
          }
        </div>
      </div>

      <!-- Información de Debug -->
      <div class="bg-gray-800 text-white p-4 rounded-lg mt-6">
        <h2 class="text-xl font-semibold mb-3">Información de Debug</h2>
        <pre class="text-sm overflow-x-auto">{{ debugInfo() }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .message-user {
      @apply bg-blue-100 border-l-4 border-blue-500;
    }
    .message-assistant {
      @apply bg-green-100 border-l-4 border-green-500;
    }
    .message-system {
      @apply bg-yellow-100 border-l-4 border-yellow-500;
    }
  `]
})
export class ChatbotDemoComponent {
  private readonly chatbotComponent = inject(ChatbotComponent);

  // Estado del componente
  messageToSend = '';
  engagementSettings = {
    glow: true,
    sound: true,
    pulse: true
  };

  // Signals del chatbot
  readonly isInitialized = this.chatbotComponent.isInitialized;
  readonly isOpen = this.chatbotComponent.isOpen;
  readonly isConnected = this.chatbotComponent.isConnected;
  readonly messages = this.chatbotComponent.messages;
  readonly messageCount = computed(() => this.chatbotComponent.messages().length);

  // Información de debug
  readonly debugInfo = computed(() => {
    const state = this.chatbotComponent.getWidgetState();
    return JSON.stringify({
      widgetState: state,
      engagementSettings: this.engagementSettings,
      timestamp: new Date().toISOString()
    }, null, 2);
  });

  /**
   * Abre el chatbot
   */
  openChatbot(): void {
    this.chatbotComponent.openChatbot();
  }

  /**
   * Cierra el chatbot
   */
  closeChatbot(): void {
    this.chatbotComponent.closeChatbot();
  }

  /**
   * Envía un mensaje al chatbot
   */
  sendMessage(): void {
    if (this.messageToSend.trim()) {
      this.chatbotComponent.sendMessage(this.messageToSend);
      this.messageToSend = '';
    }
  }

  /**
   * Prueba el audio del chatbot
   */
  testAudio(): void {
    this.chatbotComponent.testAudio();
  }

  /**
   * Limpia las señales de engagement
   */
  clearEngagementCues(): void {
    this.chatbotComponent.clearEngagementCues();
  }

  /**
   * Actualiza la configuración de engagement
   */
  updateEngagementSettings(): void {
    const enabled = this.engagementSettings.glow || this.engagementSettings.sound || this.engagementSettings.pulse;
    this.chatbotComponent.setEngagementEnabled(enabled);
  }

  /**
   * Obtiene la clase CSS para el tipo de mensaje
   */
  getMessageClass(senderType: string): string {
    switch (senderType) {
      case 'customer':
      case 'user':
        return 'message-user';
      case 'assistant':
        return 'message-assistant';
      case 'system':
        return 'message-system';
      default:
        return 'message-system';
    }
  }

  /**
   * Obtiene la etiqueta del remitente
   */
  getSenderLabel(senderType: string): string {
    switch (senderType) {
      case 'customer':
      case 'user':
        return 'Usuario';
      case 'assistant':
        return 'Asistente';
      case 'system':
        return 'Sistema';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Formatea la hora del mensaje
   */
  formatTime(timestamp: string): string {
    try {
      return new Date(timestamp).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Hora desconocida';
    }
  }
}
