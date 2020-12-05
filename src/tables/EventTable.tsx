import React, {useState} from 'react'
import {useTranslation} from "react-i18next";
import {IEvent} from "../interfaces/event";
import {EventTypes} from "../constants/constants";
import Modal from "../components/modal/modal";
import EventForm from "../forms/eventForm";

interface EventTableProp {
    events: IEvent[];
    editEvent: (arg0: IEvent) => any;
    deleteEvent: (arg0: any) => any;
}

const EventTable = (props: EventTableProp) => {
    const { t, i18n } = useTranslation();


    return (
        <>
        <table>
            <thead>
            <tr>
                <th>{t('name')}</th>
                <th>{t('date')}</th>
                <th>{t('type')}</th>
                <th>{t('actions')}</th>
            </tr>
            </thead>
            <tbody>
            {props.events.length > 0 ? (
                props.events.map(event => {
                    const isOverdue = new Date(event.date).getTime() < new Date().getTime();

                    return (<tr key={event.id} className={`${isOverdue ? 'red' : ''}`}>
                            <td>{event.name}</td>
                            <td>{event.date}</td>
                            <td>{t(EventTypes[+event.event_type])}</td>
                            <td>
                                <button
                                    onClick={() => {props.editEvent(event)}}
                                    className="button muted-button"
                                >
                                    {t('edit')}
                                </button>
                                <button
                                    onClick={() => props.deleteEvent(event.id)}
                                    className="button muted-button"
                                >
                                    {t('delete')}
                                </button>
                            </td>
                        </tr>)
                    }
                )
            ) : (
                <tr>
                    <td colSpan={3}>No Events</td>
                </tr>
            )}
            </tbody>
        </table>
    </>
    )
}

export default EventTable
