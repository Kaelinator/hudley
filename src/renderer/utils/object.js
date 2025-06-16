export const replaceAtKey = (object, key, newValue) => {
  const entries = Object.entries(object);
  const index = entries.findIndex(([k]) => k === key);
  return [
    ...entries.slice(0, index),
    [key, newValue],
    ...entries.slice(index + 1),
  ].reduce((result, [k, v]) => ({
    ...result,
    [k]: v,
  }), {});
};

export const replaceAtIndex = (object, index, newValue, newKey) => {
  const entries = Object.entries(object);
  const key = newKey || entries[index][0];
  return [
    ...entries.slice(0, index),
    [key, newValue],
    ...entries.slice(index + 1),
  ].reduce((result, [k, v]) => ({
    ...result,
    [k]: v,
  }), {});
};

export const deleteAtIndex = (object, index) => {
  const entries = Object.entries(object);
  return [
    ...entries.slice(0, index),
    ...entries.slice(index + 1),
  ].reduce((result, [k, v]) => ({
    ...result,
    [k]: v,
  }), {});
};
