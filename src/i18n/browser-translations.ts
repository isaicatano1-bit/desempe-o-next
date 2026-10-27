export type BrowserLocale = 'es' | 'en';

const translations: Record<string, string> = {
  'Por horas. Sin permanencia.': 'By the hour. No commitment.',
  'Haz espacio para tus ideas.': 'Make room for your ideas.',
  'Un buen lugar para trabajar. Solo las horas que necesitas.': 'A great place to work. Only for the hours you need.',
  'Tu espacio, solo el tiempo que necesitas. Reserva por horas, en bloques de 30 minutos.': 'Your space, only for as long as you need it. Book by the hour in 30-minute blocks.',
  'Sala de coworking luminosa con mesas y plantas': 'Bright coworking room with tables and plants',
  'Disponible ahora': 'Available now', Tipos: 'Types', 'Elige tu formato ideal': 'Choose your ideal space',
  Seleccionado: 'Selected', 'Ver disponibilidad': 'Check availability', 'Selección actual': 'Current selection',
  'Ideal para reuniones rápidas, sesiones de trabajo profundo o encuentros con clientes, con disponibilidad por horas y equipamiento listo para usar.': 'Ideal for quick meetings, focused work sessions, or meeting clients, with hourly availability and ready-to-use equipment.',
  'Explorar ': 'Explore ', Recomendado: 'Recommended', 'Espacios para empezar hoy': 'Spaces to get started today',
  'Ver todos los espacios': 'See all spaces', 'Cargando espacios disponibles...': 'Loading available spaces...',
  'No hay espacios disponibles en este momento.': 'No spaces are available right now.', 'Cómo funciona': 'How it works',
  'No hay espacios disponibles en la base de datos.': 'No spaces are available in the database.',
  'Reserva en tres pasos': 'Book in three steps', 'Elige el espacio y las horas': 'Choose a space and time',
  'Busca por ciudad, horario y tipo de espacio que mejor encaje.': 'Search by city, schedule, and the space type that suits you best.',
  'Reserva en segundos': 'Book in seconds', 'Confirma la disponibilidad y bloquea tu horario en pocos clics.': 'Check availability and reserve your time in just a few clicks.',
  'Llega y trabaja': 'Arrive and get to work', 'Disfruta de la sala, el Wi‑Fi y la atmósfera que te ayuda a crear.': 'Enjoy the space, Wi-Fi, and an atmosphere that helps you create.',
  Beneficios: 'Benefits', 'Todo para trabajar mejor': 'Everything you need to work better',
  'Paga solo lo que usas': 'Pay only for what you use', 'Bloques por horas, sin permanencia ni tratos largos.': 'Hourly bookings, with no commitment or long contracts.',
  'Bloques de 30 minutos': '30-minute slots', 'Ajusta la reserva a la duración exacta de tu sesión.': 'Set your booking to the exact length of your session.',
  'Wifi, café y más incluidos': 'Wi-Fi, coffee, and more included', 'Todo lo necesario para trabajar de forma cómoda y sin fricciones.': 'Everything you need to work comfortably and without hassle.',
  'Cancela fácilmente': 'Easy cancellations', 'Modifica o anula la reserva con la flexibilidad que necesitas.': 'Change or cancel your booking with the flexibility you need.',
  Sedes: 'Locations', 'Descubre ciudades cercanas': 'Explore nearby cities', 'Sede seleccionada': 'Selected location',
  'Seleccionada': 'Selected', 'Ver fechas disponibles': 'See available dates',
  'Conectamos espacios de trabajo, concentración y reuniones en ': 'Find work, focus, and meeting spaces in ',
  ' para que puedas reservar un entorno que se adapte a la intensidad de tu jornada.': ' and book a space that fits your day.',
  'Ver espacios en ': 'See spaces in ', 'Sede de CoSpace en ': 'CoSpace location in ', 'Siguiente reserva': 'Next booking',
  'Tu próxima reunión, aquí.': 'Your next meeting starts here.', 'Ciudad o sede': 'City or location', Fecha: 'Date',
  Inicio: 'Start', Fin: 'End', 'Tipo de espacio': 'Space type', Personas: 'People', Buscar: 'Search',
  'Buscar espacios': 'Search spaces', Aplicar: 'Apply', Filtros: 'Filters', 'Limpiar filtros': 'Clear filters',
  Disponibilidad: 'Availability',
  'Encuentra tu entorno ideal para concentrarte, reunirte o crear sin fricción.': 'Find the ideal space to focus, meet, or create without hassle.',
  'Zona de búsqueda': 'Search area', 'Ver más espacios': 'See more spaces', Catálogo: 'Catalogue',
  'Explorar espacios': 'Explore spaces', ' espacios en Madrid': ' spaces in Madrid', Formato: 'Format',
  'Sala de reuniones': 'Meeting room', 'Escritorio dedicado': 'Dedicated desk', 'Oficina privada': 'Private office',
  'Cabina telefónica': 'Phone booth', 'Puesto individual': 'Individual desk',
  Reservar: 'Book', 'Reservar ahora': 'Book now', 'Cancelar reserva': 'Cancel booking', Cancelar: 'Cancel',
  'Quitar de favoritos': 'Remove from favorites', 'Añadir a favoritos': 'Add to favorites', reseñas: 'reviews',
  'Las fechas seleccionadas no son válidas.': 'The selected dates are invalid.',
  'La reserva no puede ser más de 30 días en el futuro.': 'Bookings cannot be made more than 30 days in advance.',
  'Selecciona la hora de inicio y fin.': 'Select a start and end time.',
  'La reserva debe durar entre 1 y 4 horas completas.': 'Bookings must last between 1 and 4 full hours.',
  'La reserva debe estar entre las 07:00 y las 21:00.': 'Bookings must be between 07:00 and 21:00.',
  'No se pudo crear la reserva.': 'Could not create the booking.',
  'Reglas: 1-4 horas, horario 07:00-21:00, máx. 30 días, sin solapamientos y máximo 3 reservas futuras.': 'Rules: 1–4 hours, 07:00–21:00, up to 30 days ahead, no overlaps, and up to 3 future bookings.',
  'Tu próxima reserva': 'Your next booking', 'Inicia sesión para ver tu próxima reserva.': 'Log in to see your next booking.',
  'Todavía no tienes reservas activas.': 'You do not have any active bookings yet.', 'No se pudo cargar tu próxima reserva.': 'Could not load your next booking.',
  'Crear tu cuenta': 'Create your account', 'Inicia sesión': 'Log in', 'Introduce un email válido.': 'Enter a valid email address.',
  'La contraseña es obligatoria.': 'Password is required.', 'La contraseña debe tener al menos 8 caracteres.': 'Password must be at least 8 characters.',
  'El nombre debe tener al menos 2 caracteres.': 'Name must be at least 2 characters.',
  'Reserva espacios en minutos y gestiona tus reuniones con total claridad.': 'Book a space in minutes and manage your meetings with ease.',
  'Accede a tus reservas, favoritos y horarios guardados.': 'Access your bookings, favorites, and saved schedules.',
  'No se pudo completar la operación.': 'Could not complete the request.', 'Ha ocurrido un error inesperado. Inténtalo de nuevo.': 'Something went wrong. Please try again.',
  'Contraseña': 'Password', 'Mínimo 8 caracteres': 'At least 8 characters', 'Ocultar contraseña': 'Hide password',
  'Mostrar contraseña': 'Show password', 'Crear cuenta': 'Create account', 'Iniciar sesión': 'Log in',
  'Cambiar idioma a inglés': 'Switch language to English', 'Cambiar idioma a español': 'Switch language to Spanish',
  'Nombre completo': 'Full name', Nombre: 'Name', '¿Ya tienes una cuenta?': 'Already have an account?', '¿No tienes una cuenta?': 'Need an account?',
  '¿Ya tienes cuenta?': 'Already have an account?', '¿No tienes cuenta?': 'Need an account?',
  'Olvidaste tu contraseña?': 'Forgot your password?', 'Bienvenido de nuevo': 'Welcome back',
  Panel: 'Dashboard', Administración: 'Administration', 'Cerrar sesión': 'Log out', 'Mi cuenta': 'My account',
  Perfil: 'Profile', 'Mis reservas': 'My bookings', Favoritos: 'Favorites', Historial: 'History',
  'Próxima reserva': 'Next booking', 'Panel de administración': 'Admin dashboard', Ayuda: 'Help', Privacidad: 'Privacy', Condiciones: 'Terms',
  'Gestiona la disponibilidad y la operación del espacio con una vista centralizada de reservas y equipos.': 'Manage space availability and operations from a central view of bookings and locations.',
  Operación: 'Operations', 'Controla el catálogo y la disponibilidad de espacios.': 'Manage the space catalogue and availability.',
  'Espacios activos': 'Active spaces', 'Disponibles para reservas': 'Available to book', 'Ingresos del día': 'Today’s revenue',
  'Facturación estimada': 'Estimated revenue',
  'Cargando reservas...': 'Loading bookings...', 'No se pudieron cargar tus reservas.': 'Could not load your bookings.',
  'No se pudo cancelar la reserva.': 'Could not cancel the booking.', 'Reservar otro espacio': 'Book another space',
  'Historial y próximas': 'Past and upcoming', 'Mi dashboard': 'My dashboard',
  'Reservas activas': 'Active bookings', 'Totales registradas para tu cuenta': 'Total bookings on your account',
  'Gasto total': 'Total spend', 'En tus reservas actuales': 'Across your current bookings',
  'Sin reservas': 'No bookings', 'No tienes reservas en curso': 'You have no current bookings',
  Todas: 'All', Activas: 'Active', Pasadas: 'Past', Canceladas: 'Cancelled',
  'Tu reserva se canceló correctamente.': 'Your booking was cancelled successfully.', 'Ver detalle': 'View details',
  Importe: 'Amount', Cuenta: 'Account', 'Horario:': 'Schedule:',
  'Mostrando 3 de 12 espacios': 'Showing 3 of 12 spaces',
  'Protección de cuenta': 'Account security', 'Métodos de pago': 'Payment methods',
  'Configuración gestionada por tu cuenta': 'Manage settings in your account', 'Espacio': 'Space', Usuario: 'User',
  'Hasta ': 'Up to ', ' personas': ' people', 'Estado': 'Status', 'Guardar cambios': 'Save changes', 'Guardando...': 'Saving...',
  'Listado': 'List', 'Listado global': 'All bookings', Tipo: 'Type', Capacidad: 'Capacity',
  Precio: 'Price', Acciones: 'Actions', Editar: 'Edit', Eliminar: 'Delete', Activar: 'Activate', Desactivar: 'Deactivate',
  'Todavía no hay espacios creados.': 'No spaces have been created yet.', 'No hay reservas registradas.': 'No bookings found.',
  'Facturación total:': 'Total revenue:', 'Editar reserva': 'Edit booking', Horario: 'Schedule', Total: 'Total',
  'Reserva actualizada correctamente.': 'Booking updated successfully.', 'Reserva cancelada correctamente.': 'Booking cancelled successfully.',
  'Reserva eliminada correctamente.': 'Booking deleted successfully.', '¿Seguro que quieres eliminar esta reserva?': 'Are you sure you want to delete this booking?',
  'Confirmada': 'Confirmed', 'En proceso': 'In progress', 'Cancelada': 'Cancelled',
  'Cancelar edición': 'Cancel editing',
  'Limpiar formulario': 'Clear form', Descripción: 'Description', 'Espacio ideal para reuniones de 4 a 6 personas.': 'Ideal space for meetings of 4 to 6 people.',
  'Crear espacio': 'Create space', 'Espacio actualizado correctamente.': 'Space updated successfully.',
  'Espacio creado correctamente.': 'Space created successfully.', 'Espacio eliminado correctamente.': 'Space deleted successfully.',
  'Espacio desactivado correctamente.': 'Space deactivated successfully.', 'Espacio activado correctamente.': 'Space activated successfully.',
  'No se pudieron cargar los espacios.': 'Could not load spaces.', 'No se pudo guardar el espacio.': 'Could not save the space.',
  'No se pudo cambiar el estado del espacio.': 'Could not change the space status.', 'No se pudo eliminar el espacio.': 'Could not delete the space.',
  'No se pudieron cargar las reservas.': 'Could not load bookings.', 'No se pudo actualizar la reserva.': 'Could not update the booking.',
  'No se pudo eliminar la reserva.': 'Could not delete the booking.', 'Cancelación permitida hasta 2 horas antes del inicio.': 'Cancellation is allowed up to 2 hours before the start.',
  Activo: 'Active', Inactivo: 'Inactive', 'No disponible': 'Unavailable',
  'Sala de reunión': 'Meeting room', Escritorio: 'Desk', 'Zona general': 'General area',
  'Consulta la ubicación exacta en la ficha del espacio': 'See the space details for the exact location',
  'Ubicación disponible': 'Location available', Wifi: 'Wi-Fi', Café: 'Coffee', Aire: 'Air conditioning', Proyector: 'Projector',
  'Volver al catálogo': 'Back to spaces', 'No hay ningún espacio disponible con ese identificador en la base de datos.': 'No space with this ID is currently available in the database.',
  '© 2026 CoSpace · Tu tiempo, tu espacio.': '© 2026 CoSpace · Your time, your space.',
  Reserva: 'Booking', 'hasta ': 'until ',
  'Disponible por horas con reserva instantánea': 'Available by the hour with instant booking',
  '/ hora': '/ hour', 'Incluye Wi‑Fi, limpieza y acceso a la zona coworking.': 'Includes Wi-Fi, cleaning, and access to the coworking area.',
  'Sala 3': 'Room 3', 'Precio/hora': 'Price/hour', 'Cerrar formulario de reserva': 'Close booking form',
  'Confirmadas y en espera': 'Confirmed and pending', 'Reservas hoy': 'Bookings today', 'Gestionar espacios': 'Manage spaces',
  'Las reservas se gestionan con control de acceso real': 'Bookings are protected with access controls',
  Activa: 'Active', 'CONFIRMED': 'Confirmed', 'IN_PROCESS': 'In progress', 'CANCELLED': 'Cancelled',
};

