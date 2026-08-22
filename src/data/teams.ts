import { Team } from '../types';
import unafutCalendar from '../../calendario_unafut.json';

const UNAFUT_LOGOS: Record<string, string> = {};

unafutCalendar.partidos.forEach((match) => {
  UNAFUT_LOGOS[match.equipo_local] = match.logo_local;
  UNAFUT_LOGOS[match.equipo_visitante] = match.logo_visitante;
});

export const TEAMS: Team[] = [
  {
    id: 'sap',
    name: 'Deportivo Saprissa',
    shortName: 'Saprissa',
    code: 'SAP',
    primaryColor: '#6e112d', // Morado Saprissa
    secondaryColor: '#ffffff',
    accentColor: '#bf00ff',
    stadium: 'Estadio Ricardo Saprissa Aymá',
    city: 'San Juan de Tibás, San José',
    founded: 1935,
    titles: 40,
    starPlayers: ['Mariano Torres', 'Javon East', 'Ariel Rodríguez', 'David Guzmán', 'Kendall Waston'],
    logoType: 'saprissa',
    logoUrl: UNAFUT_LOGOS['Deportivo Saprissa'],
  },
  {
    id: 'lda',
    name: 'Liga Deportiva Alajuelense',
    shortName: 'Alajuelense',
    code: 'LDA',
    primaryColor: '#4d070d', // Rojo Manudo muy oscuro
    secondaryColor: '#111111',
    accentColor: '#7f1118',
    stadium: 'Estadio Alejandro Morera Soto',
    city: 'Alajuela',
    founded: 1919,
    titles: 30,
    starPlayers: ['Jonathan Moya', 'Celso Borges', 'Anderson Canhoto', 'Alexis Gamboa', 'Carlos Martínez'],
    logoType: 'alajuelense',
    logoUrl: UNAFUT_LOGOS['L.D. Alajuelense'],
  },
  {
    id: 'csh',
    name: 'Club Sport Herediano',
    shortName: 'Herediano',
    code: 'CSH',
    primaryColor: '#86131a', // Rojo y Amarillo Florense oscuro
    secondaryColor: '#c08b16',
    accentColor: '#ffd700',
    stadium: 'Estadio Carlos Alvarado Villalobos',
    city: 'Heredia',
    founded: 1921,
    titles: 29,
    starPlayers: ['Marcel Hernández', 'Elías Aguilar', 'Allan Cruz', 'Gerson Torres', 'Fernán Faerron'],
    logoType: 'herediano',
    logoUrl: UNAFUT_LOGOS['C.S. Herediano'],
  },
  {
    id: 'csc',
    name: 'Club Sport Cartaginés',
    shortName: 'Cartaginés',
    code: 'CSC',
    primaryColor: '#002f6c', // Azul Brumoso
    secondaryColor: '#ffffff',
    accentColor: '#00F0FF',
    stadium: 'Estadio José Rafael "Fello" Meza',
    city: 'Cartago',
    founded: 1906,
    titles: 4,
    starPlayers: ['Marco Ureña', 'Allen Guevara', 'Diego González', 'Christian Martínez', 'Kevin Briceño'],
    logoType: 'cartagines',
    logoUrl: UNAFUT_LOGOS['C.S. Cartaginés'],
  },
  {
    id: 'sca',
    name: 'AD San Carlos',
    shortName: 'San Carlos',
    code: 'SCA',
    primaryColor: '#0033a0', // Toros del Norte (ADSC)
    secondaryColor: '#d6001c',
    accentColor: '#38bdf8',
    stadium: 'Estadio Carlos Ugalde Álvarez',
    city: 'Ciudad Quesada, San Carlos',
    founded: 1965,
    titles: 1,
    starPlayers: ['Jonathan McDonald', 'Wilmer Azofeifa', 'Reggy Rivera', 'César Yanis', 'Gabriel Leiva'],
    logoType: 'sancarlos',
    logoUrl: UNAFUT_LOGOS['A.D. San Carlos'],
  },
  {
    id: 'pfc',
    name: 'Puntarenas FC',
    shortName: 'Puntarenas FC',
    code: 'PFC',
    primaryColor: '#f36f21', // Naranja Chuchequero (Tiburones)
    secondaryColor: '#111111',
    accentColor: '#ff9800',
    stadium: 'Estadio Miguel "Lito" Pérez',
    city: 'Puntarenas',
    founded: 2004,
    titles: 0,
    starPlayers: ['Anthony Hernández', 'Jossimar Pemberton', 'Amferny Arias', 'Kliver Gómez', 'Guillermo Villalobos'],
    logoType: 'puntarenas',
    logoUrl: UNAFUT_LOGOS['Puntarenas F.C.'],
  },
  {
    id: 'spo',
    name: 'Sporting FC',
    shortName: 'Sporting FC',
    code: 'SPO',
    primaryColor: '#1a1a1a', // Albinegro SFC 2016
    secondaryColor: '#ffffff',
    accentColor: '#facc15',
    stadium: 'Estadio Ernesto Rohrmoser',
    city: 'Pavas, San José',
    founded: 2016,
    titles: 0,
    starPlayers: ['Steven Cárdenas', 'Giancarlo González', 'Víctor Medina', 'Harry Rojas', 'Adonis Pineda'],
    logoType: 'sporting',
    logoUrl: UNAFUT_LOGOS['Sporting F.C.'],
  },
  {
    id: 'mpz',
    name: 'Municipal Pérez Zeledón',
    shortName: 'Pérez Zeledón',
    code: 'MPZ',
    primaryColor: '#0047ba', // Guerreros del Sur PZ
    secondaryColor: '#ffffff',
    accentColor: '#60a5fa',
    stadium: 'Estadio Municipal de Pérez Zeledón',
    city: 'San Isidro de El General',
    founded: 1962,
    titles: 1,
    starPlayers: ['Cardel Benbow', 'Joaquín Aguirre', 'Axel Amador', 'Bryan Félix', 'Bryan Segura'],
    logoType: 'perezzeledon',
    logoUrl: UNAFUT_LOGOS['Municipal Pérez Zeledón'],
  },
  {
    id: 'esc',
    name: 'Escorpiones de Belén',
    shortName: 'Escorpiones',
    code: 'ESC',
    primaryColor: '#f5b800', // Amarillo y Azul Belén 1907
    secondaryColor: '#004085',
    accentColor: '#ffd700',
    stadium: 'Polideportivo de Belén',
    city: 'Belén, Heredia',
    founded: 1907,
    titles: 0,
    starPlayers: ['Josué Martínez', 'Verny Scott', 'Keylor Soto', 'Randy Chirino', 'Erick Scott'],
    logoType: 'escorpiones',
    logoUrl: UNAFUT_LOGOS['Escorpiones F.C.'],
  },
  {
    id: 'isc',
    name: 'Inter San Carlos',
    shortName: 'Inter San Carlos',
    code: 'ISC',
    primaryColor: '#135c34', // Verde y Dorado Puma
    secondaryColor: '#a67c1e',
    accentColor: '#4ade80',
    stadium: 'Complejo Deportivo San Carlos',
    city: 'San Carlos, Alajuela',
    founded: 2021,
    titles: 0,
    starPlayers: ['Keral Ríos', 'Armando Gómez', 'Fabián Pérez', 'Daniel Vargas', 'Jean Carlo Sánchez'],
    logoType: 'intersancarlos',
    logoUrl: UNAFUT_LOGOS['Inter San Carlos'],
  }
];

export const getTeamById = (id: string): Team => {
  return TEAMS.find((t) => t.id === id) || TEAMS[0];
};

export const getTeamByCode = (code: string): Team => {
  return TEAMS.find((t) => t.code === code) || TEAMS[0];
};
