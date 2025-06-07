import { Delete, Edit } from '@mui/icons-material';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

const ImageWrapperStyled = styled.div`
  display: flex;
  user-select: none;
  margin-bottom: 5px;

  .settings {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
      padding: 6px 8px;
      height: 100%;
      color: #999;

      &:hover {
        background-color: var(--secondary);
        color: var(--dark);
      }
    }
  }
`;

const ImageStyled = styled.div`
  background-color: transparent;
  border: none;
  text-align: left;
  color: #999;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9em;
  padding: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex: 1 0;
  align-items: center;
  gap: 10px;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;

  p {
    font-size: 0.8rem;
  }

  .image {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.active {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px inset;
    pointer-events: none;

    strong {
      color: var(--light);
    }

    p {
      color: #fff;
    }

    .image {
      transform: scale(1.1);
      border: 3px solid var(--secondary);
    }
  }

  &:hover {
    color: #fff;
    background-color: #111;

    .image {
    }
  }
`;

export function ListImage({
  src,
  title,
  description,
  onClick,
  onEdit,
  onDelete,
  active = false,
  disabled = false,
}) {
  return (
    <ImageWrapperStyled>
      <ImageStyled
        title={title}
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <div
          className="image"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: 55,
            height: 55,
            borderRadius: 8,
            flex: '0 1 55px',
          }}
        />
        <div
          style={{
            flex: '1 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <strong
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              lineClamp: 1,
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
          >
            {title}
          </strong>
          <p
            title={description}
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              lineClamp: 2,
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      </ImageStyled>

      {active && !disabled && (
        <div className="settings">
          {/*<OverlayTrigger placement="right" overlay={<Tooltip>Editar</Tooltip>}>
            <Button variant="dark" onClick={onEdit}>
              <Edit fontSize="small" />
            </Button>
          </OverlayTrigger> */}

          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Eliminar</Tooltip>}
          >
            <Button variant="dark" onClick={onDelete}>
              <Delete fontSize="small" />
            </Button>
          </OverlayTrigger>
        </div>
      )}
    </ImageWrapperStyled>
  );
}
