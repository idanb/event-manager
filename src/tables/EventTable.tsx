import React, {useState} from 'react'
import {useTranslation} from "react-i18next";
import {IEvent} from "../interfaces/event";
import {EventTypes} from "../constants/constants";
import Modal from "../components/modal/modal";
import EventForm from "../forms/eventForm";
import PlayerForm from "../forms/playerForm";
import EditParticipantsForm from "../forms/editParticipantsForm";
import moment from "moment";

interface EventTableProp {
    events: IEvent[];
    editEvent: (arg0: IEvent) => any;
    deleteEvent: (arg0: any) => any;
    onRefresh: () => any;
}

const EventTable = (props: EventTableProp) => {
    const {t} = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState<IEvent>();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
    const [showEditParticipants, setShowEditParticipants] = useState<boolean>(false);

    const onSave = () => {
        props.onRefresh();
        setShowEditForm(false);
    };
    const onCloseModal = () => {
        setShowEditForm(false);
    };

    const editEvent = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditForm(true);
    };

    const showFormModal = () => showUploadForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_players_title')}
        modalClosed={() => setShowUploadForm(false)}
        visible={showUploadForm}>
        <PlayerForm onSave={props.onRefresh} onCancel={onSave}/>
    </Modal> : null;

    const showEditFormModal = () => showEditForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_form_title')}
        modalClosed={() => setShowEditForm(false)}
        visible={showEditForm}>
        <EventForm onSave={onSave} onCancel={onCloseModal} event={selectedEvent}></EventForm>
    </Modal> : null;

    const showEditParticipantsModalAction = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditParticipants(true);
    }

    const showEditParticipantsModal = () => showEditParticipants ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_players_title')}
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
                    <th>{t('registration_deadline')}</th>
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
                        var now = new Date();
                        now.setHours(0,0,0,0);

                            const isOverdue = new Date(event.date) < now;

                            return (<tr key={event.id} className={`${isOverdue ? 'red' : ''}`}>
                                <td><a href={'' + process.env.REACT_APP_DOMAIN_DIRECT + 'event/' + event.id}
                                       target={'_blank'}>{event.name}</a></td>
                                <td className={'white-space'}>{moment(event.date).format('DD-MM-yyyy hh:mm').toString()}</td>
                                <td className={'white-space'}>{moment(event.registration_deadline).format('DD-MM-yyyy').toString()}</td>
                                <td className={'text-center'}>{event.price}</td>
                                <td className={'text-center'}>{event.guest_extra_price}</td>
                                <td className={'text-center'}>{t(EventTypes[+event.event_type])}</td>
                                <td className={`${event.is_festival === '1'}-sign`}></td>
                                <td className={`${event.is_online === '1'}-sign`}></td>
                                <td className={`${event.is_active === '1'}-sign`}></td>
                                <td className={'actions-cell'}>
                                    <button
                                        onClick={() => editEvent(event)}
                                        className="button muted-button">
                                        {t('edit')}
                                    </button>
                                    <button
                                        onClick={() => props.deleteEvent(event.id)}
                                        className="button muted-button">
                                        {t('delete')}
                                    </button>
                                    {/*{event.has_registration_list}*/}
                                    {event.event_type === '1' || event.event_type === '4' && <button
                                        onClick={() => showEditParticipantsModalAction(event)}
                                        className="button muted-button">
                                        {t('edit_players')}
                                    </button>}
                                    {event.event_type === '1' || event.event_type === '4' && event.has_registration_list === '1' && <button
                                        onClick={() => setShowUploadForm(true)}
                                        className="button muted-button">
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
