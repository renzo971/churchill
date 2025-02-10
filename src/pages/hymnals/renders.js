import { Highlighter } from 'react-bootstrap-typeahead';

export const finderRender = (option, { text }) => (
  <div className="my-2">
    <div className="d-flex align-items-center mb-1">
      <strong className="fs-lg">{option.title}</strong>
      {option?.book && <small className="tag mb-0 ml-2">{option?.book}</small>}
      {/* {option?.tags?.split(',').map((tag) => (
        <small key={tag} className="tag mb-0 ml-2">
          {tag}
        </small>
      ))} */}
    </div>

    <Highlighter search={text}>
      {option.text.replaceAll('/n', ' ').replaceAll('_', '')}
    </Highlighter>

    {option.authors ? (
      <div className="small font-italic mt-2">Autor(es): {option.authors}</div>
    ) : null}
  </div>
);

export const typeaheadRender = (option, { text }) => (
  <>
    <Highlighter search={text}>{option.title}</Highlighter>
    <small
      className="more font-italic"
      title={option.text.replaceAll('/n', '\n')}
    >
      {option.text.replaceAll('1)', '').replaceAll('/n', ' ')}
    </small>
    {option?.book && <small className="tag mb-1">{option?.book}</small>}
  </>
);
