# Chatbot Integration - NexusTours

Este directorio contiene la integración del chatbot de NexusTours con Angular 18.

## Estructura

```
src/app/chatbot/
├── nexus-widget/
│   └── chatbot.component.ts    # Componente principal del chatbot
└── README.md                   # Este archivo
```

## Archivos Relacionados

- `src/app/shared/components/chatbot/chatbot.component.ts` - Componente para manejar la lógica del chatbot
- `src/app/shared/interfaces/chatbot.interface.ts` - Interfaces TypeScript para el chatbot
- `src/assets/chatbot/nexus-widget.js` - Script JavaScript del widget (original)
- `src/assets/config/appsettings.json` - Configuración del chatbot

## Características

### ✅ Integración Completa con Angular 18
- Uso de **signals** para reactividad
- **Standalone components** 
- **Dependency injection** moderna
- **TypeScript** con tipado fuerte

### ✅ Gestión de Estado Reactiva
- Estado del chatbot (abierto/cerrado, conectado, mensajes)
- Configuración centralizada
- Manejo de errores robusto

### ✅ Configuración Flexible
- Configuración desde `appsettings.json`
- Personalización de colores, posición, sonidos
- Configuración de engagement (glow, pulse, reminders)

### ✅ Características del Widget Original
- **WebSocket** para comunicación en tiempo real
- **Polling** como fallback
- **Markdown** rendering con sanitización
- **Audio notifications** sofisticadas
- **Engagement cues** (glow, pulse, bounce)
- **Resizable** chat window
- **Mobile responsive**

## Uso

### Inicialización Automática
El chatbot se inicializa automáticamente cuando se carga la aplicación:

```typescript
// En app.component.ts
import { ChatbotComponent } from '@/app/shared/components/chatbot/chatbot.component';

@Component({
  imports: [ChatbotComponent],
  template: `
    <router-outlet></router-outlet>
    <app-chatbot></app-chatbot>
  `
})
```

### Uso Programático
```typescript
import { ChatbotComponent } from '@/app/shared/components/chatbot/chatbot.component';

export class MyComponent {
  private chatbotComponent = inject(ChatbotComponent);

  // Abrir chatbot
  openChat() {
    this.chatbotComponent.openChatbot();
  }

  // Enviar mensaje
  sendMessage() {
    this.chatbotComponent.sendMessage('Hola, necesito ayuda');
  }

  // Obtener estado
  getChatState() {
    return this.chatbotComponent.getWidgetState();
  }
}
```

### Configuración
Edita `src/assets/config/appsettings.json`:

```json
{
  "chatbot": {
    "apiUrl": "https://nexus-staging-dupl.onrender.com",
    "companyName": "NexusTours",
    "primaryColor": "#E73A4E",
    "position": "bottom-right",
    "enableGlow": true,
    "enableSound": true,
    "enablePulse": true,
    "initialDelay": 3000,
    "reminderInterval": 45000,
    "maxReminders": 3
  }
}
```

## API del Servicio

### Métodos Principales
- `initialize()` - Inicializa el widget
- `open()` - Abre el chatbot
- `close()` - Cierra el chatbot
- `sendMessage(message: string)` - Envía un mensaje
- `clearEngagementCues()` - Limpia señales de engagement
- `setEngagementEnabled(enabled: boolean)` - Habilita/deshabilita engagement
- `testAudio()` - Prueba el audio
- `getWidgetState()` - Obtiene el estado actual
- `destroy()` - Destruye el widget

### Signals Reactivos
- `isInitialized` - Si el chatbot está inicializado
- `isOpen` - Si el chatbot está abierto
- `isConnected` - Si está conectado al servidor
- `messages` - Array de mensajes
- `threadId` - ID del hilo de conversación

## Características Técnicas

### Comunicación
- **WebSocket** primario para tiempo real
- **HTTP Polling** como fallback
- **Heartbeat** para mantener conexión
- **Reconexión automática** con backoff exponencial

### Seguridad
- **DOMPurify** para sanitización de HTML
- **Marked.js** para parsing de Markdown
- **CSP** compatible

### Performance
- **Lazy loading** del script
- **Cleanup automático** de recursos
- **Memory management** optimizado
- **Debounced** engagement cues

### Accesibilidad
- **Keyboard navigation**
- **Screen reader** compatible
- **High contrast** support
- **Reduced motion** respect

## Debugging

### Console Logs
El chatbot incluye logs detallados:
- `✅` - Operaciones exitosas
- `❌` - Errores
- `🔔` - Notificaciones de audio
- `📡` - Comunicación de red
- `🎯` - Engagement cues

### Métodos de Debug
```typescript
// Probar audio
chatbotService.testAudio();

// Obtener estado completo
console.log(chatbotService.getWidgetState());

// Limpiar engagement cues
chatbotService.clearEngagementCues();
```

## Troubleshooting

### Widget no aparece
1. Verificar que el script se carga: `assets/chatbot/nexus-widget.js`
2. Revisar configuración en `appsettings.json`
3. Verificar logs en consola

### No se conecta al servidor
1. Verificar `apiUrl` en configuración
2. Revisar CORS en el servidor
3. Verificar que el servidor esté funcionando

### Audio no funciona
1. Verificar `enableSound: true` en configuración
2. Requiere interacción del usuario (política del navegador)
3. Usar `testAudio()` para debug

## Migración desde Implementación Anterior

### Antes (JavaScript directo)
```typescript
// Código anterior
const script = document.createElement('script');
script.src = 'assets/chatbot/nexus-widget.js';
script.onload = () => {
  (window as any).initWidget(config);
};
```

### Ahora (Angular Service)
```typescript
// Código nuevo
private chatbotService = inject(ChatbotService);

ngOnInit() {
  this.chatbotService.initialize();
}
```

## Beneficios de la Nueva Implementación

1. **Type Safety** - Interfaces TypeScript completas
2. **Reactivity** - Signals para estado reactivo
3. **Dependency Injection** - Servicios inyectables
4. **Error Handling** - Manejo robusto de errores
5. **Configuration** - Configuración centralizada
6. **Testing** - Fácil de testear con servicios
7. **Maintainability** - Código más limpio y organizado
8. **Performance** - Optimizaciones de Angular 18