const englishMessagesInSpanish: Record<string, string> = {
  'Email already in use.': 'Este correo ya está registrado.',
  'Invalid email or password.': 'Correo o contraseña no válidos.',
  'Invalid refresh token.': 'La sesión no es válida. Inicia sesión de nuevo.',
  'Refresh token has been revoked or expired.': 'La sesión ha caducado. Inicia sesión de nuevo.',
  'Selected space is not available.': 'El espacio seleccionado no está disponible.',
  'The selected time slot is already reserved or on temporary hold.': 'El horario seleccionado ya está reservado o retenido temporalmente.',
  'The selected time slot is already booked or temporarily held.': 'El horario seleccionado ya está reservado o retenido temporalmente.',
  'Cancellation is only allowed up to 2 hours before the reservation starts.': 'Solo puedes cancelar hasta 2 horas antes del inicio de la reserva.',
  'You already have the maximum of 3 future reservations.': 'Ya tienes el máximo de 3 reservas futuras.',
  'Reservations cannot be scheduled more than 30 days in advance.': 'No se pueden reservar fechas con más de 30 días de antelación.',
  'Reservation duration must be between 1 and 4 full hours.': 'La duración debe ser de entre 1 y 4 horas completas.',
  'Reservations are allowed only between 07:00 and 21:00.': 'Solo se permiten reservas entre las 07:00 y las 21:00.',
  CONFIRMED: 'Confirmada', IN_PROCESS: 'En proceso', CANCELLED: 'Cancelada',
  'Switch language to English': 'Cambiar idioma a inglés',
  'Switch language to Spanish': 'Cambiar idioma a español',
};

