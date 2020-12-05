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
        console.log(e);
        const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
        const name = e.target.name;

        if (name === 'has_age_limit') {
            setEvent({...event, ['min_age_limit']: 0})
            setEvent({...event, ['max_age_limit']: 0})
        }


        setEvent({...event, [name]: value})
    }

    const handleEditorInputChange = (e: any) => {
        const value = e.blocks[0].text;
        console.log(value);
        const name = e.blocks[0].key === "eocc3" ? "schedule" : "username";
        setEvent({...event, [name]: value})
    }

    return (
        <>
            <header></header>
            <main>
                <form>

                    <div>

                        <label>  {t('name')}</label>
                        <input type="text" name="name" value={event.name} onChange={handleInputChange}/>

                        <ul style={{marginBottom: 50}}>

                            <input type="checkbox" name="is_festival" checked={event.is_festival}
                                   onChange={handleInputChange}/>
                            <label className={'checkbox'}>  {t('is_festival')}</label>

                            <ul style={{float: "left", textAlign: "center", marginLeft: 15}}>
                                <input type="checkbox" name="has_registration_list"
                                       checked={event.has_registration_list}
                                       onChange={handleInputChange}/>
                                <label className={'checkbox'}>  {t('has_registration_list')}</label><br/>


                                <input type="checkbox" name="only_members_limit" checked={event.only_members_limit}
                                       onChange={handleInputChange}/>
                                <label className={'checkbox'}>  {t('only_members_limit')}</label>
                            </ul>

                        </ul>


                        <label>  {t('max_participates_limit')}</label>
                        <input type="number" name="max_participates_limit" value={event.max_participates_limit}
                               onChange={handleInputChange}/>


                        <input type="checkbox" name="has_age_limit" checked={event.has_age_limit}
                               onChange={handleInputChange}/>
                        <label className={'checkbox'}>  {t('has_age_limit')}</label>

                        <label>  {t('max_age_limit')}</label>
                        <input type="number" name="max_age_limit" value={event.max_age_limit}
                               disabled={event.has_age_limit}
                               onChange={handleInputChange}/>

                        <label>  {t('min_age_limit')}</label>
                        <input type="number" name="min_age_limit" value={event.min_age_limit}
                               disabled={event.has_age_limit}
                               onChange={handleInputChange}/>


                        <input type="checkbox" name="has_rank_limit" checked={event.has_rank_limit}
                               onChange={handleInputChange}/>
                        <label className={'checkbox'}>  {t('has_rank_limit')}</label>


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


                    <div>
                        <label>{t('location')} </label>
                        <input type="text" name="location" value={event.location} onChange={handleInputChange}/>

                        <input type="checkbox" name="is_active" checked={event.is_active}
                               onChange={handleInputChange}/>
                        <label className={'checkbox'}>  {t('is_active')}</label>


                        <input type="checkbox" name="is_online" checked={event.is_online}
                               onChange={handleInputChange}/>
                        <label className={'checkbox'}>  {t('is_online')}</label>

                        <label>{t('schedule')} </label>
                        {/* <input type="text" name="schedule" value={event.schedule} onChange={handleInputChange}/> */}

                        <Editor editorStyle={{backgroundColor: "gray"}} wrapperStyle={{height: "30%"}}
                                onChange={handleEditorInputChange}/> <br/> <br/><br/><br/><br/>

                        <label>{t('description.title')} </label>
                        {/* <input type="text" name="username" value={event.description} onChange={handleInputChange}/> */}
                        <Editor editorStyle={{backgroundColor: "gray"}} wrapperStyle={{height: "30%"}}
                                onChange={handleEditorInputChange}/>

                    </div>
                </form>
            </main>

            <footer className="trb-holder align-right">
                <button type="button" className="trb trb-secondary lt up"
                        onClick={() => props.onCancel()}>{t('save')}</button>
                <button type="button" className="trb trb-primary lt up"
                        onClick={() => props.onSave()}>{t('cancel')}</button>
            </footer>


        </>

    )
}

export default EventForm;
