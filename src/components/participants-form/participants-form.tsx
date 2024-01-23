import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import Axios, {AxiosResponse} from "axios";
import {IPlayerParticipation} from "../../interfaces/playerParticipation";
import {Dropdown, Table} from "react-bootstrap";
import EditableLabel from 'react-inline-editing';
import moment from "moment";
import {EventType, IEvent} from "../../interfaces/event";


interface ParticipantsFormProps {
    event: IEvent;
    onSave: () => void;
    onCancel: () => void;
}

const ParticipantsForm = ({event, onSave, onCancel}: ParticipantsFormProps) => {
    /* eslint-disable */
    const url2 = process.env.REACT_APP_DOMAIN  + '/participants';
    const url3 = process.env.REACT_APP_DOMAIN_DEV  + '/participants';
    const url1 = process.env.REACT_APP_DOMAIN + '/participantsExport';
    const url4 = process.env.REACT_APP_DOMAIN + '/participantsUpload' || '';
    const url5 = process.env.REACT_APP_DOMAIN + '/participantsApproval' || '';

    const {t} = useTranslation();
    const [players, setPlayers] = useState<IPlayerParticipation[]>([]);
    const [visible, setVisible] = useState<boolean[]>([]);
    const [recordFormMode, setRecordFormMode] = useState<string>('CREATE');
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [playerForm, setPlayerForm] = useState<any>([{bbo: '', name: '', number: ''}]);
    const [teamForm, setTeamForm] = useState<any>({name: '', number: ''});
    const [recordId, setRecordId] = useState<number>();


    useEffect(() => {
        setPlayerFormByCompType();
        refreshPlayers();
        setFormResponseOnKey()
    }, []);

    function setFormResponseOnKey(){
        window.addEventListener('keydown', function (e) {
            if (e.code == 'U+000A' || e.code == 'Enter' || e.keyCode == 13) {
                e.preventDefault();
                const test: HTMLElement | null = document.querySelector('#myButton');
                test?.focus();
                return false;
            }
        }, true);
    }
    function setPlayerFormByCompType(){
        if (event.event_type === EventType.SINGLES || event.event_type === EventType.EVENT) {
            setPlayerForm([{bbo: '', name: '', number: ''}]);
        } else if (event.event_type === EventType.COUPLES) {
            setPlayerForm([{bbo: '', name: '', number: ''}, {bbo: '', name: '', number: ''}]);
        } else {
            setPlayerForm([
                {bbo: '', name: '', number: ''},
                {bbo: '', name: '', number: ''},
                {bbo: '', name: '', number: ''},
                {bbo: '', name: '', number: ''},
                {bbo: '', name: '', number: ''},
                {bbo: '', name: '', number: ''}]);

        }
    }

    const refreshPlayers = () => {
        Axios.get(`${url2}?eventType=${event.event_type}&event=${event.id}`).then((res: AxiosResponse<any>) => {
            if (res.data && res.data.length) {
                setPlayers(res.data);
                const visibleArr: boolean[] = [];
                for (let i = 0; i < res.data.length; ++i) {
                    visibleArr[i] = false;
                }
                setVisible(visibleArr);
            }
        })
    }

    const updateFieldChanged = (index, e) => {
        console.log('index: ' + index);
        console.log('property name: ' + e.target.name);

        let newArr = [...playerForm]; // copying the old datas array
        newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to
        setPlayerForm(newArr);
    }


    const removeAll = (e) => {
        Axios.delete(url4 + '/' + event?.id + '/' + event?.event_type).then(res => {
            alert('כלל המשתתפים נמחקו');
        })
            .catch(err => alert('שמירה נכשלה'));
    }


    const getGroupForm = () => {
        console.log('teamForm', teamForm);
        return <tr>
            <td><input type="text" name={'team_name'} required placeholder={'שם קבוצה'}
                       onChange={e => setTeamForm({name: e.target.value, number: teamForm.number})}
                       value={teamForm.name} />

            </td>
            <td>
                <input type="text" name={'team_number'} placeholder={'מספר קבוצה'}
                       onChange={e => setTeamForm({number: e.target.value, name: teamForm.name})}
                       value={teamForm.number} />
            </td>



        </tr>
    }
    const getPlayerForm = () => {

        return playerForm.map((value, index) =>
            <tr className={'player-row'} key={index}>
                <td><input type="text" name={'number'} required placeholder={'מספר חבר'}
                           onChange={e => updateFieldChanged(index, e)}
                           value={playerForm[index].number} />
                </td>
                <td><input type="text" name={'name'} required placeholder={'שם'}
                           onChange={e => updateFieldChanged(index, e)}
                           value={playerForm[index].name} />
                </td>
                <td><input type="text" name={'bbo'} placeholder={'bbo'}
                           onChange={e => updateFieldChanged(index, e)}
                           value={playerForm[index].bbo} /></td>
            </tr>)
    }

    const onSaveRecord = (e) => {
        e.preventDefault();
        const req = {
            players: playerForm,
            team: teamForm,
            event_id: event.id,
            event_type: event.event_type,
            recordFormMode,
            recordId
        }
        if(recordFormMode === 'CREATE') {
            Axios
                .post(url3, req)
                .then(res => {
                    onSave();
                    setFormVisible(false);
                    refreshPlayers();
                })
                .catch(err => alert('שמירה נכשלה'));
        } else {
            Axios
                .put(url3, req)
                .then(res => {
                    onSave();
                    setFormVisible(false);
                    refreshPlayers();
                })
                .catch(err => alert('שמירה נכשלה'));
        }
    }

    const onUpdateRecord = (id, e, state) => {
        if (e.code === 'Enter') {
            return;
        }
        e.preventDefault();
        Axios.delete(`${url2}?player_id=${id}&event_type=${event.event_type}&state=${state === '1' ? '0' : '1'}`).then((res) => {
            refreshPlayers();
        })
    }

    const onRemoveRecord = (id, e) => {
        if (e.code === 'Enter') {
            return;
        }
        e.preventDefault();

        const approve = window.confirm("אתה עומד למחוק את הרשומה " + id);
        if (approve === true) {
            Axios.delete(`${url2}?player_id=${id}&event_type=${event.event_type}&delete=true`).then((res) => {
                refreshPlayers();
            })
        }
    }

    const onSendApproval = (id, e) => {
        if (e.code === 'Enter') {
            return;
        }
        e.preventDefault();

        const approve = window.confirm("אתה עומד לשלוח אישור הרשמה למשתתפים המקושרים לרשומה " + id);
        if (approve === true) {
            Axios.get(`${url5}?player_id=${id}&event_type=${event.event_type}&event_id=${event.id}`).then((res) => {
                alert('אישור נשלח בהצלחה');
            })
        }
    }
    const onEditRecord = (id, e) => {
        setRecordFormMode('EDIT');
        setRecordId(id)
        const record = players.find((p) => p.id === id);
        const res: unknown[] = []
        for(let i =1; i < 7; i++){
            if(record && record['player'+i+'_num'] == 0 ){
                record['player'+i+'_num'] = '';
            }
            res.push({
                    bbo: record && record['player'+i+'_bbo'] || '',
                    name: record && record['player'+i+'_name'] || '',
                    number: record && record['player'+i+'_num']
                });

            }
        if(record && record?.team_number == 0 ){
            record.team_number = undefined;
        }

        setTeamForm({number: record?.team_number, name: record?.team_name || ''});
        setPlayerForm(res)
        if (e.code === 'Enter') {
            return;
        }
        e.preventDefault();
        setFormVisible(!formVisible);
    }

    const _handleFocus = (id, text) => {
        console.log('Focused with text: ' + text);
    }

    const _handleFocusOut = (id, text) => {
        Axios.put(`${url2}?player_id=${id}&event_type=${event.event_type}`, {text}).then((res) => {
            refreshPlayers();

        })
    }

    const addRecordManual = () => {
        setPlayerFormByCompType();
        setRecordFormMode('CREATE');
        setFormVisible(!formVisible)
    }


    const exportReport = (registerReport?) => {
        const isRegister = registerReport ? '&register_report=1' : '';
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        const todayStr = '_' + mm + dd + yyyy;

        Axios({
            url: `${url1}?event_type=${event.event_type}&event_id=${event.id}${isRegister}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', isRegister ? `זכאים${todayStr}.xlsx` : `רשומים${todayStr}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
    }

    return (
        <>
            <main>
                <div className={'btn-wrapper'}>
                    <button
                        id={'myButton'}
                        className={'add-players-manual-btn button muted-button trb trb-secondary lt up'}
                        onClick={addRecordManual}>
                        {t(!formVisible ? 'add_players_manual' : 'show_players_table')}</button>

                    {!formVisible && <button
                        className={'add-players-manual-btn button muted-button trb trb-secondary lt up'}
                        onClick={() => exportReport()}>{t('export_players')}</button>}

                    {!formVisible && event.has_registration_list === '1' && <button
                        className={'add-players-manual-btn button muted-button trb trb-secondary lt up'}
                        onClick={() => exportReport(1)}>{t('export_guests')}</button>}

                </div>
                <form onSubmit={e => {
                    e.preventDefault();
                }}>
                    <Table className={`edit-players ${formVisible ? 'add-players-form' : ''}`}>
                        {!formVisible && <thead>
                        <tr>
                            <th>{t('participation_id')}</th>
                            <th>{t('registration_time')}</th>
                            <th>{t('notes')}<i className="fa fa-pencil-square-o"></i></th>
                            <th>{t('number')}</th>
                            <th>{t('name')}</th>
                            <th>{t('bbo')}</th>
                            <th>{t('payment_amount')}</th>
                            <th>{t('canceled')}</th>
                            <th>{t('is_paid')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>}
                        <tbody>
                        {!formVisible && players?.map((p, index) => {
                            let indexTemp = 1;
                            const arr: JSX.Element[] = [];
                            while (p['player' + indexTemp + '_name']) {
                                if (p['player' + indexTemp + '_name']) {
                                    const isLast = p['player' + (indexTemp + 1) + '_name'] ? '' : 'last-row';
                                    const isCancelled = p.is_paid === '0' && p.is_canceled === '1' ? 'cancelled-row' : '';
                                    const isPaid = p.is_paid === '1' && p.is_canceled === '0' ? 'paid-row' : '';
                                    const isRetaired = p.is_paid === '1' && p.is_canceled === '1' ? 'retiared-row' : '';
                                    arr.push(<tr key={p.id + '' + indexTemp}
                                                 className={`${isLast} ${isCancelled} ${isPaid} ${isRetaired}`}>
                                        <td>{p.id} </td>
                                        <td>{moment(p.registration_time).format('DD-MM-yyyy').toString()}</td>
                                        <td className={'hover-td'}>

                                            {indexTemp === 1 &&
                                            <EditableLabel text={p.notes || t('non_notes')}
                                                           labelClassName='myLabelClass'
                                                           inputClassName='myInputClass'
                                                           inputWidth='200px'
                                                           inputHeight='25px'
                                                           labelPlaceHolder={t('non_notes')}
                                                           inputMaxLength={50}
                                                           labelFontWeight='bold'
                                                           inputFontWeight='bold'
                                                           onFocus={(text) => _handleFocus(p.id, text)}
                                                           onFocusOut={(text) => _handleFocusOut(p.id, text)}
                                            />}
                                            {
                                                indexTemp !== 1 && <span>{p.notes}</span>
                                            }

                                        </td>
                                        <td>{p['player' + indexTemp + '_num']}</td>
                                        <td>{p['player' + indexTemp + '_name']}</td>
                                        <td>{p['player' + indexTemp + '_bbo']}</td>
                                        <td>{indexTemp === 1 && p.payment_amount}</td>
                                        <td>{p.is_canceled === '1' ? ' כן' : 'לא'}</td>
                                        <td>{p.is_paid === '1' ? ' כן' : 'לא'}</td>
                                        <td>
                                            {indexTemp === 1 && <>
                                                <button
                                                className="button muted-button"
                                                onClick={(e) => onUpdateRecord(p.id, e, p.is_canceled)}>
                                                {t(p.is_canceled === '0' ? 'cancel_registration' : 'approve_registration')}
                                            </button>

                                                <button
                                                    className="button muted-button"
                                                    onClick={(e) => onEditRecord(p.id, e)}>
                                                    {t( 'edit_record')}
                                                </button>
                                            </>
                                            }

                                            {indexTemp === 1 && <Dropdown className="d-inline mx-2 inline-block">
                                                <Dropdown.Toggle id="dropdown-autoclose-true" className={'btn-flat'}>
                                                    פעולות נוספות
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>

                                                    <Dropdown.Item
                                                        onClick={(e) => onSendApproval(p.id, e)}>
                                                        {t( 'send_registration')}
                                                    </Dropdown.Item>

                                                    <Dropdown.Item
                                                        onClick={(e) => onRemoveRecord(p.id, e)}>
                                                        {t( 'remove_registration')}
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>}
                                        </td>
                                    </tr>);
                                }
                                indexTemp++;
                            }
                            return arr;
                        })}
                        {!formVisible && players?.length === 0 && <tr>
                            <td>{t('no_players')}</td>
                        </tr>}
                        {formVisible && event.event_type === EventType.GROUPS && getGroupForm()}
                        {formVisible && getPlayerForm()}
                        {formVisible && <tr>
                            <td><button className="button muted-button" onClick={onSaveRecord}>{t('save')}</button></td>

                        </tr>}
                        </tbody>
                    </Table>
                </form>
            </main>
        </>
    )
}
export default ParticipantsForm;
