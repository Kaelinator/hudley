import WebMWriter from 'webm-writer';

export const renderFrame = (context) => {
  const canvas = context.canvas;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = 'bold 144px sans-serif';
  context.fillStyle = 'white';
  context.shadowColor = 'rgb(0 0 0 / 50%)';
  context.shadowBlur = 8;
  context.textAlign = 'center';
  context.fillText("yuh yuh yuh",canvas.width / 2, canvas.height / 2);

  const frame = context.canvas.toDataURL('image/webp');

  return {
    frame,
    alpha: convertAlphaToGrayscaleImage(context),
  }
};

export const render = async (context, { startPoint, endPoint, framerate, renderPath }) => {
  await window.hudley.initRender(renderPath, { 
    quality: 0.99999,
    frameRate: framerate,
    transparent: true
  });

  for (let i = startPoint; i < endPoint; i++) {
    const { frame, alpha } = renderFrame(context);
    await window.hudley.addFrame(frame, alpha);
  }

  await window.hudley.completeRender();
  console.log('done');
};

const convertAlphaToGrayscaleImage = (context) =>  {

  const source = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
  const transparencyMap = source.map((value, i) => {
    const rgbaIndex = i % 4; // 0 = r, 1 = g, 2 = b, 3 = a
    return rgbaIndex < 3 ? source[i + (3 - rgbaIndex)] : 255;
  });
  const buf = new ImageData(transparencyMap, context.canvas.width, context.canvas.height); // settings??
  context.putImageData(buf, 0, 0);
  return context.canvas.toDataURL('image/webp');
}

