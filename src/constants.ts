import { PrimeIcons } from 'primereact/api'
export const navBarItems = [
  {
    label: 'Mi perfil',
    url: '/profile',
    icon: PrimeIcons.USER,
    private: true,
  },
  {
    label: 'Inicio',
    url: '/',
    icon: PrimeIcons.HOME,
    private: false,
  },
  {
    label: 'Crear post',
    url: '/create-post',
    icon: PrimeIcons.PLUS,
    private: true,
  },
  {
    label: 'Tendencias',
    url: '/trends',
    icon: PrimeIcons.CHART_LINE,
    private: false,
  },

  {
    label: 'Mis temas',
    url: '/topics',
    icon: PrimeIcons.LIST,
    private: true,
  },
  {
    label: 'Configuración',
    url: '/settings',
    icon: PrimeIcons.COG,
    private: true,
  },
  {
    label: 'Ayuda',
    url: '/help',
    icon: PrimeIcons.QUESTION_CIRCLE,
    private: true,
  },
]
