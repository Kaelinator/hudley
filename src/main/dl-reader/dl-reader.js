import { open } from 'node:fs/promises';
import { units } from '../../shared/units';

const DATALOG_SIGNATURE = 0x95365F;
const DATAPOINT_LENGTH = 0x9D0;
const DATAPOINTS_START_OFFSET = 0x2EE4;

const verifySignature = ({ bytesRead, buffer }) => {
  if (bytesRead < 0x8) {
    throw new Error('File ended abruptly');
  }

  const signature = Number(buffer.readBigInt64LE(0));
  if (signature !== DATALOG_SIGNATURE) {
    throw new Error(`File does not match typical datalog signature. ${signature} != ${DATALOG_SIGNATURE}`);
  }
};

const getUntilNullTerminatedString = ({ bytesRead, buffer }) => {
  if (bytesRead <= 0) {
    throw new Error('File ended abruptly');
  }

  const nullTerminatorPosition = buffer.indexOf('\0');

  return buffer.toString('utf8', 0, nullTerminatorPosition);
};

const getDataPoint = ({ bytesRead, buffer }) => {
  if (bytesRead < DATAPOINT_LENGTH) {
    throw new Error('File ended abruptly');
  }

  return {
    rtc: buffer.readInt32LE(0x8),
    rpm: buffer.readFloatLE(0x10),
    injPW: buffer.readFloatLE(0x18),
    dutyCycle: buffer.readFloatLE(0x20),
    targetAFR: buffer.readFloatLE(0x30),
    afr: buffer.readFloatLE(0x40),
    lambda: buffer.readFloatLE(0x48),
    airTempEnr: buffer.readFloatLE(0x50),
    coolantEnr: buffer.readFloatLE(0x58),
    afterstartEnr: buffer.readFloatLE(0x68),
    currentLearn: buffer.readFloatLE(0x70),
    cLStatus: buffer.readFloatLE(0x78),
    learnStatus: buffer.readFloatLE(0x80),
    fuelFlow: buffer.readFloatLE(0x90),
    estimatedVE: buffer.readFloatLE(0xB0),
    ignitionTiming: buffer.readFloatLE(0xD0),
    targetIdleSpeed: buffer.readFloatLE(0xF8),
    map: buffer.readFloatLE(0x100),
    map: buffer.readFloatLE(0x100),
    mat: buffer.readFloatLE(0x110),
    cts: buffer.readFloatLE(0x118),
    baro: buffer.readFloatLE(0x120),
    battery: buffer.readFloatLE(0x128),
    oilPressure: buffer.readFloatLE(0x130),
    fuelPressure: buffer.readFloatLE(0x138),
    tps: buffer.readFloatLE(0x1D8),
  };
};

export default async (datalogPath) => {
  const file = await open(datalogPath, 'r');
  let data;

  try {
    await file
      .read(Buffer.alloc(0x8), { position: 0 })
      .then(verifySignature);

    const { size } = await file.stat();
    const pointCount = Math.floor((size - DATAPOINTS_START_OFFSET) / DATAPOINT_LENGTH);

    data = {
      tuneFileName: await file
        .read(Buffer.alloc(0x80), { position: 0x324 })
        .then(getUntilNullTerminatedString),

      units: {
        rtc: Symbol.keyFor(units.MS),
        rpm: Symbol.keyFor(units.RPM),
        injPW: Symbol.keyFor(units.MS),
        dutyCycle: Symbol.keyFor(units.PERCENT),
        targetAFR: Symbol.keyFor(units.TO1),
        afr: Symbol.keyFor(units.TO1),
        fuelFlow: Symbol.keyFor(units.GLBPH),
        estimatedVE: Symbol.keyFor(units.PERCENT),
        ignitionTiming: Symbol.keyFor(units.DEG),
        map: Symbol.keyFor(units.KPA),
        mat: Symbol.keyFor(units.F),
        cts: Symbol.keyFor(units.F),
        battery: Symbol.keyFor(units.V),
        oilPressure: Symbol.keyFor(units.PSIG),
        tps: Symbol.keyFor(units.PERCENT),
      },

      points: await Promise.all(
        new Array(pointCount)
          .fill(0)
          .map((_, i) => DATAPOINTS_START_OFFSET + i * DATAPOINT_LENGTH)
          .map((position) => file
            .read(Buffer.alloc(DATAPOINT_LENGTH), { position })
            .then(getDataPoint)),
      )
      ,
    };
  } finally {
    await file.close();
  }

  return data;
};
