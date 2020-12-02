import React, {useEffect, useState} from 'react';
import './App.scss';
import EventTable from './tables/EventTable'
import Axios from "axios";
import data from './tables/comp.json'
import {useTranslation} from "react-i18next";
import {IEvent} from "./interfaces/event";
import Modal from "./components/modal/modal";
import EventForm from "./forms/eventForm";

const App = () => {
  var url = 'http://local.bridge.co.il/backend';
  const { t, i18n } = useTranslation();

  Axios.post(url, {
    paction: 'get-rounds-by-fxilter',
    clubs: 0,
    year: 2020,
    month: 10}).then((res)=>{
  })

  const initialFormState = { id: '', name: '', description: '' };
  const [ showForm, setShowForm ] = useState<boolean>(false);

  const test = () => {
    return 's'
  }

  const showFormModal = () => showForm ? <Modal
      className='ic-modal'
      width={"80%"}
      modalClosed={() => setShowForm(false)}
      visible={showForm}>
    <EventForm onSave={test} onCancel={test}></EventForm>
  </Modal> : null;


  // Setting state
  const [ events, setEvents ] = useState<IEvent[]>([])
  const [ currentEvent, setCurrentEvent ] = useState(initialFormState)
  const [ editing, setEditing ] = useState(false);

  useEffect(()=>{
    const events = data.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setEvents(events)
  }, []);

  // CRUD operations
  const addEvent = (event: IEvent) => {
    event.id = events.length + 1;
    setEvents([ ...events, event ]);
  }

  const deleteEvent = (id: number) => {
    setEditing(false);
    setEvents(events.filter(user => user.id !== id));
  }

  const updateEvent = (id: number, updatedEvent: IEvent) => {
    setEditing(false);
    setEvents(events.map(event => (event.id === id ? updatedEvent : event)));
  }

  const editEvent = (event: IEvent) => {
    // setEditing(true);
    // setCurrentEvent({ id: event.id, name: event.name, description: event.description });
  }

  if(!events) return <span>loading...</span>;
  return (
      <div className="container">
        {showFormModal()}
        <h1> {t('system_name')} </h1>
        <button
            onClick={() => setShowForm(true)}
            className="button muted-button margin-bottom-10"
        >
          {t('add')}
        </button>
        <div className="flex-row">
          {/*<div className="flex-large">*/}
          {/*		<Fragment>*/}
          {/*			<AddUserForm addUser={addUser} />*/}
          {/*		</Fragment>*/}
          {/*	)}*/}
          {/*</div>*/}
          <div className="flex-large">
            <EventTable events={events} editEvent={editEvent} deleteEvent={deleteEvent} />
          </div>
        </div>
      </div>
  )
}

export default App;
