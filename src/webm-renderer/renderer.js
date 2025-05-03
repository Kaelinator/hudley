const KPA_TO_PSI = 0.1450377;
const PSI_ATMOSPHERIC = 14.696;
const POUNDS_PER_GALLON_GAS = 6.073;
const WATER_FREEZE_POINT_FAHRENHEIGHT = 32;
const CELSIUS_TO_FAHRENHEIT_RATIO = 1.8;

const noOp = (x) => x;

const functions = {
  kpaToAbsolutePsi: (x) => x * KPA_TO_PSI,
  kpaToGuagePsi: (x) => x * KPA_TO_PSI - PSI_ATMOSPHERIC,
  gasolinePoundsPerHourToGallonsPerHour: (x) => x / POUNDS_PER_GALLON_GAS,
  fahrenheitToCelsius: (x) => x / CELSIUS_TO_FAHRENHEIT_RATIO - WATER_FREEZE_POINT_FAHRENHEIGHT,
  celsiusToFahrenheit: (x) => x * CELSIUS_TO_FAHRENHEIT_RATIO + WATER_FREEZE_POINT_FAHRENHEIGHT,
};

const unitsOfMeasure = {
  kpaToAbsolutePsi: 'psia',
  kpaToGuagePsi: 'psig',
  gasolinePoundsPerHourToGallonsPerHour: 'gal/hr',
  fahrenheitToCelsius: '&#176;C',
  celsiusToFahrenheit: '&#176;F',
  rtc: 'ms',
  rpm: 'rpm',
  injPW: 'ms',
  dutyCycle: '%',
  targetAFR: ':1',
  afr: ':1',
  fuelFlow: 'lb/hr',
  estimatedVE: '% VE',
  ignitionTiming: '&#176;',
  map: 'kPa',
  mat: '&#176;F',
  cts: '&#176;F',
  battery: 'V',
  oilPressure: 'psi',
  tps: '% throttle',
};

const toText = (point, value, precision, f, includeUnitOfMeasure) => {
  const displayValue = (functions[f] || noOp)(value);
  const unitOfMeasure = f ? unitsOfMeasure[f] : unitsOfMeasure[point];
  return displayValue.toFixed(precision) + (includeUnitOfMeasure ? unitOfMeasure : '');
};

export const renderFrame = (pointValues, context) => (viewPoints) => {
  const { width } = context.canvas;
  const { height } = context.canvas;
  console.log('rendering', pointValues, viewPoints, width, height);
  context.clearRect(0, 0, width, height);
  context.font = 'bold 144px sans-serif';
  context.fillStyle = 'white';
  context.shadowColor = 'rgb(0 0 0 / 50%)';
  context.shadowBlur = 8;
  viewPoints.forEach(({
    point, location, precision, f, includeUnitOfMeasure,
  }) => {
    if (point === '' || location === '') {
      return;
    }
    const [x, y, textAlign, textBaseline] = {
      topLeft: [0, 0, 'left', 'top'],
      topMiddle: [width / 2, 0, 'center', 'top'],
      topRight: [width, 0, 'right', 'top'],
      middleLeft: [0, height / 2, 'left', 'middle'],
      middleMiddle: [width / 2, height / 2, 'center', 'middle'],
      middleRight: [width, height / 2, 'right', 'middle'],
      bottomLeft: [0, height, 'left', 'bottom'],
      bottomMiddle: [width / 2, height, 'center', 'bottom'],
      bottomRight: [width, height, 'right', 'bottom'],
    }[location];
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;
    context.fillText(toText(point, pointValues[point], precision, f, includeUnitOfMeasure), x, y);
  });
};

export const render = async (path, allPointValues, context, viewPoints) => {
  console.log('finna render', path);
  const webmWriter = await window.hudley.createWebmWriter(path);
  const step = 1000 / 30; // ms between frames
  let { rtc } = allPointValues[0];
  let pointIndex = 0;

  while (pointIndex < allPointValues.length - 1) {
    renderFrame(allPointValues[pointIndex], context)(viewPoints);
    webmWriter.addFrame(context.canvas);
    if (rtc > allPointValues[pointIndex + 1].rtc) {
      pointIndex += 1;
    }
    rtc += step;
  }

  // allPointValues.forEach((pointValues) => {
  //   renderFrame(pointValues, context)(viewPoints);
  //   webmWriter.addFrame(context.canvas);
  // });

  await webmWriter.complete();
  console.log('done rendering', path);
};
