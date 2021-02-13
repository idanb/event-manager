import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import EventTable from './tables/EventTable'
import Axios from "axios";
import {useTranslation} from "react-i18next";
import {IEvent} from "./interfaces/event";
import Modal from "./components/modal/modal";
import EventForm from "./forms/eventForm";
import "react-datepicker/dist/react-datepicker.css";
import "primeicons/primeicons.css"

const App = () => {
    require('dotenv').config();
    const url = process.env.REACT_APP_DOMAIN || '';


    const {t, i18n} = useTranslation();
    const initialFormState = {id: '', name: '', description: ''};
    const [showForm, setShowForm] = useState<boolean>(false);

    const onCloseModal = () => {
        setShowForm(false);
    };

    const onSave = () => {
        setShowForm(false);
        refreshEvents();
    };

    const showFormModal = () => showForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('form_title')}
        modalClosed={() => setShowForm(false)}
        visible={showForm}>
        <EventForm onSave={onSave} onCancel={() => onCloseModal()}></EventForm>
    </Modal> : null;


    // Setting state
    const [events, setEvents] = useState<IEvent[]>([])
    const [currentEvent, setCurrentEvent] = useState(initialFormState)
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        refreshEvents();
    }, []);


    const refreshEvents = () => {
        Axios.get(url).then((res) => {
            res.data.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            setEvents(res.data)
        })
    }


    // CRUD operations
    const addEvent = (event: IEvent) => {
        event.id = events.length + 1;
        setEvents([...events, event]);
    }

    const deleteEvent = (id: number) => {
        debugger;
        Axios.delete(url, {data: id}).then((res) => {
            console.log(res);
        });
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

    if (!events) return <span>loading...</span>;
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
                <div className="flex-large">
                    <EventTable onRefresh={refreshEvents} events={events} editEvent={editEvent}
                                deleteEvent={deleteEvent}/>
                </div>
            </div>
        </div>
    )
}

export default App;
