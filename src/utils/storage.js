const Storage = {};

Storage.getAll = () => {
  const values = [];
  const keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    const item = {
      key: keys[i],
      ...JSON.parse(localStorage.getItem(keys[i])),
    };
    values.push(item);
  }

  return values.map((item) => {
    return item;
  });
};

Storage.set = (key, value, flat = false) => {
  const item = {
    value,
    timestamp: new Date().getTime(),
  };

  if (flat) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, JSON.stringify(item));
  }
};

Storage.get = (key) => {
  let item = localStorage.getItem(key);

  if (item) {
    item = JSON.parse(item);
    if (item.value) {
      item = item.value;
    }
  }

  return item;
};

Storage.remove = (key) => {
  localStorage.removeItem(key);
};

Storage.clear = () => {
  localStorage.clear();
};

Storage.upload = (file, cb = () => {}) => {
  Storage.clear();

  const reader = new FileReader();
  reader.addEventListener('load', (ev) => {
    const result = JSON.parse(reader.result);

    result.forEach(({ key, ...rest }) => {
      localStorage.setItem(key, JSON.stringify({ ...rest }));
    });

    cb(result);
  });
  reader.readAsText(file);
};

Storage.download = (fileName = 'data.json') => {
  const content = Storage.getAll();
  //Opcion para filtrar solo las configuraciones de los himnos asi ya no habrá problemas al importar las preferencias
  /* const content = Storage.getAll().filter(
    (item) =>
      typeof item.key === 'string' && item.key.toLowerCase().includes('hymn')
  ); */
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(content, null, 2)], {
    type: 'text/json',
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

Storage.has = (key) => {
  const item = localStorage.getItem(key);
  return item !== null;
};

export { Storage };
