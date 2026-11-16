import type { Href } from 'expo-router';

/**
 * Contenido estático de las páginas informativas. Agregar una página = agregar
 * una entrada aquí; las pantallas no cambian (abierto/cerrado).
 *
 * IMPORTANTE: los textos legales son un borrador que describe cómo funciona la
 * app hoy. Deben ser revisados por asesoría legal antes de publicar en tiendas
 * (Ley 19.628 / Ley 21.719 en Chile, GDPR si aplica) y completar el canal de contacto.
 */

export interface InfoSection {
  heading: string;
  paragraphs: string[];
}

export interface DocumentPage {
  kind: 'document';
  title: string;
  /** Fecha visible de la última actualización del texto. */
  updated?: string;
  intro?: string;
  sections: InfoSection[];
}

export interface FaqPage {
  kind: 'faq';
  title: string;
  intro?: string;
  items: { question: string; answer: string }[];
}

export type InfoPage = DocumentPage | FaqPage;

const pages = {
  privacy: {
    kind: 'document',
    title: 'Política de privacidad',
    updated: '15 de noviembre de 2026',
    intro: 'En Lunchy tratamos tus datos con el mínimo necesario para que la app funcione. Aquí explicamos qué guardamos, para qué y cómo puedes controlarlo.',
    sections: [
      {
        heading: 'Qué datos guardamos',
        paragraphs: [
          'Datos de cuenta: nombre, correo y una contraseña que se almacena cifrada de forma irreversible (nunca en texto plano).',
          'Datos de uso: recetas, menús, rutinas y el avance que registras cada día.',
          'Datos personales opcionales: peso, estatura y edad. Son datos sensibles; sólo se guardan si tú los ingresas y puedes borrarlos cuando quieras.',
        ],
      },
      {
        heading: 'Para qué los usamos',
        paragraphs: [
          'Para mostrarte tu plan de comidas y entrenamiento, y calcular información nutricional.',
          'No vendemos tus datos ni los usamos para publicidad. No compartimos tus datos personales con otros usuarios: sólo se comparte lo que tú decides compartir (recetas o rutinas) con tus conexiones.',
        ],
      },
      {
        heading: 'Cómo los protegemos',
        paragraphs: [
          'La comunicación con nuestros servidores es cifrada (HTTPS). En tu teléfono, la sesión se guarda en el almacenamiento seguro del sistema y se elimina al cerrar sesión.',
          'Cada solicitud se valida en el servidor: nadie puede leer ni modificar datos de otra cuenta.',
        ],
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          'Puedes acceder, rectificar y eliminar tus datos personales desde la app (Menú › Datos personales). También puedes solicitar la eliminación completa de tu cuenta y la portabilidad de tus datos a través de los canales oficiales de Brams Tech.',
        ],
      },
    ],
  },
  terms: {
    kind: 'document',
    title: 'Términos y condiciones',
    updated: '15 de noviembre de 2026',
    sections: [
      {
        heading: 'Uso de la app',
        paragraphs: [
          'Lunchy es una herramienta de organización de alimentación y entrenamiento. La información nutricional es referencial y no reemplaza la indicación de un profesional de la salud.',
          'Si tienes una condición médica, consulta a un profesional antes de cambiar tu alimentación o rutina de ejercicio.',
        ],
      },
      {
        heading: 'Tu cuenta',
        paragraphs: [
          'Eres responsable de mantener tu contraseña en reserva. Debes tener al menos 14 años para crear una cuenta.',
          'El contenido que compartes con otras personas (recetas, rutinas, propuestas al catálogo) debe ser respetuoso y no infringir derechos de terceros.',
        ],
      },
      {
        heading: 'Cambios',
        paragraphs: ['Si estos términos cambian de forma relevante, te avisaremos dentro de la app antes de que entren en vigencia.'],
      },
    ],
  },
  about: {
    kind: 'document',
    title: 'Quiénes somos',
    intro: 'Lunchy es desarrollada por Brams Tech.',
    sections: [
      {
        heading: 'Brams Tech',
        paragraphs: [
          'Somos un equipo que diseña y desarrolla productos digitales con foco en la experiencia de uso, la calidad del software y la seguridad de la información.',
        ],
      },
      {
        heading: 'Nuestra misión con Lunchy',
        paragraphs: [
          'Ayudarte a comer mejor y entrenar con constancia, con un plan simple de seguir: qué comer hoy, cuándo entrenar y cómo vas avanzando.',
        ],
      },
      {
        heading: 'Cómo trabajamos',
        paragraphs: [
          'Privacidad desde el diseño: pedimos sólo los datos necesarios y te damos control sobre ellos.',
          'Accesible y multiplataforma: la misma experiencia en iOS, Android y web, con modo claro y oscuro.',
        ],
      },
    ],
  },
  faq: {
    kind: 'faq',
    title: 'Preguntas frecuentes',
    items: [
      {
        question: '¿Cómo cambio entre modo claro y oscuro?',
        answer: 'Abre el menú lateral (ícono ☰ arriba a la izquierda) y elige Sistema, Claro u Oscuro en "Apariencia". "Sistema" sigue el ajuste de tu teléfono.',
      },
      {
        question: '¿Para qué sirven mi peso, estatura y edad?',
        answer: 'Son opcionales y sirven para personalizar tus objetivos. Sólo tú puedes verlos y puedes borrarlos cuando quieras desde Menú › Datos personales.',
      },
      {
        question: '¿Cómo comparto una receta o rutina?',
        answer: 'Primero conecta con la otra persona en Comunidad usando su código de invitación. Luego, desde la receta o rutina, toca Compartir y elige a quién.',
      },
      {
        question: '¿Qué pasa si elimino una conexión?',
        answer: 'Dejan de ver lo que se compartieron. Las copias que cada uno guardó en su espacio se conservan.',
      },
      {
        question: 'Falta un ingrediente o ejercicio, ¿qué hago?',
        answer: 'Desde tu perfil toca "Proponer al catálogo". El equipo revisará tu propuesta y, si se aprueba, quedará disponible para todos.',
      },
      {
        question: 'Olvidé mi contraseña',
        answer: 'En la pantalla de inicio de sesión toca "¿Olvidaste tu contraseña?" e ingresa tu correo. Si existe una cuenta, recibirás las instrucciones.',
      },
    ],
  },
} as const satisfies Record<string, InfoPage>;

export type InfoPageId = keyof typeof pages;

/** Enlace tipado a una página: sólo acepta ids existentes. */
export const infoHref = (page: InfoPageId): Href => ({ pathname: '/info/[page]', params: { page } });

/** Valida un parámetro de ruta (dato no confiable) contra la lista de páginas existentes. */
export function getInfoPage(id: unknown): InfoPage | null {
  return typeof id === 'string' && Object.hasOwn(pages, id) ? pages[id as InfoPageId] : null;
}
