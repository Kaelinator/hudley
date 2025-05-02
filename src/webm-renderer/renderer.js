export const renderFrame = (pointValues, context) => (viewPoints) => {
  const { width } = context.canvas;
  const { height } = context.canvas;
  console.log('rendering', pointValues, viewPoints, width, height);
  context.clearRect(0, 0, width, height);
  context.font = 'bold 144px sans-serif';
  context.fillStyle = 'white';
  context.shadowColor = 'rgb(0 0 0 / 50%)';
  context.shadowBlur = 8;
  viewPoints.forEach(({ point, location, precision }) => {
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
    context.fillText(pointValues[point].toFixed(precision), x, y);
  });
};

export const render = async (path, allPointValues, context, viewPoints) => {
  console.log('finna render', path);
  const webmWriter = await window.hudley.createWebmWriter(path);
  const step = 100 / 30; // hundredths of a second (cs) between frames
  let rtc = allPointValues[0].rtc;
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
