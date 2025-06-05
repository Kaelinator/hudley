export const units = {
  /* temperature */
  F: Symbol.for('fahrenheit'),
  C: Symbol.for('celcius'),

  /* pressure */
  PSIA: Symbol.for('absolute pounds per square inch'),
  PSIG: Symbol.for('guage pounds per square inch'),
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
