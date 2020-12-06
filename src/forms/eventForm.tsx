import React, {useState, useRef} from 'react';
import {useTranslation} from "react-i18next";
import DatePicker from "react-datepicker";
import {Editor} from "react-draft-wysiwyg";


import './eventForm.r.scss';


interface AddEventProp {
    onSave: () => void;
    onCancel: () => void;
}

const EventForm = (props: AddEventProp) => {
    const initialFormState = {
        id: null,
        name: '',
        description: '',
        event_type: '3',
        date: new Date(),
        is_festival: false,
        only_members_limit: false,

        has_rank_limit: false,
        min_rank_limit: 3,
        max_rank_limit: 78,

        max_participates_limit: 0,

        has_age_limit: false,
        min_age_limit: 6,
        max_age_limit: 80,

        has_registration_list: false,
        location: '',
        schedule: '',
        price: 0,
        guest_extra_price: 0,
        registration_deadline: new Date(),

        is_active: false,
        is_online: false

    };
    const [event, setEvent] = useState(initialFormState);
    const {t} = useTranslation();

    const handleInputChange = (e: any) => {
        const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
        const name = e.target.name;

        if (name === 'has_age_limit') {
            setEvent({...event, ['min_age_limit']: 0})
            setEvent({...event, ['max_age_limit']: 0})
        }
        setEvent({...event, [name]: value})
    };

    const handleEditorInputChange = (e: any) => {
        setEvent({...event, [e.name]: e.text})
    };

    return (
        <>
            <header></header>
            <main>
                <form>

                    <div className={'column col-right'}>
                        <label>  {t('name')}</label>
                        <input type="text" name="name" value={event.name} onChange={handleInputChange}/>

                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="is_festival" checked={event.is_festival}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('is_festival')}</label>
                        </div>

                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="has_registration_list"
                                   checked={event.has_registration_list}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('has_registration_list')}</label><br/>
                        </div>
                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="only_members_limit" checked={event.only_members_limit}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('only_members_limit')}</label>
                        </div>


                        <label>  {t('max_participates_limit')}</label>
                        <input type="number" name="max_participates_limit" value={event.max_participates_limit}
                               onChange={handleInputChange}/>

                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="has_age_limit" checked={event.has_age_limit}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('has_age_limit')}</label>
                        </div>

                        <label>  {t('min_age_limit')}</label>
                        <input type="number" name="min_age_limit" value={event.min_age_limit}
                               disabled={event.has_age_limit}
                               onChange={handleInputChange}/>

                        <label>  {t('max_age_limit')}</label>
                        <input type="number" name="max_age_limit" value={event.max_age_limit}
                               disabled={event.has_age_limit}
                               onChange={handleInputChange}/>

                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="has_rank_limit" checked={event.has_rank_limit}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('has_rank_limit')}</label>
                        </div>


                        <label>  {t('max_rank_limit')}</label>
                        <input type="number" name="max_rank_limit" value={event.max_rank_limit}
                               onChange={handleInputChange}/>

                        <label>  {t('min_rank_limit')}</label>
                        <input type="number" name="min_rank_limit" value={event.min_rank_limit}
                               onChange={handleInputChange}/>


                        <label>  {t('date')}</label>
                        <DatePicker selected={event.date} onChange={handleInputChange}/>
                        <label>  {t('registration_deadline')}</label>
                        <DatePicker selected={event.registration_deadline} onChange={handleInputChange}/>


                        <label>
                            {t('type')}
                            <select value={event.event_type} onChange={handleInputChange}>
                                <option value="0">{t('event_type_single')}</option>
                                <option value="1">{t('event_type_group')}</option>
                                <option value="2">{t('event_type_couple')}</option>
                                <option value="3">{t('event_type_event')}</option>
                            </select>
                        </label>

                    </div>
                    <div className={'column col-left'}>

                        <label>{t('location')} </label>
                        <input type="text" name="location" value={event.location} onChange={handleInputChange}/>


                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="is_active" checked={event.is_active}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('is_active')}</label>

                        </div>

                        <div className={'checkbox-wrapper'}>
                            <input type="checkbox" name="is_online" checked={event.is_online}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('is_online')}</label>
                        </div>

                        <label>{t('schedule')} </label>
                        <Editor
                            onChange={(e) => handleEditorInputChange({
                                text: e.blocks[0].text,
                                name: "schedule",
                                value: event.schedule
                            })}/>

                        <label>{t('description.title')} </label>
                        <Editor
                            onChange={(e) => handleEditorInputChange({
                                text: e.blocks[0].text,
                                name: "description",
                                value: event.description
                            })}/>


                    </div>
                </form>
            </main>

            <footer className="trb-holder align-right">
                <button type="button" className="button muted-button trb trb-secondary lt up"
                        onClick={() => props.onCancel()}>{t('save')}</button>
                <button type="button" className="button muted-button trb trb-primary lt up"
                        onClick={() => props.onSave()}>{t('cancel')}</button>
            </footer>


        </>

    )
}

export default EventForm;
