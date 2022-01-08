import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import DatePicker from "react-datepicker";
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import './eventForm.r.scss';
import {IEvent} from "../interfaces/event";
import {map, isUndefined} from 'lodash';
import axios from 'axios';
import {stateFromHTML} from 'draft-js-import-html';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


interface EventFormProp {
    onSave: () => void;
    onCancel: () => void;
    event?: IEvent;
}

const EventForm = (props: EventFormProp) => {
    const url = process.env.REACT_APP_DOMAIN + '/events';
    const initialFormState = {
        name: props.event?.name || '',
        event_type: props.event?.event_type || '2',
        date: props.event?.date ? new Date(props.event?.date) : new Date(),
        is_festival: props.event?.is_festival === '1',
        only_members_limit: props.event?.only_members_limit === '1',

        gender_limit: props.event?.gender_limit || 0,

        has_rank_limit: props.event?.has_rank_limit === '1',
        min_rank_limit: props.event?.min_rank_limit || 3,
        max_rank_limit: props.event?.max_rank_limit || 78,

        max_participates_limit: props.event?.max_participates_limit || 0,

        has_age_limit: props.event?.has_age_limit === '1',
        min_age_limit: props.event?.min_age_limit || 6,
        max_age_limit: props.event?.max_age_limit || 80,

        has_registration_list: props.event?.has_registration_list === '1',
        regulations_file_link: props.event?.regulations_file_link || '',
        description: props.event?.description || '',

        location: props.event?.location || '',
        schedule: props.event?.schedule,
        price: props.event?.price || 0,
        guest_extra_price: props.event?.guest_extra_price || 0,
        registration_deadline: props.event?.registration_deadline ? new Date(props.event?.registration_deadline) : new Date(),

        is_active: props.event?.is_active === '1',
        is_online: props.event?.is_online === '1'

    };
    const [eventForm, setEventForm] = useState<any>(initialFormState);
    const [titles, setTitles] = useState<any>([]);

    const { contentBlocks, entityMap } = htmlToDraft(props.event?.description);
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    const [descriptionState, setDescriptionState] = useState(editorState);

    let contentState1 = stateFromHTML(props.event?.schedule || '');
    const [scheduleState, setScheduleState] = useState(EditorState.createWithContent(contentState1));


    const {t} = useTranslation();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        getTitles();
        if (props.event?.date) {
            setStartDate(eventForm.date);
            setEndDate(eventForm.registration_deadline);
        }
    }, []);

    const getTitles = () => {
        axios.get(process.env.REACT_APP_DOMAIN + '/titles').then((res) => {
            setTitles(res.data);
        })
    }


    const handleInputChange = (e: any) => {
        const value = e.target?.type === 'checkbox' ? e.target.checked : (e.target?.value || e.value);
        const name = e.target?.name || e.name;
        setEventForm({...eventForm, [name]: value})
    };

    const onScheduleStateChange = (state) => {
        setScheduleState(state);
    };
    const onDescriptionStateChange = (state) => {
        setDescriptionState(state);
    };

    const getFormValues = (elements) => {
        const values = {};
        map(elements, (element, index) => {
            switch (element.type) {
                case 'checkbox':
                    values[element.name] = element.checked ? '1' : '0';
                    break;
                case 'number':
                case 'text':
                case 'select-one':
                    values[element.name] = element.value;
                    break;
            }
        });
        values['date'] = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');
        values['registration_deadline'] = endDate.toISOString().slice(0, 19).replace('T', ' ');
        values['description'] = draftToHtml(convertToRaw(descriptionState.getCurrentContent()));
        values['schedule'] = draftToHtml(convertToRaw(scheduleState.getCurrentContent()));
        console.log(values);
        return values;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const eventFormTemp = getFormValues(e.target.elements);
        if (props.event) {
            const id = props.event?.id;
            eventFormTemp['id'] = id;
            axios
                .put(url, eventFormTemp)
                .then(res => {
                    props.onSave();
                })
                .catch(err => alert('שמירה נכשלה'));
        } else {
            axios
                .post(url, eventFormTemp)
                .then(res => {
                    props.onSave();
                })
                .catch(err => alert('שמירה נכשלה'));
        }
    };

    console.log('eventForm: %o ', eventForm);
    return (
        <>
            <header></header>
            <main>
                <form onSubmit={handleSubmit}>
                    <div className={'btn-wrapper'}>
                        <button type="submit"
                                className="button muted-button trb trb-secondary lt up"
                        >{t('save')}</button>
                        <button type="button" className="button muted-button trb trb-primary lt up"
                                onClick={props.onCancel}>{t('cancel')}</button>
                    </div>
                    <div className={'flex overflow-y'}>
                        <div className={'column col-right'}>

                            <div className={'short-input'}>
                                <label>
                                    {t('type')}
                                </label>
                                <select name="event_type" value={eventForm.event_type}
                                        onChange={handleInputChange}
                                        disabled={!isUndefined(props.event?.id)}>
                                    <option value="1">{t('event_type_single')}</option>
                                    <option value="2">{t('event_type_couple')}</option>
                                    <option value="3">{t('event_type_group')}</option>
                                    <option value="4">{t('event_type_event')}</option>
                                </select>
                            </div>

                            <div className={'short-input'}>
                                <label>{t('location')} </label>
                                <input type="text" name="location" value={eventForm.location}
                                       onChange={handleInputChange} />
                            </div>

                            <label>  {t('name')}</label>
                            <input className={'name-input'} type="text" name="name"
                                   value={eventForm.name || ''}
                                   onChange={handleInputChange} />

                            <div className={'short-input'}>
                                <label>  {t('date')}</label>
                                <DatePicker selected={eventForm.date}
                                            showTimeSelect
                                            dateFormat="dd/MM/yyyy h:mm aa"
                                            name={'date'}
                                            onChange={(e: Date) => {
                                                handleInputChange({
                                                    name: "date",
                                                    value: e
                                                });
                                                setStartDate(e);
                                            }} />
                            </div>

                            <div className={'short-input'}>
                                <label>  {t('registration_deadline')}</label>
                                <DatePicker selected={eventForm.registration_deadline}
                                            dateFormat="dd/MM/yyyy"
                                            name={'registration_deadline'}
                                            onChange={(e: Date) => {
                                                handleInputChange({
                                                    name: "registration_deadline",
                                                    value: e
                                                });
                                                setEndDate(e);
                                            }} />
                            </div>


                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="is_festival"
                                       disabled={eventForm.event_type === '4'}
                                       checked={eventForm.is_festival && eventForm.event_type !== "4"}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('is_festival')}</label>
                            </div>

                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="has_registration_list"
                                       checked={eventForm.has_registration_list}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('has_registration_list')}</label><br />
                            </div>

                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="only_members_limit"
                                       checked={eventForm.only_members_limit}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('only_members_limit')}</label>
                            </div>

                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="is_active"
                                       checked={eventForm.is_active}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('is_active')}</label>
                            </div>

                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="is_online"
                                       checked={eventForm.is_online}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('is_online')}</label>
                            </div>

                            <div className={'short-input'}>

                                <label>  {t('price')}</label>
                                <input type="number" name="price" value={eventForm.price}
                                       className={'price-input'}
                                       onChange={handleInputChange} />
                                ש״ח
                            </div>

                            <div className={'short-input'}>

                                <label>  {t('guest_extra_price')}</label>
                                <input type="number" name="guest_extra_price"
                                       value={eventForm.guest_extra_price}
                                       className={`price-input ${eventForm.only_members_limit ? 'disabled' : ''}`}
                                       disabled={eventForm.only_members_limit}
                                       onChange={handleInputChange} />
                                ש״ח
                            </div>

                            <h4>{t('limitations')}</h4>

                            <div className={'short-input'}>
                                <label>
                                    {t('gender_limit')}
                                </label>
                                <select name="gender_limit" value={eventForm.gender_limit}
                                        onChange={handleInputChange}>
                                    <option
                                        value="0">{t('gender_limit_options.no_limited')}</option>
                                    <option value="1">{t('gender_limit_options.only_man')}</option>
                                    <option
                                        value="2">{t('gender_limit_options.only_women')}</option>
                                    <option
                                        value="3">{t('gender_limit_options.only_couples')}</option>
                                </select>
                            </div>

                            <div className={'short-input'}>
                                <label>  {t('max_participates_limit')}</label>
                                <input type="number" name="max_participates_limit"
                                       value={eventForm.max_participates_limit}
                                       onChange={handleInputChange} />
                            </div>


                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="has_age_limit"
                                       checked={eventForm.has_age_limit}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('has_age_limit')}</label>
                            </div>
                            <div className={'short-input'}>
                                <label>  {t('min_age_limit')}</label>
                                <input type="number" name="min_age_limit"
                                       value={eventForm.min_age_limit}
                                       className={`${eventForm.has_age_limit ? '' : 'disabled'}`}
                                       disabled={!eventForm.has_age_limit}
                                       onChange={handleInputChange} />
                            </div>
                            <div className={'short-input'}>
                                <label>  {t('max_age_limit')}</label>
                                <input type="number" name="max_age_limit"
                                       value={eventForm.max_age_limit}
                                       className={`${eventForm.has_age_limit ? '' : 'disabled'}`}
                                       disabled={!eventForm.has_age_limit}
                                       onChange={handleInputChange} />
                            </div>

                            <div className={'checkbox-wrapper'}>
                                <input type="checkbox" name="has_rank_limit"
                                       checked={eventForm.has_rank_limit}
                                       onChange={handleInputChange} />
                                <label className={'checkbox'}>  {t('has_rank_limit')}</label>
                            </div>

                            <div className={'short-input'}>
                                <label>  {t('min_rank_limit')}</label>
                                <select name="min_rank_limit" value={eventForm.min_rank_limit}
                                        className={`${eventForm.has_rank_limit ? '' : 'disabled'}`}
                                        disabled={!eventForm.has_rank_limit}
                                        onChange={handleInputChange}>
                                    {titles.map((t) => <option
                                        value={t.value}>{t.hebrew_name}</option>
                                    )}
                                </select>
                            </div>

                            <div className={'short-input'}>
                                <label>  {t('max_rank_limit')}</label>
                                <select name="max_rank_limit" value={eventForm.max_rank_limit}
                                        className={`${eventForm.has_rank_limit ? '' : 'disabled'}`}
                                        disabled={!eventForm.has_rank_limit}
                                        onChange={handleInputChange}>
                                    {titles.map((t) => <option
                                        value={t.value}>{t.hebrew_name}</option>
                                    )}
                                </select>

                            </div>

                        </div>
                        <div className={'column col-left'}>

                            <label>{t('description.title')} </label>
                            <Editor
                                editorState={descriptionState}
                                onEditorStateChange={onDescriptionStateChange} />


                            <label>{t('schedule')} </label>
                            <Editor
                                editorState={scheduleState}
                                onEditorStateChange={onScheduleStateChange} />


                            <label>  {t('regulations_file_link')}</label>
                            <input type="text" name="regulations_file_link"
                                   value={eventForm.regulations_file_link}
                                   onChange={handleInputChange} />

                        </div>
                    </div>
                </form>
            </main>

            <footer className="trb-holder align-right">
            </footer>
        </>

    )
}

export default EventForm;
