import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import Axios from "axios";
import {IPlayerParticipation} from "../interfaces/playerParticipation";
import {Table} from "react-bootstrap";
import EditableLabel from 'react-inline-editing';
import moment from "moment";
import {EventType, IEvent} from "../interfaces/event";
import isDev from "../helper";


interface EditParticipantsFormProps {
    event: IEvent;
    onSave: () => void;
    onCancel: () => void;
}

const EditParticipantsForm = (props: EditParticipantsFormProps) => {
    /* eslint-disable */
    const url2 = (isDev() ? process.env.REACT_APP_DOMAIN_LOCAL : process.env.REACT_APP_DOMAIN) + '/participants';
    const url1 = (isDev() ? process.env.REACT_APP_DOMAIN_LOCAL : process.env.REACT_APP_DOMAIN) + '/participantsExport';
    const {t, i18n} = useTranslation();
    const [players, setPlayers] = useState<IPlayerParticipation[]>([]);
    const [visible, setVisible] = useState<boolean[]>([]);
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [playerForm, setPlayerForm] = useState<any>([{bbo: '', name: '', number: ''}]);


    useEffect(() => {
        if (props.event.event_type === EventType.SINGLES || props.event.event_type === EventType.EVENT) {
            setPlayerForm([{bbo: '', name: '', number: ''}]);
        } else {
            setPlayerForm([{bbo: '', name: '', number: ''}, {bbo: '', name: '', number: ''}]);
        }
        refreshPlayers()

        window.addEventListener('keydown', function (e) {
            if (e.code == 'U+000A' || e.code == 'Enter' || e.keyCode == 13) {
                e.preventDefault();
                const test: HTMLElement | null = document.querySelector('#myButton');
                test?.focus();
                return false;
            }
        }, true);

    }, []);

    const refreshPlayers = () => {
        Axios.get(`${url2}?eventType=${props.event.event_type}&event=${props.event.id}`).then((res) => {
            if (res.data && res.data.length) {
                debugger;
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

        setPlayerForm(newArr); // ??
    }


    const getPlayerForm = () => {


        return playerForm.map((value, index) => <div className={'player-row'} key={index}>
            <tr>
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


            </tr>

        </div>)
    }

    const onSaveRecord = (e) => {
        e.preventDefault();
        console.log(playerForm);
        const req = {
            players: playerForm,
            event_id: props.event.id,
            event_type: props.event.event_type,
        }
        Axios
            .post(url2, req)
            .then(res => {
                props.onSave();
                setFormVisible(false);
                refreshPlayers();
            })
            .catch(err => alert('שמירה נכשלה'));
    }

    const onUpdateRecord = (id, e, state) => {
        if (e.code === 'Enter') {
            return;
        }
        e.preventDefault();
        Axios.delete(`${url2}?player_id=${id}&event_type=${props.event.event_type}&state=${state === '1' ? '0' : '1'}`).then((res) => {
            refreshPlayers();
        })
    }

    const _handleFocus = (id, text) => {
        console.log('Focused with text: ' + text);
    }

    const _handleFocusOut = (id, text) => {
        Axios.put(`${url2}?player_id=${id}&event_type=${props.event.event_type}`, {text}).then((res) => {
            refreshPlayers();

        })
    }


    const exportReport = (registerReport?) => {
        const isRegister = registerReport ? '&register_report=1' : '';
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        const todayStr = '_' + mm + dd + yyyy;

        Axios({
            url: `${url1}?event_type=${props.event.event_type}&event_id=${props.event.id}${isRegister}`,
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
                        onClick={() => setFormVisible(!formVisible)}>{t(!formVisible ? 'add_players_manual' : 'show_players_table')}</button>

                    {!formVisible && <button
                        className={'add-players-manual-btn button muted-button trb trb-secondary lt up'}
                        onClick={() => exportReport()}>{t('export_players')}</button>}

                    {!formVisible && props.event.has_registration_list && <button
                        className={'add-players-manual-btn button muted-button trb trb-secondary lt up'}
                        onClick={() => exportReport(1)}>{t('export_guests')}</button>}
                </div>
                <form onSubmit={e => {
                    e.preventDefault();
                }}>
                    <Table className={'edit-players'}>
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
                                    const isCancelled = p.is_canceled === '1' ? 'cancelled-row' : '';
                                    const isPaid = p.notes.includes('ידנית') ? 'paid-row' : '';
                                    arr.push(<tr key={p.id + '' + indexTemp}
                                                 className={`${isLast} ${isCancelled} ${isPaid}`}>
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
                                        <td>{p.payment_amount}</td>
                                        <td>{p.is_canceled === '1' ? ' כן' : 'לא'}</td>
                                        <td>{p.is_paid === '1' ? ' כן' : 'לא'}</td>
                                        <td>
                                            {indexTemp === 1 && <button
                                                onClick={(e) => onUpdateRecord(p.id, e, p.is_canceled)}>
                                                {t(p.is_canceled === '0' ? 'cancel_registration' : 'approve_registration')}
                                            </button>}
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
                        {formVisible && getPlayerForm()}
                        {formVisible && <td>
                            <button onClick={onSaveRecord}>{t('שמירה')}</button>
                        </td>}
                        </tbody>
                    </Table>
                </form>
            </main>
        </>
    )
}
export default EditParticipantsForm;
