import { Close } from '@mui/icons-material';
import { Sidebar } from 'components';
import { useSettingsSidebar } from 'hooks';
import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import createPersistedState from 'use-persisted-state';
import { toBase64 } from 'utils';
import { BROADCAST, SETTINGS_OPTIONS } from 'values';

const useSchedule = createPersistedState(BROADCAST.SCHEDULES_AND_EVENTS);

export function Schedule() {
  const { toggleSchedule, showingSchedule } = useSettingsSidebar();
  const [schedules, setSchedules] = useSchedule(
    BROADCAST.INITIAL_SCHEDULES_AND_EVENTS
  );

  const handleSchedulesChangeValue = (name, value, index) => {
    schedules[index][name] = value;
    setSchedules([...schedules]);
  };

  return (
    <Sidebar
      light
      closable
      className={showingSchedule ? '' : 'closed'}
      size={600}
      offset={320 + 55}
    >
      <h1 className="display-4 mb-4">
        Horarios y Eventos{' '}
        {/* <small className="text-muted">
          ({schedules?.filter((s) => s.active).length}/{schedules?.length})
        </small> */}
      </h1>
      <Button
        className="p-0 text-dark"
        variant="link"
        style={{ position: 'absolute', top: 13, right: 10 }}
        onClick={toggleSchedule}
      >
        <Close />
      </Button>

      <div>
        {schedules?.map((schedule, index) => (
          <div
            key={index}
            className="p-2"
            style={{
              backgroundColor: schedule.active ? '#fff' : '#f2f3f5',
              border: schedule.active
                ? 'solid 2px var(--primary)'
                : 'dotted 2px #dee2e6',
              marginBottom: index === schedules.length - 1 ? '0' : '0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <div className="w-100 d-flex" style={{ gap: '0.5rem' }}>
              <div className="d-flex align-items-center pl-2">
                {/* <strong className="d-block">{index + 1}</strong> */}
                <Form.Check
                  className="d-inline-block"
                  type="switch"
                  id={`active-${index}`}
                  name="active"
                  checked={schedule.active}
                  onChange={() =>
                    handleSchedulesChangeValue(
                      'active',
                      !schedule.active,
                      index
                    )
                  }
                />
              </div>

              <div style={{ flexGrow: 1 }}>
                <Form.Row className="mb-2">
                  <Form.Group as={Col} className="mb-0">
                    {/* <Form.Label className=" small mb-1">Descripción</Form.Label> */}
                    <Form.Control
                      as="input"
                      size="sm"
                      value={schedule.name}
                      name="name"
                      placeholder="Describe que actividad tiene la Iglesia..."
                      disabled={!schedule.active}
                      onChange={({ target }) => {
                        const { name, value } = target;
                        handleSchedulesChangeValue(name, value, index);
                      }}
                    />
                    {!schedule.name && schedule.active && (
                      <small
                        class="form-text text-muted"
                        style={{ fontSize: '75%' }}
                      >
                        Deja la descripción vacía si sólo deseas mostrar el
                        fondo.
                      </small>
                    )}
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  {schedule.type !== 'EVENT' ? (
                    <>
                      <Form.Group as={Col} xs={6} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Día</Form.Label> */}
                        <Form.Control
                          as="select"
                          size="sm"
                          value={schedule.day}
                          name="day"
                          disabled={!schedule.active}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        >
                          {SETTINGS_OPTIONS.DAYS.map(
                            ({ value, label, divider }) => (
                              <React.Fragment key={value}>
                                {divider ? (
                                  <hr />
                                ) : (
                                  <option value={value}>{label}</option>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} xs={3} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Hora</Form.Label> */}
                        <Form.Control
                          size="sm"
                          as="select"
                          name="hour"
                          disabled={!schedule.active}
                          value={schedule.hour}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        >
                          {SETTINGS_OPTIONS.HOURS.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} xs={3} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Horario</Form.Label> */}
                        <Form.Control
                          as="select"
                          size="sm"
                          value={schedule.hourSuffix}
                          name="hourSuffix"
                          disabled={!schedule.active}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </Form.Control>
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Group as={Col} xs={6} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Día</Form.Label> */}
                        <Form.Control
                          as="input"
                          type="date"
                          size="sm"
                          value={schedule.date}
                          name="date"
                          disabled={!schedule.active}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        />
                      </Form.Group>

                      <Form.Group as={Col} xs={3} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Hora</Form.Label> */}
                        <Form.Control
                          size="sm"
                          as="select"
                          name="hour"
                          disabled={!schedule.active}
                          value={schedule.hour}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        >
                          {SETTINGS_OPTIONS.HOURS.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group as={Col} xs={3} className="mb-0">
                        {/* <Form.Label className=" small mb-1">Horario</Form.Label> */}
                        <Form.Control
                          as="select"
                          size="sm"
                          value={schedule.hourSuffix}
                          name="hourSuffix"
                          disabled={!schedule.active}
                          onChange={({ target }) => {
                            const { name, value } = target;
                            handleSchedulesChangeValue(name, value, index);
                          }}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </Form.Control>
                      </Form.Group>
                    </>
                  )}

                  <Form.Group as={Col} xs={12} className="mb-0 mt-2">
                    {schedule.background ? (
                      <div
                        className="d-flex align-items-center w-100"
                        style={{ gap: '0.5rem' }}
                      >
                        <img
                          src={schedule.background}
                          alt=""
                          style={{
                            objectFit: 'cover',
                            flexGrow: 1,
                            height: 38,
                            border: '1px solid #ced4da',
                          }}
                          className="rounded"
                        />

                        <Button
                          size="sm"
                          className="m-0"
                          variant="outline-danger"
                          disabled={!schedule.active}
                          style={{ height: 38 }}
                          onClick={() =>
                            handleSchedulesChangeValue(
                              'background',
                              null,
                              index
                            )
                          }
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <Form.File
                        id="background"
                        label="Selecciona un fondo..."
                        accept="image/png, image/jpeg"
                        size="sm"
                        custom
                        className="super-custom"
                        disabled={!schedule.active}
                        onChange={({ target }) => {
                          toBase64(target.files[0]).then((img) => {
                            handleSchedulesChangeValue(
                              'background',
                              img,
                              index
                            );
                          });
                        }}
                      />
                    )}
                  </Form.Group>
                </Form.Row>
              </div>

              <div className="d-flex flex-column justify-content-center">
                <Button
                  block
                  size="sm"
                  className="m-0"
                  variant={schedule.type !== 'EVENT' ? 'light' : 'link'}
                  disabled={!schedule.active}
                  onClick={() =>
                    handleSchedulesChangeValue('type', 'SCHEDULE', index)
                  }
                >
                  Horario
                </Button>
                <Button
                  block
                  size="sm"
                  className="m-0"
                  variant={schedule.type === 'EVENT' ? 'secondary' : 'link'}
                  disabled={!schedule.active}
                  onClick={() =>
                    handleSchedulesChangeValue('type', 'EVENT', index)
                  }
                >
                  Evento
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}