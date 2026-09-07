/**
 * Nexus Tours Widget
 * A customizable chat widget for customer support
 * VERSION 2.0 - With Professional Markdown Rendering + Enhanced Engagement Cues
 */

(function() {
  const widgetStyles = `/* 1. Brand tokens (root variables) */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;900&family=DM+Sans:wght@400;500;700&display=swap');

:root {
/* Colour scale */
--nx-brand-red:  #E73A4E;
--nx-orange-500: #FD921E;
--nx-orange-600: #FF621D;
--nx-orange-700: #FF2C3D;
--nx-cyan-500:   #00AFDD;
--nx-gray-100:   #F4F4F4;
--nx-gray-300:   #E0E0E0;
--nx-gray-700:   #646464;
--nx-text-900:   #575756;

/* Gradient */
--nx-grad-primary: linear-gradient(90deg,#E73A4E 0%,#FF621D 100%);

/* Typography */
--nx-font-main: 'Urbanist', system-ui, sans-serif;
--nx-font-body: 'DM Sans',   system-ui, sans-serif;

/* Spacing scale (rem) */
--nx-space-1: .25rem;   /* 4px  */
--nx-space-2: .5rem;    /* 8px  */
--nx-space-3: 1rem;     /* 16px */
--nx-space-4: 1.5rem;   /* 24px */
}

/* 2. Widget container */
.nx-chat {
position: fixed;
bottom: var(--nx-space-4);
right: var(--nx-space-4);
width: 22rem;
height: 60vh;
min-width: 20rem;
min-height: 25vh;
max-width: 90vw;
max-height: 90vh;
background: #fff;
border-radius: 1rem;
box-shadow: 0 12px 32px rgba(0,0,0,.15);
display: flex;
flex-direction: column;
overflow: hidden;
font-family: var(--nx-font-body);
color: var(--nx-text-900);
z-index: 9999;
transform: scale(0.9);
opacity: 0;
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.nx-chat.nx-chat--open {
transform: scale(1);
opacity: 1;
}

/* 3. Header */
.nx-chat__header {
padding: var(--nx-space-3) var(--nx-space-4);
background: var(--nx-grad-primary);
color: #fff;
font: 700 1.125rem/1 var(--nx-font-main);
display: flex;
align-items: center;
gap: var(--nx-space-2);
}
.nx-chat__header svg {
width: 1.5rem;
height: 1.5rem;
flex-shrink: 0;
}

/* 4. Messages area */
.nx-chat__body {
flex: 1 1 auto;
padding: var(--nx-space-3);
overflow-y: auto;
background: var(--nx-gray-100);
scroll-behavior: smooth;
}
.nx-chat__body::-webkit-scrollbar {
width: 8px;
}
.nx-chat__body::-webkit-scrollbar-thumb {
background: var(--nx-gray-300);
border-radius: 4px;
}

/* 5. Message bubbles */
.nx-msg {
max-width: 80%;
padding: var(--nx-space-2) var(--nx-space-3);
margin-bottom: var(--nx-space-3);
border-radius: 1.25rem;
font-size: .95rem;
line-height: 1.4;
word-break: break-word;
}
.nx-msg--agent {
background: #fff;
border: 1px solid var(--nx-gray-300);
align-self: flex-start;
}
.nx-msg--user {
background: var(--nx-orange-500);
color: #fff;
align-self: flex-end;
}
.nx-msg--system {
align-self: center;
text-align: center;
background: transparent;
font-style: italic;
font-size: .85rem;
color: var(--nx-gray-700);
}
.nx-msg--agent + .nx-msg--agent {
margin-top: calc(-1 * var(--nx-space-1)); /* tighter stack */
}

/* 6. Timestamp / meta */
.nx-msg__meta {
display: block;
margin-top: var(--nx-space-1);
font-size: .75rem;
opacity: .7;
}

/* 7. Input bar */
.nx-chat__input {
display: flex;
align-items: center;
gap: var(--nx-space-2);
padding: var(--nx-space-2) var(--nx-space-3);
border-top: 1px solid var(--nx-gray-300);
background: #fff;
}
.nx-chat__textarea {
flex: 1 1 auto;
resize: none;
border: 0;
outline: 0;
font: 400 1rem/1.35 var(--nx-font-body);
color: var(--nx-text-900);
padding: var(--nx-space-1);
}
.nx-chat__textarea::placeholder { opacity: .5; }

/* 8. Send button */
.nx-chat__send {
display: inline-flex;
align-items: center;
justify-content: center;
width: 2.75rem;
height: 2.75rem;
background: var(--nx-orange-500);
border: none;
border-radius: 50%;
cursor: pointer;
transition: background .25s ease, transform .2s ease;
}
.nx-chat__send svg {
width: 1.25rem;
height: 1.25rem;
}
.nx-chat__send svg path {
stroke: #fff; /* Ensure path stroke is white */
}
.nx-chat__send:hover   { background: var(--nx-orange-600); transform: translateY(-2px); }
.nx-chat__send:active  { background: var(--nx-orange-700); transform: translateY( 0); }

/* 9. Utility states */
.nx-hidden { display: none !important; }
@media (prefers-reduced-motion: reduce) {
* { transition: none !important; }
}

/* 10. Markdown styles */
.nx-msg code {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

.nx-msg pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.nx-msg ul, .nx-msg ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.nx-msg li {
  margin: 0.25em 0;
}

.nx-msg ul ul, .nx-msg ol ol, .nx-msg ul ol, .nx-msg ol ul {
  margin: 0;
}

.nx-msg h1, .nx-msg h2, .nx-msg h3,
.nx-msg h4, .nx-msg h5, .nx-msg h6 {
  margin: 0.5em 0;
  line-height: 1.2;
}

.nx-msg h1 { font-size: 1.5em; }
.nx-msg h2 { font-size: 1.3em; }
.nx-msg h3 { font-size: 1.2em; }
.nx-msg h4 { font-size: 1.1em; }
.nx-msg h5 { font-size: 1em; }
.nx-msg h6 { font-size: 0.9em; }

.nx-msg a {
  color: var(--nx-orange-500);
  text-decoration: none;
}

.nx-msg a:hover {
  text-decoration: underline;
}

.nx-msg strong {
  font-weight: 600;
}

.nx-msg em {
  font-style: italic;
}

.nx-msg blockquote {
  border-left: 3px solid var(--nx-gray-300);
  margin: 0.5em 0;
  padding-left: 1em;
  color: var(--nx-gray-700);
}

/* 11. Resize Handle */
.nx-chat__resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  cursor: nwse-resize;
  z-index: 10;
}

/* 12. Enhanced Engagement Cue Animations for Maximum Attention */
@keyframes nexus-glow-intense {
  0% {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      transform: scale(1);
  }
  25% {
      box-shadow: 0 2px 25px rgba(231, 58, 78, 0.6), 0 0 35px rgba(231, 58, 78, 0.4);
      transform: scale(1.02);
  }
  50% {
      box-shadow: 0 4px 30px rgba(231, 58, 78, 0.8), 0 0 40px rgba(231, 58, 78, 0.6), inset 0 0 20px rgba(231, 58, 78, 0.2);
      transform: scale(1.05);
  }
  75% {
      box-shadow: 0 2px 25px rgba(231, 58, 78, 0.6), 0 0 35px rgba(231, 58, 78, 0.4);
      transform: scale(1.02);
  }
  100% {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      transform: scale(1);
  }
}

@keyframes nexus-pulse-urgent {
  0% { transform: scale(1); }
  20% { transform: scale(1.08); }
  40% { transform: scale(1.12); }
  60% { transform: scale(1.08); }
  80% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes nexus-bounce-attention {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
  10% { transform: translateY(-8px) scale(1.05); }
  30% { transform: translateY(-12px) scale(1.08); }
  40% { transform: translateY(-6px) scale(1.03); }
  60% { transform: translateY(-8px) scale(1.05); }
  70% { transform: translateY(-4px) scale(1.02); }
}

@keyframes nexus-notification-dot-urgent {
  0% { opacity: 0; transform: scale(0); }
  25% { opacity: 1; transform: scale(1.5); }
  50% { opacity: 1; transform: scale(1.2); }
  75% { opacity: 1; transform: scale(1.4); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes nexus-attention-ring {
  0% {
      box-shadow: 0 0 0 0 rgba(231, 58, 78, 0.7);
      transform: scale(1);
  }
  25% {
      box-shadow: 0 0 0 8px rgba(231, 58, 78, 0.5);
      transform: scale(1.02);
  }
  50% {
      box-shadow: 0 0 0 16px rgba(231, 58, 78, 0.3);
      transform: scale(1.05);
  }
  75% {
      box-shadow: 0 0 0 12px rgba(231, 58, 78, 0.2);
      transform: scale(1.02);
  }
  100% {
      box-shadow: 0 0 0 0 rgba(231, 58, 78, 0);
      transform: scale(1);
  }
}

.nexus-glowing {
  animation: nexus-glow-intense 2.5s ease-in-out infinite;
}

.nexus-pulsing {
  animation: nexus-pulse-urgent 1.2s ease-in-out 4; /* More pulses, faster */
}

.nexus-bouncing {
  animation: nexus-bounce-attention 0.8s ease-in-out 3; /* More bounces */
}

.nexus-attention-ring {
  animation: nexus-attention-ring 2s ease-out infinite;
}

.nexus-notification-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px; /* Slightly larger */
  height: 14px;
  background: #ff4757;
  border-radius: 50%;
  border: 2px solid white;
  animation: nexus-notification-dot-urgent 0.5s ease-out;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
}

/* 13. Chat button styles */
.nx-chat-button {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--nx-brand-red);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: all 0.3s ease;
}

.nx-chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(231, 58, 78, 0.3);
}
`;

  // Widget configuration
  const config = {
      position: 'bottom-right',
      primaryColor: '#E73A4E',
      textColor: '#ffffff',
      companyName: 'NexusTours',
      apiUrl: 'https://nexus-staging-dupl.onrender.com',
      widgetId: null,
      pollingInterval: 5000,
      // Engagement settings
      enableGlow: true,
      enableSound: true,
      enablePulse: true,
      initialDelay: 3000,
      reminderInterval: 45000,
      maxReminders: 3
  };

  // Widget state
  let isOpen = false;
  let sessionId = null;
  let deviceId = null;
  let threadId = null;
  let pollingTimer = null;
  let socket = null;
  let displayedMessages;
  let messagesContainer;
  let wsReconnectAttempts = 0;
  let maxReconnectAttempts = 3;
  let wsReconnectTimer = null;
  let isWebSocketEnabled = true;
  let heartbeatInterval = null;

  // Engagement state
  let hasInteracted = false;
  let reminderCount = 0;
  let reminderTimer = null;
  let playNotificationSound = null;

  // Generate a unique device ID
  function generateDeviceId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }

  // Create sophisticated notification sound that creates urgency
  function createNotificationSound() {
      let audioContext = null;
      let isAudioEnabled = false;

      // Method 1: Try Web Audio API (primary) - More sophisticated message sound
      function initWebAudio() {
          try {
              const AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (!AudioContextClass) {
                  console.log('🔇 Web Audio API not supported');
                  return false;
              }

              audioContext = new AudioContextClass();
              console.log('🔊 Web Audio API initialized successfully');
              return true;
          } catch (error) {
              console.log('🔇 Web Audio API initialization failed:', error);
              return false;
          }
      }

      // Method 2: HTML5 Audio fallback with sophisticated message sound
      function createHTML5Audio() {
          try {
              // Create multiple audio elements for different notification types
              const urgentSound = new Audio();
              urgentSound.volume = 0.4; // Higher volume for urgency

              // Create sophisticated multi-tone notification sound programmatically
              // This will create a rising triple-tone sequence that demands attention
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();

              function createMessageTone() {
                  const oscillator1 = audioContext.createOscillator();
                  const oscillator2 = audioContext.createOscillator();
                  const oscillator3 = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();

                  // Create a filter for warmer sound
                  const filter = audioContext.createBiquadFilter();
                  filter.type = 'lowpass';
                  filter.frequency.setValueAtTime(2000, audioContext.currentTime);

                  oscillator1.connect(filter);
                  oscillator2.connect(filter);
                  oscillator3.connect(filter);
                  filter.connect(gainNode);
                  gainNode.connect(audioContext.destination);

                  // Rising three-tone sequence like iPhone/WhatsApp notifications
                  // First tone: 520Hz (C5)
                  oscillator1.frequency.setValueAtTime(520, audioContext.currentTime);
                  oscillator1.frequency.setValueAtTime(520, audioContext.currentTime + 0.15);

                  // Second tone: 659Hz (E5) - creates urgency
                  oscillator2.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
                  oscillator2.frequency.setValueAtTime(659, audioContext.currentTime + 0.3);

                  // Third tone: 784Hz (G5) - completion/call-to-action
                  oscillator3.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
                  oscillator3.frequency.setValueAtTime(784, audioContext.currentTime + 0.5);

                  // Sophisticated volume envelope
                  gainNode.gain.setValueAtTime(0, audioContext.currentTime);

                  // First tone envelope
                  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.15);

                  // Second tone envelope (louder for urgency)
                  gainNode.gain.linearRampToValueAtTime(0.35, audioContext.currentTime + 0.2);
                  gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);

                  // Third tone envelope (loudest for call-to-action)
                  gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.35);
                  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.55);

                  // Start oscillators at different times
                  oscillator1.start(audioContext.currentTime);
                  oscillator1.stop(audioContext.currentTime + 0.15);

                  oscillator2.start(audioContext.currentTime + 0.15);
                  oscillator2.stop(audioContext.currentTime + 0.3);

                  oscillator3.start(audioContext.currentTime + 0.3);
                  oscillator3.stop(audioContext.currentTime + 0.55);
              }

              console.log('🔊 HTML5 Audio with sophisticated message tone initialized');

              return function() {
                  if (!config.enableSound) return;
                  try {
                      if (audioContext.state === 'suspended') {
                          audioContext.resume().then(() => {
                              createMessageTone();
                          });
                      } else {
                          createMessageTone();
                      }
                      console.log('🔔 Playing sophisticated message notification');
                  } catch (error) {
                      console.log('🔇 HTML5 Audio playback error:', error);
                  }
              };
          } catch (error) {
              console.log('🔇 HTML5 Audio creation failed:', error);
              return function() {};
          }
      }

      // Primary Web Audio API function with sophisticated message sound
      function playWebAudio() {
          if (!config.enableSound || !audioContext) return;

          try {
              // Resume audio context if suspended
              if (audioContext.state === 'suspended') {
                  console.log('🔊 Resuming suspended audio context...');
                  audioContext.resume().then(() => {
                      console.log('🔊 Audio context resumed successfully');
                      playActualMessageSound();
                  }).catch(e => {
                      console.log('🔇 Failed to resume audio context:', e);
                  });
              } else {
                  playActualMessageSound();
              }

              function playActualMessageSound() {
                  // Create sophisticated multi-layer message notification
                  // This creates urgency like WhatsApp, Telegram, or Slack notifications

                  const filter = audioContext.createBiquadFilter();
                  filter.type = 'lowpass';
                  filter.frequency.setValueAtTime(3000, audioContext.currentTime);
                  filter.Q.setValueAtTime(1, audioContext.currentTime);

                  const mainGain = audioContext.createGain();
                  filter.connect(mainGain);
                  mainGain.connect(audioContext.destination);

                  // THREE-TONE ASCENDING SEQUENCE (like iPhone message tone)
                  // This creates psychological urgency and demands attention

                  // TONE 1: 520Hz (C5) - Attention grabber
                  const osc1 = audioContext.createOscillator();
                  const gain1 = audioContext.createGain();
                  osc1.connect(gain1);
                  gain1.connect(filter);

                  osc1.frequency.setValueAtTime(520, audioContext.currentTime);
                  osc1.type = 'triangle'; // Warmer sound than sine

                  gain1.gain.setValueAtTime(0, audioContext.currentTime);
                  gain1.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.03);
                  gain1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

                  osc1.start(audioContext.currentTime);
                  osc1.stop(audioContext.currentTime + 0.15);

                  // TONE 2: 659Hz (E5) - Creates tension/urgency
                  const osc2 = audioContext.createOscillator();
                  const gain2 = audioContext.createGain();
                  osc2.connect(gain2);
                  gain2.connect(filter);

                  osc2.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
                  osc2.type = 'triangle';

                  gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.15);
                  gain2.gain.linearRampToValueAtTime(0.35, audioContext.currentTime + 0.18);
                  gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

                  osc2.start(audioContext.currentTime + 0.15);
                  osc2.stop(audioContext.currentTime + 0.3);

                  // TONE 3: 784Hz (G5) - Resolution/Call-to-action
                  const osc3 = audioContext.createOscillator();
                  const gain3 = audioContext.createGain();
                  osc3.connect(gain3);
                  gain3.connect(filter);

                  osc3.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
                  osc3.type = 'triangle';

                  gain3.gain.setValueAtTime(0, audioContext.currentTime + 0.3);
                  gain3.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.33);
                  gain3.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.55);

                  osc3.start(audioContext.currentTime + 0.3);
                  osc3.stop(audioContext.currentTime + 0.55);

                  // HARMONY LAYER: Adds richness and urgency
                  const oscHarmony = audioContext.createOscillator();
                  const gainHarmony = audioContext.createGain();
                  oscHarmony.connect(gainHarmony);
                  gainHarmony.connect(filter);

                  // Subtle harmony that follows the main sequence
                  oscHarmony.frequency.setValueAtTime(415, audioContext.currentTime); // Perfect fifth below
                  oscHarmony.frequency.setValueAtTime(523, audioContext.currentTime + 0.15);
                  oscHarmony.frequency.setValueAtTime(622, audioContext.currentTime + 0.3);
                  oscHarmony.type = 'sine'; // Subtle background

                  gainHarmony.gain.setValueAtTime(0, audioContext.currentTime);
                  gainHarmony.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                  gainHarmony.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.2);
                  gainHarmony.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.35);
                  gainHarmony.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.55);

                  oscHarmony.start(audioContext.currentTime);
                  oscHarmony.stop(audioContext.currentTime + 0.55);

                  // MASTER VOLUME ENVELOPE
                  mainGain.gain.setValueAtTime(0.8, audioContext.currentTime); // Higher volume for urgency
                  mainGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
                  mainGain.gain.linearRampToValueAtTime(0.9, audioContext.currentTime + 0.4);
                  mainGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);

                  console.log('🔔 Playing sophisticated message notification (3-tone ascending)');
              }
          } catch (error) {
              console.log('🔇 Web Audio playback failed:', error);
          }
      }

      // Try to initialize Web Audio API first
      if (initWebAudio()) {
          isAudioEnabled = true;
          return playWebAudio;
      } else {
          // Fallback to HTML5 Audio
          console.log('🔄 Falling back to HTML5 Audio...');
          return createHTML5Audio();
      }
  }

  // Add engagement cues
  function addEngagementCues() {
      const button = document.getElementById('nexus-widget-button');

      // Add click handler to enable audio (required by browser autoplay policies)
      button.addEventListener('click', () => {
          console.log('🔊 User interaction detected - audio should now be enabled');
      }, { once: true });

      // Initial attention cue after page load - MORE AGGRESSIVE
      setTimeout(() => {
          if (!hasInteracted && !isOpen) {
              console.log('🎯 Starting ENHANCED engagement cues sequence...');

              // Add intense glow with scaling
              if (config.enableGlow) {
                  button.classList.add('nexus-glowing');
                  console.log('✨ Enhanced glow effect added');
              }

              // Add urgent pulse animation
              if (config.enablePulse) {
                  button.classList.add('nexus-pulsing');
                  console.log('💓 Urgent pulse animation added');
              }

              // Add attention ring effect
              setTimeout(() => {
                  button.classList.add('nexus-attention-ring');
                  console.log('💫 Attention ring effect added');
              }, 200);

              // Play sophisticated message sound
              setTimeout(() => {
                  console.log('🔔 Attempting to play SOPHISTICATED notification sound...');
                  if (playNotificationSound) {
                      playNotificationSound();
                  } else {
                      console.log('🔇 No sound function available');
                  }
              }, 600); // Slightly delayed for better timing with visuals

              // Add enhanced notification dot
              setTimeout(() => {
                  addNotificationDot();
                  console.log('🔴 Enhanced notification dot added');
              }, 1200);
          }
      }, config.initialDelay);

      // Set up enhanced reminder system
      startReminderSystem();
  }

  // Add notification dot
  function addNotificationDot() {
      const button = document.getElementById('nexus-widget-button');
      const existingDot = button.querySelector('.nexus-notification-dot');

      if (!existingDot && !hasInteracted) {
          const dot = document.createElement('div');
          dot.className = 'nexus-notification-dot';
          button.appendChild(dot);
      }
  }

  // Remove notification dot
  function removeNotificationDot() {
      const button = document.getElementById('nexus-widget-button');
      const dot = button.querySelector('.nexus-notification-dot');
      if (dot) {
          dot.remove();
      }
  }

  // Start reminder system with enhanced effects
  function startReminderSystem() {
      reminderTimer = setInterval(() => {
          if (!hasInteracted && !isOpen && reminderCount < config.maxReminders) {
              const button = document.getElementById('nexus-widget-button');

              // Enhanced bounce animation with attention ring
              button.classList.add('nexus-bouncing');
              setTimeout(() => {
                  button.classList.remove('nexus-bouncing');
              }, 2400); // Longer for 3 bounces

              // Add attention ring for reminders
              button.classList.add('nexus-attention-ring');
              setTimeout(() => {
                  button.classList.remove('nexus-attention-ring');
              }, 2000);

              // Sophisticated sound reminder
              setTimeout(() => {
                  if (playNotificationSound) {
                      console.log('🔔 Playing reminder notification...');
                      playNotificationSound();
                  }
              }, 400);

              reminderCount++;

              // Add notification dot if not present
              setTimeout(() => {
                  addNotificationDot();
              }, 800);

          } else if (reminderCount >= config.maxReminders) {
              clearInterval(reminderTimer);
              console.log('🎯 Maximum reminders reached, stopping engagement cues');
          }
      }, config.reminderInterval);
  }

  // Clear all engagement cues
  function clearEngagementCues() {
      const button = document.getElementById('nexus-widget-button');
      if (button) {
          button.classList.remove('nexus-glowing', 'nexus-pulsing', 'nexus-bouncing', 'nexus-attention-ring');
          removeNotificationDot();
      }

      if (reminderTimer) {
          clearInterval(reminderTimer);
      }

      hasInteracted = true;
      console.log('🎯 All engagement cues cleared - user has interacted');
  }

  // Create widget HTML
  function createWidgetHTML() {
      const styleTag = document.createElement('style');
      styleTag.textContent = widgetStyles;
      styleTag.id = 'nexus-widget-styles';
      document.head.appendChild(styleTag);

      const widget = document.createElement('div');
      widget.id = 'nexus-widget-container';
      widget.innerHTML = `
          <div id="nexus-widget-button" class="nx-chat-button" style="
              ${config.position === 'bottom-right' ? 'bottom: 20px; right: 20px;' : 'bottom: 20px; left: 20px;'}
          ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
          </div>
          <div id="nexus-widget-chat" class="nx-chat nx-hidden" style="${config.position === 'bottom-right' ? 'right: var(--nx-space-4);' : 'left: var(--nx-space-4);'}">
              <div id="nexus-widget-resize-handle" class="nx-chat__resize-handle"></div>
              <div class="nx-chat__header">
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>NexusTours</span>
                  <button id="nexus-widget-close" style="margin-left:auto;background:none;border:none;color:#fff;cursor:pointer;font-size:1.25rem;line-height:1;">&times;</button>
              </div>
              <div class="nx-chat__body" id="nexus-widget-messages"></div>
              <div id="nexus-widget-end-chat-container" style="padding: 8px; text-align: center; background: var(--nx-gray-100);">
                  <button id="nexus-widget-end-chat" style="background: none; border: none; color: var(--nx-brand-red); cursor: pointer; font-size: 0.8rem; font-weight: bold;">End Chat</button>
              </div>
              <div class="nx-chat__input">
                  <textarea class="nx-chat__textarea" id="nexus-widget-message-input" placeholder="Type your message..."></textarea>
                  <button class="nx-chat__send" id="nexus-widget-send">
                      <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" fill="none"/></svg>
                  </button>
              </div>
          </div>
      `;

      // Inject required libraries for Markdown parsing and sanitization
      const markedScript = document.createElement('script');
      markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      document.head.appendChild(markedScript);

      const purifyScript = document.createElement('script');
      purifyScript.src = 'https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js';
      document.head.appendChild(purifyScript);

      document.body.appendChild(widget);
  }

  // Initialize widget
  function initWidget(customerConfig) {
      // Merge customer config with default config
      Object.assign(config, customerConfig);

      // Generate or retrieve device ID
      deviceId = localStorage.getItem('nexus_device_id') || generateDeviceId();
      localStorage.setItem('nexus_device_id', deviceId);

      // Create notification sound function
      playNotificationSound = createNotificationSound();

      // Create widget HTML
      createWidgetHTML();

      // Initialize messages container reference
      messagesContainer = document.getElementById('nexus-widget-messages');
      displayedMessages = new Set();

      // Set up event listeners
      const chatButton = document.getElementById('nexus-widget-button');
      const closeButton = document.getElementById('nexus-widget-close');
      const endChatButton = document.getElementById('nexus-widget-end-chat');
      const sendButton = document.getElementById('nexus-widget-send');
      const messageInput = document.getElementById('nexus-widget-message-input');

      chatButton.addEventListener('click', toggleWidget);
      closeButton.addEventListener('click', toggleWidget);
      endChatButton.addEventListener('click', endChat);
      sendButton.addEventListener('click', sendMessage);
      messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
          }
      });

      // Track interactions for engagement cues
      chatButton.addEventListener('mouseenter', () => {
          if (!hasInteracted) {
              clearEngagementCues();
          }
      });

      // Enable resizing and start engagement cues
      enableResizing();
      addEngagementCues();
  }

  async function endChat() {
      if (!threadId) {
          addMessageSafely('system', 'There is no active conversation to end.');
          return;
      }

      if (confirm('Are you sure you want to end this chat?')) {
          try {
              const response = await fetch(`${config.apiUrl}/threads/${threadId}/resolve`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
              });

              if (!response.ok) {
                  throw new Error('Failed to end the chat. Please try again.');
              }

              console.log('Chat successfully marked as resolved.');

          } catch (error) {
              console.error('Error ending chat:', error);
              addMessageSafely('system', error.message || 'An error occurred while trying to end the chat.');
          }
      }
  }

  // Toggle widget visibility
  function toggleWidget() {
      const chat = document.getElementById('nexus-widget-chat');
      const button = document.getElementById('nexus-widget-button');

      isOpen = !isOpen;

      // Clear engagement cues when opened
      if (isOpen) {
          clearEngagementCues();
      }

      if (isOpen) {
          chat.classList.remove('nx-hidden');
          chat.classList.add('nx-chat--open');
          button.style.display = 'none';

          // Initialize connection if not already done
          if (!threadId) {
              initializeSessionAndThread();
          }

          // Focus input when opened
          setTimeout(() => {
              document.getElementById('nexus-widget-message-input').focus();
          }, 300);
      } else {
          chat.classList.remove('nx-chat--open');

          setTimeout(() => {
              chat.classList.add('nx-hidden');
              button.style.display = 'flex';
          }, 300);
      }
  }

  function enableResizing() {
      const chatContainer = document.getElementById('nexus-widget-chat');
      const resizeHandle = document.getElementById('nexus-widget-resize-handle');

      if (!chatContainer || !resizeHandle) return;

      let initialWidth, initialHeight, initialX, initialY;

      const onMouseDown = (e) => {
          e.preventDefault();
          initialX = e.clientX;
          initialY = e.clientY;
          const rect = chatContainer.getBoundingClientRect();
          initialWidth = rect.width;
          initialHeight = rect.height;

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e) => {
          const dx = e.clientX - initialX;
          const dy = e.clientY - initialY;

          const newWidth = initialWidth - dx;
          const newHeight = initialHeight - dy;

          const style = window.getComputedStyle(chatContainer);
          const minWidth = parseFloat(style.minWidth);
          const minHeight = parseFloat(style.minHeight);
          const maxWidth = parseFloat(style.maxWidth);
          const maxHeight = parseFloat(style.maxHeight);

          if (newWidth >= minWidth && newWidth <= maxWidth) {
              chatContainer.style.width = newWidth + 'px';
          }
          if (newHeight >= minHeight && newHeight <= maxHeight) {
              chatContainer.style.height = newHeight + 'px';
          }
      };

      const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
      };

      resizeHandle.addEventListener('mousedown', onMouseDown);
  }

  async function initializeSessionAndThread() {
      try {
          const storedThreadId = localStorage.getItem('nexus_thread_id');
          if (storedThreadId) {
              threadId = storedThreadId;
              console.log('🔄 Using stored thread:', threadId);

              const success = await fetchAndRenderMessages(true);
              if (success) {
                  console.log('✅ Stored thread is valid, setting up connections');

                  if (messagesContainer && messagesContainer.children.length === 0) {
                      console.log('Thread is empty. Adding welcome message.');
                      addMessageSafely('assistant', 'Welcome to NexusTours! How can I assist you today?', null, 'msg_welcome');
                  }

                  setTimeout(() => {
                      connectWebSocket();
                  }, 500);

                  setTimeout(() => {
                      if (!socket || socket.readyState !== WebSocket.OPEN) {
                          console.log('🔄 WebSocket not connected, starting polling backup');
                          startPolling();
                      }
                  }, 3000);
                  return;
              } else {
                  console.log('❌ Stored thread is invalid, removing from storage');
                  localStorage.removeItem('nexus_thread_id');
                  threadId = null;
              }
          }

          console.log('🆕 Creating new session and thread...');

          const sessionResponse = await fetch(`${config.apiUrl}/users/identify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ device_id: deviceId })
          });

          if (!sessionResponse.ok) {
              const errorText = await sessionResponse.text();
              throw new Error(`Failed to create session: ${sessionResponse.status} - ${errorText}`);
          }

          const sessionData = await sessionResponse.json();
          sessionId = sessionData.session_id;
          console.log('✅ Session created:', sessionId);

          const threadResponse = await fetch(`${config.apiUrl}/threads`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ session_id: sessionId })
          });

          if (!threadResponse.ok) {
              const errorText = await threadResponse.text();
              throw new Error(`Failed to create thread: ${threadResponse.status} - ${errorText}`);
          }

          const threadData = await threadResponse.json();
          threadId = threadData.thread_id || threadData.id;

          if (threadId) {
              localStorage.setItem('nexus_thread_id', threadId);
              console.log('✅ New thread created:', threadId);
              addMessageSafely('assistant', 'Welcome to NexusTours! How can I assist you today?', null, 'msg_welcome');

              console.log('⏳ Waiting for server to process thread creation...');
              setTimeout(() => {
                  console.log('🔌 Attempting WebSocket connection to thread:', threadId);
                  connectWebSocket();
              }, 1000);

              setTimeout(() => {
                  if (!socket || socket.readyState !== WebSocket.OPEN) {
                      console.log('🔄 WebSocket not ready, starting polling backup');
                      startPolling();
                  }
              }, 4000);
          } else {
              throw new Error('Thread ID not received from server');
          }

      } catch (error) {
          console.error('💥 Nexus Widget Initialization Error:', error);
          console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              apiUrl: config.apiUrl,
              deviceId: deviceId
          });

          addMessageSafely('system', 'Sorry, we are unable to connect to customer support at the moment. Please try refreshing the page.');

          if (threadId) {
              console.log('🔄 Starting polling as fallback for thread:', threadId);
              startPolling();
          }
      }
  }

  /**
   * Parses Markdown text into safe HTML using marked.js and DOMPurify.
   */
  function parseMarkdown(text) {
      if (!text || typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
          return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      const dirtyHtml = marked.parse(text, { gfm: true, breaks: true });
      const cleanHtml = DOMPurify.sanitize(dirtyHtml);
      return cleanHtml;
  }

  // Update addMessageSafely to handle markdown
  function addMessageSafely(role, content, timestamp, messageId) {
      if (!messagesContainer) {
          messagesContainer = document.getElementById('nexus-widget-messages');
      }

      if (!displayedMessages) {
          displayedMessages = new Set();
      }

      const idStr = messageId !== undefined && messageId !== null ? String(messageId) : null;

      // Skip if already displayed
      if (idStr && displayedMessages.has(idStr)) {
          console.log('Message already displayed, skipping:', idStr);
          return false;
      }

      // For temporary messages, check if similar content exists
      if (idStr && idStr.startsWith('temp_')) {
          const existingMessages = messagesContainer.querySelectorAll('.nx-msg');
          for (let msg of existingMessages) {
              if (msg.textContent.includes(content) && msg.dataset.messageId !== idStr) {
                  console.log('Similar message found, skipping temp:', idStr);
                  return false;
              }
          }
      }

      // Mark as displayed
      if (idStr) {
          displayedMessages.add(idStr);
      }

      // Create message element
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('nx-msg');
      if (role === 'user' || role === 'customer') {
          messageDiv.classList.add('nx-msg--user');
      } else if (role === 'system') {
          messageDiv.classList.add('nx-msg--system');
      } else {
          messageDiv.classList.add('nx-msg--agent');
      }
      if (idStr) messageDiv.dataset.messageId = idStr;

      // Parse markdown and set content
      const parsedContent = parseMarkdown(content);
      messageDiv.innerHTML = parsedContent;

      // Add timestamp if available
      if (timestamp) {
          const timeElement = document.createElement('span');
          timeElement.className = 'nx-msg__meta';
          try {
              let date;
              if (typeof timestamp === 'string' && !timestamp.toLowerCase().endsWith('z') && !/[+-]\d{2}(:?\d{2})?$/.test(timestamp)) {
                  const isoTimestamp = timestamp.trim().replace(' ', 'T') + 'Z';
                  date = new Date(isoTimestamp);
              } else {
                  date = new Date(timestamp);
              }

              if (!isNaN(date.getTime())) {
                  timeElement.textContent = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  });
              } else {
                   console.error('Invalid date created from timestamp:', timestamp);
              }
          } catch (e) {
              console.error('Error formatting timestamp:', e, timestamp);
          }
          messageDiv.appendChild(timeElement);
      }

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return true;
  }

  // Remove temporary message when real message arrives
  function removeTempMessage(content, senderType) {
      if (!messagesContainer) {
          messagesContainer = document.getElementById('nexus-widget-messages');
      }
      if (!displayedMessages) {
          displayedMessages = new Set();
      }

      const tempMessages = messagesContainer.querySelectorAll('[data-message-id^="temp_"]');
      tempMessages.forEach(tempMsg => {
          if (tempMsg.textContent.includes(content) && senderType === 'customer') {
              const tempId = tempMsg.dataset.messageId;
              displayedMessages.delete(tempId);
              tempMsg.remove();
              console.log('Removed temporary message:', tempId);
          }
      });
  }

  function handleClosedConversation() {
      localStorage.removeItem('nexus_thread_id');
      threadId = null;
      cleanupConnections();

      const messageInput = document.getElementById('nexus-widget-message-input');
      if (messageInput) {
          messageInput.disabled = true;
          messageInput.placeholder = 'This conversation is closed.';
      }
      const sendButton = document.getElementById('nexus-widget-send');
      if (sendButton) sendButton.disabled = true;

      const endChatContainer = document.getElementById('nexus-widget-end-chat-container');
      if (endChatContainer) {
          endChatContainer.style.display = 'none';
      }

      console.log('Conversation closed. Input disabled, history preserved until page reload.');
  }

  async function fetchAndRenderMessages(suppressErrorOnUI = false) {
      if (!threadId) {
          console.log('❌ Cannot fetch messages: no threadId');
          return false;
      }

      try {
          const url = `${config.apiUrl}/threads/${threadId}/messages`;
          console.log('📡 Fetching messages from:', url);

          const response = await fetch(url);

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to fetch messages: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          console.log('📥 Messages fetched:', {
              messageCount: data.messages ? data.messages.length : 0,
              threadId: threadId,
              hasMessages: data.messages && Array.isArray(data.messages),
              threadStatus: data.thread_status
          });

          if (data.thread_status === 'closed') {
              console.log('🔒 Thread is closed, starting graceful shutdown of conversation.');
              handleClosedConversation();
              return false;
          }

          if (data.messages && Array.isArray(data.messages)) {
              renderMessages(data.messages);
              return true;
          }

          console.log('⚠️ No messages array in response:', data);
          return false;

      } catch (error) {
          console.error('💥 Error fetching messages:', {
              error: error,
              message: error.message,
              threadId: threadId,
              apiUrl: config.apiUrl,
              suppressErrorOnUI: suppressErrorOnUI
          });

          if (!suppressErrorOnUI) {
              addMessageSafely('system', 'Could not load conversation history.');
          }
          return false;
      }
  }

  function renderMessages(messages) {
      let hasNewMessages = false;

      messages.forEach(msg => {
          if (msg.sender_type === 'customer') {
              removeTempMessage(msg.content, msg.sender_type);
          }

          const added = addMessageSafely(msg.sender_type, msg.content, msg.created_at, msg.id);
          if (added) {
              hasNewMessages = true;
          }
      });

      if (hasNewMessages) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
  }

  function connectWebSocket() {
      if (!threadId || !isWebSocketEnabled) {
          console.log('❌ Cannot connect WebSocket:', { threadId, isWebSocketEnabled });
          return;
      }

      if (socket) {
          console.log('🧹 Cleaning up existing WebSocket connection');
          socket.onclose = null;
          socket.close();
          socket = null;
      }

      if (wsReconnectTimer) {
          clearTimeout(wsReconnectTimer);
          wsReconnectTimer = null;
      }

      try {
          const apiUrl = new URL(config.apiUrl);
          const wsProtocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = `${wsProtocol}//${apiUrl.host}/ws/${threadId}`;

          console.log(`🔌 Connecting WebSocket (attempt ${wsReconnectAttempts + 1}):`, {
              url: wsUrl,
              threadId: threadId,
              protocol: wsProtocol,
              host: apiUrl.host,
              apiUrl: config.apiUrl
          });

          socket = new WebSocket(wsUrl);

          const connectionTimeout = setTimeout(() => {
              if (socket && socket.readyState === WebSocket.CONNECTING) {
                  console.log('⏰ WebSocket connection timeout after 15 seconds');
                  socket.close();
                  handleWebSocketReconnect();
              }
          }, 15000);

          socket.onopen = () => {
              clearTimeout(connectionTimeout);
              console.log('✅ WebSocket connected successfully to thread:', threadId);
              stopPolling();
              console.log('🔗 WebSocket state:', {
                  readyState: socket.readyState,
                  url: socket.url,
                  protocol: socket.protocol
              });
              wsReconnectAttempts = 0;

              try {
                  socket.send(JSON.stringify({
                      type: 'connect',
                      thread_id: threadId,
                      timestamp: new Date().toISOString()
                  }));
                  console.log('📤 Sent connection confirmation');
              } catch (e) {
                  console.error('❌ Error sending connection confirmation:', e);
              }

              startHeartbeat();
          };

          socket.onclose = (event) => {
              clearTimeout(connectionTimeout);
              stopHeartbeat();
              console.log(`❌ WebSocket disconnected:`, {
                  code: event.code,
                  reason: event.reason,
                  wasClean: event.wasClean,
                  threadId: threadId
              });

              if (event.code !== 1000 && event.code !== 1001) {
                  handleWebSocketReconnect();
              }
          };

          socket.onerror = (error) => {
              clearTimeout(connectionTimeout);
              console.error('💥 WebSocket error:', {
                  error: error,
                  threadId: threadId,
                  url: socket ? socket.url : 'unknown',
                  readyState: socket ? socket.readyState : 'unknown'
              });
              stopHeartbeat();
          };

          socket.onmessage = (event) => {
              console.log('📨 WebSocket message received:', {
                  data: event.data,
                  threadId: threadId,
                  timestamp: new Date().toISOString()
              });

              try {
                  const msg = JSON.parse(event.data);

                  if (msg.type === 'pong') {
                      console.log('💓 Heartbeat pong received');
                      return;
                  }

                  if (msg.type === 'thread_status_update' && msg.status === 'closed') {
                      console.log('🔒 Thread closed via WebSocket. Starting graceful shutdown.');
                      handleClosedConversation();
                      return;
                  }

                  if (msg.id && msg.content) {
                      if (msg.sender_type === 'customer' || msg.sender_type === 'user') {
                          removeTempMessage(msg.content, msg.sender_type);
                      }
                      console.log('✨ Adding message via WebSocket:', msg);
                      addMessageSafely(msg.sender_type, msg.content, msg.created_at, msg.id);
                  } else {
                      console.log('📝 WebSocket message without ID/content:', msg);
                  }
              } catch (e) {
                  console.error('❌ Error parsing WebSocket message:', {
                      error: e,
                      data: event.data,
                      threadId: threadId
                  });
              }
          };

      } catch (error) {
          console.error('❌ Error creating WebSocket connection:', {
              error: error,
              message: error.message,
              stack: error.stack,
              threadId: threadId,
              apiUrl: config.apiUrl
          });
          handleWebSocketReconnect();
      }
  }

  async function sendMessage() {
      const input = document.getElementById('nexus-widget-message-input');
      const content = input.value.trim();
      if (!content) return;

      // Clear engagement cues on first message
      if (!hasInteracted) {
          clearEngagementCues();
      }

      let tempMessageId;

      try {
          if (!threadId) {
              console.log('✉️ No thread found, creating a new one...');
              await initializeSessionAndThread();

              if (!threadId) {
                  throw new Error("Failed to create a new session. Please refresh.");
              }
              console.log('✅ New thread created by sendMessage, proceeding to send message.');
          }

          tempMessageId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          const timestamp = new Date().toISOString();

          addMessageSafely('customer', content, timestamp, tempMessageId);
          input.value = '';
          input.placeholder = 'Type your message...';

          const response = await fetch(`${config.apiUrl}/threads/${threadId}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ content: content })
          });

          if (!response.ok) throw new Error(`Message send failed: ${response.status}`);

          console.log('Message sent successfully to thread:', threadId);

      } catch (error) {
          console.error('Error sending message:', error);
          addMessageSafely('assistant', error.message || 'Failed to send message.');

          // Remove temporary message on error
          if (tempMessageId) {
              const tempMessageElement = document.querySelector(`[data-message-id="${tempMessageId}"]`);
              if (tempMessageElement) {
                  displayedMessages.delete(tempMessageId);
                  tempMessageElement.remove();
              }
          }
      }
  }

  // Legacy function for backward compatibility
  function addMessageToUI(role, content, timestamp, messageId) {
      return addMessageSafely(role, content, timestamp, messageId);
  }

  // Expose the widget to the global scope
  window.ChatbotNexusWidget = {
      init: function(config) {
          const defaultConfig = {
              apiUrl: 'http://localhost:5000/api',
              companyName: 'NexusTours',
              primaryColor: '#E73A4E',
              textColor: '#FFFFFF',
              position: 'bottom-right',
              enableGlow: true,
              enableSound: true,
              enablePulse: true,
              initialDelay: 3000,
              reminderInterval: 45000,
              maxReminders: 3
          };

          const mergedConfig = { ...defaultConfig, ...config };
          initWidget(mergedConfig);
      },
      // Allow customers to control engagement features
      enableEngagement: function(enabled) {
          config.enableGlow = enabled;
          config.enableSound = enabled;
          config.enablePulse = enabled;
      },
      clearCues: clearEngagementCues,
      // Add debug method for audio testing
      testAudio: function() {
          console.log('🔊 Testing audio manually...');
          console.log('Audio config enabled:', config.enableSound);
          console.log('Audio function available:', !!playNotificationSound);
          if (playNotificationSound) {
              playNotificationSound();
              console.log('🔔 Audio test function called');
          } else {
              console.log('🔇 No audio function to test');
          }
      }
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
      console.log('🧹 Cleaning up widget connections');
      cleanupConnections();
      clearEngagementCues();
  });

  // Cleanup on page visibility change (mobile browsers)
  document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
          console.log('🔇 Page hidden, pausing connections');
          stopHeartbeat();
      } else {
          console.log('👁️ Page visible, resuming connections');
          if (typeof socket !== 'undefined' && socket && socket.readyState === WebSocket.OPEN) {
              startHeartbeat();
          } else if (threadId) {
              connectWebSocket();
          }
      }
  });

  function handleWebSocketReconnect() {
      if (!isWebSocketEnabled || wsReconnectAttempts >= maxReconnectAttempts) {
          console.log('❌ WebSocket max reconnection attempts reached, falling back to polling');
          isWebSocketEnabled = false;
          socket = null;

          if (!pollingTimer) {
              startPolling();
          }
          return;
      }

      wsReconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts), 30000);

      console.log(`🔄 Attempting WebSocket reconnection in ${delay}ms (attempt ${wsReconnectAttempts}/${maxReconnectAttempts})`);

      wsReconnectTimer = setTimeout(() => {
          connectWebSocket();
      }, delay);
  }

  function startHeartbeat() {
      stopHeartbeat();

      heartbeatInterval = setInterval(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
              try {
                  socket.send(JSON.stringify({ type: 'ping' }));
                  console.log('💓 Heartbeat ping sent');
              } catch (error) {
                  console.error('❌ Error sending heartbeat:', error);
                  stopHeartbeat();
              }
          } else {
              stopHeartbeat();
          }
      }, 30000);
  }

  function stopHeartbeat() {
      if (typeof heartbeatInterval !== 'undefined' && heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
      }
  }

  function startPolling() {
      stopPolling();

      if (!threadId) {
          console.log('❌ Cannot start polling: no threadId');
          return;
      }

      console.log(`🔄 Starting polling for thread ${threadId} every ${config.pollingInterval}ms`);
      pollingTimer = setInterval(() => {
          console.log('📊 Polling for new messages...', {
              threadId: threadId,
              timestamp: new Date().toISOString(),
              socketState: socket ? socket.readyState : 'no socket'
          });
          fetchAndRenderMessages(true);
      }, config.pollingInterval);
  }

  function stopPolling() {
      if (pollingTimer) {
          console.log('⏹️ Stopping polling');
          clearInterval(pollingTimer);
          pollingTimer = null;
      }
  }

  function cleanupConnections() {
      if (socket) {
          socket.onclose = null;
          socket.close();
          socket = null;
      }

      if (wsReconnectTimer) {
          clearTimeout(wsReconnectTimer);
          wsReconnectTimer = null;
      }

      stopHeartbeat();
      stopPolling();
  }
})();
