export const units = {
  /* temperature */
  F: Symbol.for('fahrenheit'),
  C: Symbol.for('celcius'),

  /* pressure */
  PSIA: Symbol.for('pounds per square inch absolute '),
  PSIG: Symbol.for('pounds per square inch guage '),
  KPA: Symbol.for('kilopascals'), // absolute
  BAR: Symbol.for('bar'), // absolute

  /* flow */
  GPH: Symbol.for('gallons per hour'),
  LPH: Symbol.for('liters per hour'),
  GLBPH: Symbol.for('pounds of gasoline per hour'),

  /* time */
  MS: Symbol.for('milliseconds'),
  S: Symbol.for('seconds'),
  H: Symbol.for('hour'),

  /* distance */
  FT: Symbol.for('feet'),
  IN: Symbol.for('inch'),
  M: Symbol.for('meter'),
  MM: Symbol.for('millimeter'),

  /* speed */
  MPH: Symbol.for('miles per hour'),
  KPH: Symbol.for('kilometers per hour'),

  /* part */
  TO1: Symbol.for('ratio to 1'),
  PERCENT: Symbol.for('percent'),

  /* frequency */
  RPM: Symbol.for('rotations per minute'),
  HZ: Symbol.for('hertz'),

  /* angle */
  DEG: Symbol.for('degrees'),
  RAD: Symbol.for('radians'),

  /* charge */
  V: Symbol.for('volts'),

  /* current */
  A: Symbol.for('amperes'),

  /* resistance */
  OHM: Symbol.for('ohms'),

  /* None */
  DIMENSIONLESS: Symbol.for('dimensionless'),
};

const {
  F,
  C,
  PSIA,
  PSIG,
  KPA,
  BAR,
  GPH,
  LPH,
  GLBPH,
  MS,
  S,
  H,
  FT,
  IN,
  M,
  MM,
  MPH,
  KPH,
  TO1,
  PERCENT,
  RPM,
  HZ,
  DEG,
  RAD,
  V,
  A,
  OHM,
  DIMENSIONLESS, 
} = units;

export const abbreviations = {
  [F]: '\u00B0F',
  [C]: '\u00B0C',
  [PSIA]: 'psia',
  [PSIG]: 'psig',
  [KPA]: 'kPa',
  [BAR]: 'bar',
  [GPH]: 'gph',
  [LPH]: 'Lph',
  [GLBPH]: 'lb/hr',
  [MS]: 'ms',
  [S]: 's',
  [H]: 'hr',
  [FT]: '\'',
  [IN]: '"',
  [M]: 'm',
  [MM]: 'mm',
  [MPH]: 'mph',
  [KPH]: 'kph',
  [TO1]: ':1',
  [PERCENT]: '%',
  [RPM]: 'rpm',
  [HZ]: 'Hz',
  [DEG]: '\u00B0',
  [RAD]: 'rad',
  [V]: 'V',
  [A]: 'A',
  [OHM]: '\u03A9',
  [DIMENSIONLESS]: '',
};

/**
 * list of available unit conversions
 * useage: conversions[from][to](value)
 */
export const conversions = {
  [F]: {
    [C]: t => 0.55556 * (t - 32),
  },

  [C]: {
    [F]: t => 1.8 * t + 32,
  },

  [PSIA]: {
    [PSIG]: p => p - 14.696,
    [KPA]: p => p * 6.894757,
    [BAR]: p => p * 0.06894757,
  },

  [PSIG]: {
    [PSIA]: p => p + 14.696,
    [KPA]: p => p * 6.894757 + 101.325,
    [BAR]: p => p * 0.06894757 + 1.01325,
  },

  [KPA]: {
    [PSIA]: p => p * 0.1450377,
    [PSIG]: p => p * 0.1450377 - 14.696,
    [BAR]: p => p * 0.01,
  },

  [BAR]: {
    [PSIA]: p => p * 14.50377,
    [PSIG]: p => p * 14.50377 - 14.696,
    [KPA]: p => p * 100,
  },

  [GPH]: {
    [LPH]: q => q * 3.785412,
    [GLBPH]: q => q * 6.073,
  },

  [LPH]: {
    [GPH]: q => q * 0.264172,
    [GLBPH]: q => q * 1.60432,
  },

  [MS]: {
    [S]: t => t * 0.001,
    [H]: t => t * 2.777778E-7,
  },

  [S]: {
    [MS]: t => t * 1000,
    [H]: t => t * 2.777778E-4,
  },

  [H]: {
    [MS]: t => t * 3.6E6,
    [S]: t => t * 3600,
  },

  [FT]: {
    [IN]: l => l * 12,
    [M]: l => 0.3048,
    [MM]: l => 304.8,
  },

  [IN]: {
    [FT]: l => l * 0.083333,
    [M]: l => l * 0.0254,
    [MM]: l => l * 25.4,
  },

  [M]: {
    [FT]: l => l * 3.28084,
    [IN]: l => l * 39.37008,
    [MM]: l => l * 1000,
  },

  [MM]: {
    [FT]: l => l * 0.00328084,
    [IN]: l => l * 0.03937008,
    [M]: l => l * 0.001,
  },

  [MPH]: {
    [KPH]: v => v * 1.609344,
  },

  [KPH]: {
    [MPH]: v => v * 0.6213712,
  },

  [TO1]: {
    [PERCENT]: p => p * 100,
  },

  [PERCENT]: {
    [TO1]: p => p * 0.01,
  },

  [RPM]: {
    [HZ]: r => r * 0.0166667,
  },

  [HZ]: {
    [RPM]: r => r * 60,
  },

  [DEG]: {
    [RAD]: a => a * 0.01745329,
  },

  [RAD]: {
    [DEG]: a => a * 57.29578,
  },

  [V]: {},
  [A]: {},
  [OHM]: {},

  /* passthrough */
  [DIMENSIONLESS]: Object.values(units).reduce((o, u) => ({ ...o, [u]: v => v }), {})
};
