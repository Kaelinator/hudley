const convertAlphaToGrayscaleImage = (context) => {
  const source = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
  const transparencyMap = source.map((value, i) => {
    const rgbaIndex = i % 4; // 0 = r, 1 = g, 2 = b, 3 = a
    return rgbaIndex < 3 ? source[i + (3 - rgbaIndex)] : 255;
  });
  const buf = new ImageData(transparencyMap, context.canvas.width, context.canvas.height);
  context.putImageData(buf, 0, 0);
  return context.canvas.toDataURL('image/webp');
};

export const renderFrame = (context) => {
  const { canvas } = context;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = 'bold 144px sans-serif';
  context.fillStyle = 'white';
  context.shadowColor = 'rgb(0 0 0 / 50%)';
  context.shadowBlur = 8;
  context.textAlign = 'center';
  context.fillText('yuh yuh yuh', canvas.width / 2, canvas.height / 2);

  const frame = context.canvas.toDataURL('image/webp');

  return {
    frame,
    alpha: convertAlphaToGrayscaleImage(context),
  };
};

export const render = (context, {
  startPoint, endPoint, framerate, renderPath,
}) => {

  let cancelled = false;
  let progressHandler;
  let doneHandler;

  const api = {};

  api['onProgress'] = (f) => {
    progressHandler = f;
    return api;
  };

  api['onDone'] = (f) => {
    doneHandler = f;
    return api;
  };

  api['cancel'] = () => {
    cancelled = true;
  };

  window.hudley.initRender(renderPath, {
    quality: 0.99999,
    frameRate: framerate,
    transparent: true,
  }).then(async () => {
      const startTime = Date.now();
      /* eslint-disable no-await-in-loop */
      for (let i = startPoint; i < endPoint; i += 1) {
        const { frame, alpha } = renderFrame(context);
        await window.hudley.addFrame(frame, alpha);
        if (i != startPoint) {
          progressHandler({
            frame: i - startPoint,
            totalFrames: endPoint - startPoint,
            progress: (i - startPoint) / (endPoint - startPoint),
            elapsedTime: Date.now() - startTime,
            estimatedRunTime: (endPoint - startPoint) / (i - startPoint) * (Date.now() - startTime),
          });
        }
        if (cancelled) {
          break;
        }
      }
      /* eslint-enable no-await-in-loop */

      await window.hudley.completeRender();
      doneHandler();
      console.log('done');
    });

  return api;
};
