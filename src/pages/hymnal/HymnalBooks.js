import { West } from '@mui/icons-material';
import { List } from 'components';
import { useHymnal } from 'hooks';
import { useState } from 'react';

export function HymnalBooks({ onClick = () => {}, current }) {
  const { hymnal, books } = useHymnal();
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);

  const onChangeBook = (book) => {
    setSelected(book === selected ? null : book);
    setList(() =>
      book === selected ? [] : hymnal.filter((song) => song.book === book)
    );
  };

  return (
    <List>
      {!selected ? (
        <>
          <List.Item>
            <List.Title>Himnarios</List.Title>
          </List.Item>

          <List.Item
            className="my-2"
            style={{ flexWrap: 'wrap', justifyContent: 'start' }}
          >
            {books.map((book, index) => (
              <span
                key={index}
                onClick={() => onChangeBook(book)}
                className={`tag mr-1 mb-1 pointer ${
                  book === selected ? 'active' : ''
                }`}
              >
                {book}
              </span>
            ))}
          </List.Item>
        </>
      ) : (
        <List.Item style={{ gap: 5 }}>
          <List.Title style={{ flex: '1 1 100%' }}>
            <span className="tag pointer active w-100">
              {selected} {list.length ? <span>({list.length})</span> : null}
            </span>
          </List.Title>

          <List.Action
            style={{ flex: '1 0 42px' }}
            className="text-right"
            onClick={() => onChangeBook(selected)}
          >
            <span
              className="tag pointer active"
              style={{ paddingTop: '1px', paddingBottom: '1px' }}
            >
              <West fontSize="small" />
            </span>
          </List.Action>
        </List.Item>
      )}

      {list.map((item) => (
        <List.Item key={item.index}>
          <List.Action
            onClick={() => onClick([item])}
            title={item?.text.replaceAll('/n', '\n')}
            className={current.id === item.id ? 'text-light' : ''}
          >
            {item.title}
          </List.Action>
        </List.Item>
      ))}
    </List>
  );
}