let currentLocale: BrowserLocale = 'es';
const visited = new WeakMap<Text, { source: string; displayed: string }>();
const internalChanges = new WeakSet<Text>();
const translatedAttributes = new WeakMap<Element, Map<string, { source: string; displayed: string }>>();
let observer: MutationObserver | undefined;

function translatedValue(value: string, locale: BrowserLocale): string {
  const trimmed = value.trim();
  if (locale === 'es') return englishMessagesInSpanish[trimmed] ? value.replace(trimmed, englishMessagesInSpanish[trimmed]) : value;
  const exact = translations[trimmed] ?? translations[`${trimmed} `];
  if (exact) return value.replace(trimmed, exact);

  for (const [source, target] of Object.entries(translations)) {
    if (source.endsWith(' ') && trimmed.startsWith(source.trim())) {
      return value.replace(trimmed, `${target}${trimmed.slice(source.trim().length)}`);
    }
    if (source.startsWith(' ') && trimmed.endsWith(source.trim())) {
      return value.replace(trimmed, `${trimmed.slice(0, -source.trim().length)}${target}`);
    }
  }
  return value;
}

export function applyBrowserTranslations(locale: BrowserLocale): void {
  currentLocale = locale;
  document.documentElement.lang = locale;

  const updateText = (node: Text) => {
    if (!node.parentElement || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)) return;
    let record = visited.get(node);
    if (record && node.data !== record.displayed) record = undefined;
    const source = record?.source ?? node.data;
    const result = translatedValue(source, currentLocale);
    if (result === node.data) {
      visited.set(node, { source, displayed: result });
      return;
    }
    visited.set(node, { source, displayed: result });
    internalChanges.add(node);
    node.data = result;
  };

  const updateAttributes = (element: Element) => {
    for (const attribute of ['placeholder', 'aria-label', 'title', 'alt']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const records = translatedAttributes.get(element) ?? new Map();
      const previous = records.get(attribute);
      const source = previous && value === previous.displayed ? previous.source : value;
      const result = translatedValue(source, currentLocale);
      records.set(attribute, { source, displayed: result });
      translatedAttributes.set(element, records);
      if (result !== value) element.setAttribute(attribute, result);
    }
  };

  const visit = (node: Node) => {
    if (node instanceof Text) updateText(node);
    else if (node instanceof Element) {
      updateAttributes(node);
      node.childNodes.forEach(visit);
    }
  };

  visit(document.body);
  if (observer) return;
  observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'characterData') {
        const node = record.target as Text;
        if (internalChanges.has(node)) internalChanges.delete(node);
        else updateText(node);
      } else if (record.type === 'attributes') {
        updateAttributes(record.target as Element);
      } else {
        record.addedNodes.forEach(visit);
      }
    });
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title', 'alt'] });
}
