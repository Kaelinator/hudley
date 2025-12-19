export const units = {
  /* temperature */
  F: Symbol.for('fahrenheit'),
  C: Symbol.for('celcius'),

  /* pressure */
  PSIA: Symbol.for('pounds per square inch absolute '),
  PSIG: Symbol.for('pounds per square inch guage '),
  KPA: Symbol.for('kilopascals'),
  BAR: Symbol.for('bar'),

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
