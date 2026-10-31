import dayjs from "dayjs";
import "dayjs/locale/es-mx";

const formatDate = (dateString: string) => {
  return dayjs(dateString).locale('es-mx').format('D [de] MMMM [de] YYYY');
};

const formatDateWithTime = (dateString: string) => {
  return dayjs(dateString).locale('es-mx').format('D [de] MMMM [de] YYYY, h:mm A');
}

const formatTime = (dateString: string) => {
  return dayjs(dateString, 'HH:mm').format('hh:mm A');
};

const formatDays = (days: string[]) => {
  const daysMap: Record<string, string> = {
    lunes: 'Lun',
    martes: 'Mar',
    "miércoles": 'Mié',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    "sábado": 'Sáb',
    sabado: 'Sáb',
    domingo: 'Dom'
  };
  //Ordenar los días según el orden de la semana
  const weekOrder = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo'];
  days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

  return days.map(day => daysMap[day] || day).join(', ');
};

const formatHour = (dateString: string) => {
  return dayjs(dateString, 'HH:mm').format('hh:mm A');
};

export { formatDate, formatTime, formatDateWithTime, formatDays, formatHour };