import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import EventTable from './tables/EventTable'
import Axios, {AxiosResponse} from "axios";
import {useTranslation} from "react-i18next";
import {IEvent} from "./interfaces/event";
import Modal from "./components/modal/modal";
import EventForm from "./forms/eventForm";
import "react-datepicker/dist/react-datepicker.css";
import "primeicons/primeicons.css"

const App = () => {
    require('dotenv').config();
    const url = process.env.REACT_APP_DOMAIN + '/events';
    const {t} = useTranslation();
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

    useEffect(() => {
        if(refreshEvents) {
            refreshEvents();
        }
    }, []);


    const refreshEvents = () => {
        Axios.get(url).then((res: AxiosResponse<any>) => {
            res.data.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            setEvents(res.data);
        })
    };

    const deleteEvent = (id: number) => {
        const approve = window.confirm("אתה עומד למחוק את התחרות " + id);
        if (approve === true) {
            Axios.delete(url, {data: id}).then((res) => {
                console.log(res);
            });
            setEvents(events.filter(user => user.id !== id));
        }


    };

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
            <a href={'http://main.bridge.co.il/payments/payments_dev.php/competitions/list'} rel="noreferrer" target="_blank">{t('show')}</a>
            <div className="flex-row">
                <div className="flex-large">
                    <EventTable onRefresh={refreshEvents} events={events}
                                deleteEvent={deleteEvent}/>
                </div>
            </div>
        </div>
    )
}

export default App;
