/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Escanea archivos Angular
    "./node_modules/flowbite/**/*.js", // Agrega Flowbite
  ],
  theme: {
    fontSize: {
      xs: "0.8rem",
      sm: "0.875rem",
      base: "1rem",
      xl: "1.25rem",
      lg: "1.125rem",
      "2xl": "1.5rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    screens: {
      //Responsive breakpoints default can be change
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        "type-default" : "var(--typeDefault)",
      },
      keyframes: {},
      animation: {},
      colors: {
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "tertiary":"var(--tertiary)",
        "text-title": "var(--textTitle)",
        "text-label-01": "var(--textLabel01)",
        "text-label-02": "var(--textLabel02)",
        "text-label-03": "var(--textLabel03)",
        "text-paragraph-01": "var(--textParagraph01)",
        "text-paragraph-02": "var(--textParagraph02)",
        "text-placeholder": "var(--textPlaceholder)",
        "text-input-01": "var(--textInput01)",
        "text-input-02": "var(--textInput02)",
        "text-input-03": "var(--textInput03)",
        "text-primary-button": "var(--textPrimaryButton)",
        "text-secondary-button": "var(--textSecondaryButton)",
        "text-language-button-01": "var(--textLanguageButton01)",
        "text-language-button-02": "var(--textLanguageButton02)",
        "text-link-button": "var(--textLinkButton)",
        "success-stepper": "var(--ColorSuccessStepper)",
        "primary-stepper": "var(--ColorPrimaryStepper)",
        "text-greetings-01":"var(--textGreetings01)",
        "text-greetings-02":"var(--textGreetings02)",
        "text-tab-button":"var(--textTabButton)",
        "text-input-search":"var(--textInputSearch)",
        "text-input-list":"var(--textInputList)",
        "text-flight-airport":"var(--textFlightAirport)",
        "text-time-button":"var(--textTimeButton)",
        "color-time-button":"var(--ColorTimeButton)",
        "black":"var(--black)",
        "white":"var(--white)",
        "red-alert":"#E73A4E",
        "gray-stepper":"#8F8F8F",
        "gray-borders": "#D6D6D6",
        "gray-borders-tooltips": "#DADADA",
        "bg-color-gray-tooltip":"#EBEBEB",
        "gray-icon-x":"#878787",
        "gray-icon-x-hover":"#333333",
        "gray-icon-arrow-airport": "#BEBEBE",
        "text-info-flight-tooltip":"#636363",
        "icon-chat-button":"var(--iconChatButton)",
      },
      backgroundImage: {
        "bg-image-01": "var(--backgroundImage01)",//This value Come from Contenful
        "bg-image-02": "var(--backgroundImage02)",//This value Come from Contenful
        "bg-image-03": "var(--backgroundImage03)",//This value Come from Contenful
        "bg-image-04": "var(--backgroundImage04)",//This value Come from Contenful
        "bg-image-05": "var(--backgroundImage05)",//This value Come from Contenful
        "bg-image-graphic-element-01": "var(--backgroundImageGraphicElement01)",//This value Come from Contenful
        "bg-image-graphic-element-02": "var(--backgroundImageGraphicElement02)",//This value Come from Contenful
        "bg-image-graphic-element-03": "var(--backgroundImageGraphicElement03)",//This value Come from Contenful
        "bg-image-graphic-element-04": "var(--backgroundImageGraphicElement04)",//This value Come from Contenful
        "bg-image-logo": "var(--backgroundImageLogo)",//This value Come from Contenful
        "bg-image-qr":"var(--backgroundImageQr)",//This value Come from Contenful
        "bg-image-logos-group-desktop":"var(--backgroundImageLogoGroupDesktop)",//This value Come from Contenful
        "bg-image-logos-group-mobile":"var(--backgroundImageLogoGroupMobile)",//This value Come from Contenful
      },
      width: {
        "stepper-circle-width":"37px",
      },
      height: {
        "stepper-circle-height":"37px",
      }
    },
  },
  plugins: [
    require("flowbite/plugin"), // Importa el plugin de Flowbite
  ],
};
