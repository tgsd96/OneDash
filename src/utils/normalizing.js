export const denormalizer = normalizedMap => {
  let mapToArray = [];
  normalizedMap.all.forEach(id => {
    const normalizedObject = normalizedMap[id];
    mapToArray.push(normalizedObject);
  });
  return mapToArray;
};

export const normalizer = (objArray, idProp) => {
  let normalizedMap = {};
  let all = [];
  objArray.forEach(objFocus => {
    // console.log("Object in focus",objFocus);
    let index = objFocus[idProp];
    // console.log("Index",index)
    normalizedMap[index] = objFocus;
    all.push(index);
  });
  normalizedMap['all'] = all;
  return normalizedMap;
};
