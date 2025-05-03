import { expect, test } from 'vitest';
import readDatalog from './dl-reader';

test('reads small datalog', async () => {
  // yes I know this is more of an integration test blah blah sue me
  const data = await readDatalog('test-data/small-datalog-0.dl');
  expect(data.tuneFileName).toBe('HELLCAT.terx');
  expect(data.points[0]).toEqual({
    rpm: 1388.312744140625,
    injPW: 2.2092931270599365,
    dutyCycle: 1.710303783416748,
    targetAFR: 13.852396011352539,
    cts: 126.27592468261719,
    fuelFlow: 8.122174263000488,
    estimatedVE: 76.9671859741211,
    ignitionTiming: 10.076240539550781,
    afr: 14.845837593078613,
    map: 24.045881271362305,
    mat: 94.07595825195312,
    battery: 13.926725387573242,
    oilPressure: 74.45286560058594,
    tps: 0.18066267669200897,
    rtc: 219295876,
  });
  expect(data.points.length).toBe(165);
  expect(data.points[10]).toEqual({
    afr: 15.417254447937012,
    battery: 14.336996078491211,
    cts: 126.26073455810547,
    dutyCycle: 1.5084517002105713,
    estimatedVE: 78.41179656982422,
    fuelFlow: 7.230020523071289,
    ignitionTiming: 4.827414512634277,
    injPW: 2.184603452682495,
    map: 24.76360321044922,
    mat: 93.92056274414062,
    oilPressure: 72.69757843017578,
    rpm: 1216.692626953125,
    targetAFR: 13.807195663452148,
    tps: 0.14862030744552612,
    rtc: 219296076,
  });
  expect(data.points[100]).toEqual({
    afr: 11.580077171325684,
    battery: 14.030661582946777,
    cts: 125.99375915527344,
    dutyCycle: 1.68954598903656,
    estimatedVE: 54.11471176147461,
    fuelFlow: 8.053908348083496,
    ignitionTiming: 4,
    injPW: 2.510988473892212,
    map: 32.342926025390625,
    mat: 92.84333801269531,
    oilPressure: 71.85884857177734,
    rpm: 1145.6617431640625,
    targetAFR: 13.799999237060547,
    tps: 1.1090257167816162,
    rtc: 219297876,
  });
  expect(data.points[163]).toEqual({
    afr: 12.163944244384766,
    battery: 13.874848365783691,
    cts: 125.70072174072266,
    dutyCycle: 1.1940630674362183,
    estimatedVE: 49.62789535522461,
    fuelFlow: 5.6957221031188965,
    ignitionTiming: 9.938140869140625,
    injPW: 2.1353447437286377,
    map: 28.864383697509766,
    mat: 91.74858856201172,
    oilPressure: 69.73184204101562,
    rpm: 1041.2421875,
    targetAFR: 13.799999237060547,
    tps: 0.44691383838653564,
    rtc: 219299136,
  });
});

test('reads medium datalog', async () => {
  // yes I know this is more of an integration test blah blah sue me
  const data = await readDatalog('test-data/medium-datalog-0.dl');
  expect(data.tuneFileName).toBe('HELLCAT.terx');
  expect(data.points[0]).toEqual({
    afr: 11.992986679077148,
    battery: 14.10081672668457,
    cts: 202.64935302734375,
    dutyCycle: 1.0028914213180542,
    estimatedVE: 40.66032028198242,
    fuelFlow: 4.790371894836426,
    ignitionTiming: 9.165731430053711,
    injPW: 1.6104422807693481,
    map: 22.1372127532959,
    mat: 84.01959228515625,
    oilPressure: 59.5507926940918,
    rpm: 1374.3946533203125,
    targetAFR: 13.843148231506348,
    tps: 0.0025552622973918915,
    rtc: 195465854,
  });
  expect(data.points.length).toBe(3791);
  expect(data.points[1316]).toEqual({
    afr: 12.544939041137695,
    battery: 14.299999237060547,
    cts: 203.2503662109375,
    dutyCycle: 64.91338348388672,
    estimatedVE: 100.78258514404297,
    fuelFlow: 309.22882080078125,
    ignitionTiming: 12,
    injPW: 17.173524856567383,
    map: 171.75286865234375,
    mat: 84.77455139160156,
    oilPressure: 77.22880554199219,
    rpm: 4733.0439453125,
    targetAFR: 12.5,
    tps: 47.709190368652344,
    rtc: 195539194,
  });
  expect(data.points[3789]).toEqual({
    afr: 13.404864311218262,
    battery: 14.085683822631836,
    cts: 203.5010223388672,
    dutyCycle: 3.7507967948913574,
    estimatedVE: 64.48607635498047,
    fuelFlow: 17.93691635131836,
    ignitionTiming: 20.049640655517578,
    injPW: 3.551645040512085,
    map: 49.916908264160156,
    mat: 83.4891357421875,
    oilPressure: 62.87053680419922,
    rpm: 1602.9656982421875,
    targetAFR: 13.638270378112793,
    tps: 6.593242645263672,
    rtc: 195676814,
  });
});
