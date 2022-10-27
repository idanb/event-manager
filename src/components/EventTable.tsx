import React, {useState} from 'react'
import {useTranslation} from "react-i18next";
import {EventType, IEvent} from "../interfaces/event";
import {EventTypes} from "../constants/constants";
import Modal from "./modal/modal";
import EventForm from "./forms/eventForm";
import UploadPlayersForm from "./forms/uploadPlayersForm";
import EditParticipantsForm from "./forms/editParticipantsForm";
import moment from "moment";
import {Dropdown, OverlayTrigger, Tooltip} from "react-bootstrap";

interface EventTableProp {
    events: IEvent[];
    deleteEvent: (arg0: any) => any;
    onRefresh: () => any;
}

const EventTable = (props: EventTableProp) => {
    const {t} = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState<IEvent>();
    const [formMode, setFormMode] = useState<string>();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
    const [showEditParticipants, setShowEditParticipants] = useState<boolean>(false);
    const [filter, setFilter] = useState('');


    const onClose = () => {
        props.onRefresh();
        setShowEditParticipants(false)
    }

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
        setFormMode('EDIT');
    };

    const duplicate = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditForm(true);
        setFormMode('DUPLICATE');
    };

    const showFormModal = () => showUploadForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('player_form_title')}
        modalClosed={() => setShowUploadForm(false)}
        visible={showUploadForm}>
        <UploadPlayersForm onSave={() => setShowUploadForm(false)} onCancel={onSave}
                           event={selectedEvent} />
    </Modal> : null;

    const showEditFormModal = () => showEditForm ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t(formMode === 'EDIT' ? 'edit_form_title' : 'duplicate_form_title')}
        modalClosed={() => setShowEditForm(false)}
        visible={showEditForm}>
        <EventForm onSave={onSave} onCancel={onCloseModal} event={selectedEvent} mode={formMode}></EventForm>
    </Modal> : null;

    const showEditParticipantsModalAction = (event: IEvent) => {
        setSelectedEvent(event);
        setShowEditParticipants(true);
    }

    const showEditParticipantsModal = () => showEditParticipants ? <Modal
        className='ic-modal'
        width={"80%"}
        title={t('edit_players_title') + ' - ' + selectedEvent?.name}
        modalClosed={onClose}
        visible={showEditParticipants}>
        {selectedEvent &&
        <EditParticipantsForm event={selectedEvent} onSave={onSave} onCancel={onSave} />}
    </Modal> : null;




    return (
        <>
            {showFormModal()}
            {showEditParticipantsModal()}
            {showEditFormModal()}
            <input id="filter"
                   name="filter"
                   type="text"
                   placeholder='הקלד שם ארוע לסינון'
                   value={filter}
                   onChange={event => setFilter(event.target.value)}
            />
            <table>
                <thead>
                <tr>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('date')}</th>
                    <th>{t('registration_deadline')}</th>
                    <th>{t('players_count')}</th>
                    <th>{t('price')}</th>
                    <th>{t('guest_extra_price')}</th>
                    <th>{t('type')}</th>
                    <th>{t('is_festival_short')}</th>
                    <th>{t('is_online')}</th>
                    <th>{t('is_active')}</th>
                    <th>{t('actions')}</th>
                </tr>
                </thead>
                <tbody>
                {props.events.length > 0 ? (
                    props.events.filter(event => event.name.includes(filter)).map(event => {
                            const has_register = [EventType.SINGLES, EventType.EVENT, EventType.COUPLES, EventType.GROUPS].includes(event.event_type) &&
                            event.has_registration_list === '1';
                            const now = new Date();
                            now.setHours(0, 0, 0, 0);

                            const isOverdue = new Date(event.date) < now;

                            return (<tr key={event.id}>
                                <td className={'text-center'}>{event.id}</td>

                                <td>
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={<Tooltip id="tooltip-disabled">{event.name}</Tooltip>}>
                                    <a href={'' + process.env.REACT_APP_DOMAIN + '/event/' + event.id}
                                        className={`no-wrap ${isOverdue ? 'red' : ''}`}
                                        target={'_blank'}>{event.name}</a>
                                    </OverlayTrigger>


                                </td>
                                <td className={'white-space'}>{moment(event.date).format('DD-MM-yyyy hh:mm').toString()}</td>
                                <td className={'white-space'}>{moment(event.registration_deadline).format('DD-MM-yyyy').toString()}</td>
                                <td className={'text-center'}>{ has_register ?  event.registers_count + ' / ' : '' }{event.players_count} </td>
                                <td className={'text-center'}>{event.price}</td>
                                <td className={'text-center'}>{event.guest_extra_price}</td>
                                <td className={'text-center'}>{t(EventTypes[+event.event_type])}</td>
                                <td className={`${event.is_festival === '1'}-sign`}></td>
                                <td className={`${event.is_online === '1'}-sign`}></td>
                                <td className={`${event.is_active === '1'}-sign`}></td>
                                <td className={'actions-cell'}>
                                    <div>
                                    <button
                                        onClick={() => editEvent(event)}
                                        className="button muted-button">
                                        {t('edit')}
                                    </button>

                                    {[EventType.SINGLES, EventType.EVENT, EventType.COUPLES, EventType.GROUPS].includes(event.event_type) &&
                                    <button
                                        onClick={() => showEditParticipantsModalAction(event)}
                                        className="button muted-button">
                                        {t('edit_players')}
                                    </button>}
                                    {has_register &&
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setShowUploadForm(true)
                                        }}
                                        className="button muted-button">
                                        {t('add_players')}
                                    </button>}
                                    </div>

                                    <Dropdown className="d-inline mx-2">
                                        <Dropdown.Toggle id="dropdown-autoclose-true" className={'btn-flat'}>
                                            פעולות נוספות
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => duplicate(event)}>{t('duplicate')}</Dropdown.Item>
                                            <Dropdown.Item onClick={() => props.deleteEvent(event.id)}>{t('delete')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
