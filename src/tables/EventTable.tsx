import React, {useState} from 'react'
import {useTranslation} from "react-i18next";
import {IEvent} from "../interfaces/event";
import {EventTypes} from "../constants/constants";
import Modal from "../components/modal/modal";
import EventForm from "../forms/eventForm";
import PlayerForm from "../forms/playerForm";
import EditParticipantsForm from "../forms/editParticipantsForm";

interface EventTableProp {
    events: IEvent[];
    editEvent: (arg0: IEvent) => any;
    deleteEvent: (arg0: any) => any;
}

const EventTable = (props: EventTableProp) => {
    const {t, i18n} = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState<IEvent>();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
    const [showEditParticipants, setShowEditParticipants] = useState<boolean>(false);

    const onSave = () => {
    };

    const editEvent = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditForm(true);
    };

    const showFormModal = () => showUploadForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('player_form_title')}
        modalClosed={() => setShowUploadForm(false)}
        visible={showUploadForm}>
        <PlayerForm onSave={onSave} onCancel={onSave}/>
    </Modal> : null;

    const showEditFormModal = () => showEditForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_form_title')}
        modalClosed={() => setShowEditForm(false)}
        visible={showEditForm}>
        <PlayerForm onSave={onSave} onCancel={onSave}/>
    </Modal> : null;

    const showEditParticipantsModalAction = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditParticipants(true);
    }

    const showEditParticipantsModal = () => showEditParticipants ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_form_title')}
        modalClosed={() => setShowEditParticipants(false)}
        visible={showEditParticipants}>
        <EditParticipantsForm event={selectedEvent} onSave={onSave} onCancel={onSave}/>
    </Modal> : null;


    return (
        <>
            {showFormModal()}
            {showEditParticipantsModal()}
            {showEditFormModal()}
            <table>
                <thead>
                <tr>
                    <th>{t('name')}</th>
                    <th>{t('date')}</th>
                    <th>{t('price')}</th>
                    <th>{t('guest_extra_price')}</th>
                    <th>{t('type')}</th>
                    <th>{t('is_festival')}</th>
                    <th>{t('is_online')}</th>
                    <th>{t('is_active')}</th>
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
                                <td>{event.price}</td>
                                <td>{event.guest_extra_price}</td>
                                <td>{t(EventTypes[+event.event_type])}</td>
                                <td className={`${event.is_festival}-sign`}></td>
                                <td className={`${event.is_online}-sign`}></td>
                                <td className={`${event.is_active}-sign`}></td>
                                <td>
                                    <button
                                        onClick={() => editEvent(event)}
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
                                    {/*{event.has_registration_list}*/}
                                    <button
                                        onClick={() => showEditParticipantsModalAction(event)}
                                        className="button muted-button"
                                    >
                                        {t('edit_players')}
                                    </button>
                                    {event.has_registration_list && <button
                                        onClick={() => setShowUploadForm(true)}
                                        className="button muted-button"
                                    >
                                        {t('add_players')}
                                    </button>}
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
