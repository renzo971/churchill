const fs = require('fs');

const json = [];

function process(data) {
  const songs = data.split('---').filter((song) => song !== '');

  songs.forEach((song, index) => {
    const parts = song.split('***\r\n').filter((part) => part !== '');

    const item = {
      number: 0,
      title: '',
      chorus: null,
      stanzas: [],
      startsWithChorus: false,
      repeatChorusAtEnd: false,
      authors: null,
      tags: null,
    };

    parts.forEach((part, index) => {
      const lines = part.split('\r\n').filter((line) => line !== '');

      if (index === 0) {
        let title = lines.join().replace('## ', '').replace('.', '');
        item.number = +title.match(/^\d+/gm);
        item.title = title.replace(item.number, '').trim();
      } else {
        if (lines[0].includes('@CORO')) {
          lines.shift();
          item.chorus = lines.join('/n');
          item.startsWithChorus = item.stanzas.length === 0;
        } else if (lines[0].includes('@AUTHORS')) {
          lines.shift();
          item.authors = lines.join(', ');
        } else if (lines[0].includes('@TAGS')) {
          lines.shift();
          item.tags = lines.join(',');
        } else if (lines[0].includes('@REPETIR_CORO_AL_FINAL')) {
          item.repeatChorusAtEnd = true;
        } else {
          item.stanzas.push(lines.join('/n'));
        }
      }
    });

    json.push(item);
  });
}

fs.readFile('./himnario-bautista.txt', 'utf8', (err, data) => {
  if (err) return console.log(err);

  process(data);

  fs.readFile('./himnario-majestuoso.txt', 'utf8', (err, data) => {
    if (err) return console.log(err);

    process(data);

    fs.readFile('./himnario-apendice.txt', 'utf8', (err, data) => {
      if (err) return console.log(err);

      process(data);

      fs.writeFile(
        './src/assets/data/anthemns/index.json',
        JSON.stringify(
          json /* .sort((a, b) => a.number - b.number) */,
          null,
          2
        ),
        'utf-8',
        (err) => {
          if (err) {
            return console.log(err);
          }
          console.log('Himnario generado!');
        }
      );
    });
  });
});
