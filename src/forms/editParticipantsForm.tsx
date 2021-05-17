import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import Axios from "axios";
import {IPlayerParticipation} from "../interfaces/playerParticipation";
import {Table} from "react-bootstrap";
import EditableLabel from 'react-inline-editing';


interface EditParticipantsFormProps {
    event: any;
    onSave: () => void;
    onCancel: () => void;
}

const EditParticipantsForm = (props: EditParticipantsFormProps) => {
    /* eslint-disable */
    const url = 'https://main.bridge.co.il/payments/competitions' + '/participants' || '';
    const url2 = 'https://main.bridge.co.il/payments/payments_dev.php/competitions' + '/participants' || '';
    const {t, i18n} = useTranslation();
    const [players, setPlayers] = useState<IPlayerParticipation[]>([]);
    const [visible, setVisible] = useState<boolean[]>([]);
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [playerForm, setPlayerForm] = useState<any>([{bbo: '', name: '', number: ''}]);


    useEffect(() => {
        refreshPlayers()

    }, []);

    const refreshPlayers = () => {
        Axios.get(`${url}?eventType=${props.event.event_type}&event=${props.event.id}`).then((res) => {
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
        // setPlayerForm([{bbo:'', name:'', number:''}]);
        const index = 0;
        return (<tr>
            <td><input type="text" name={'number'} required placeholder={'מספר חבר'}
                       onChange={e => updateFieldChanged(index, e)} value={playerForm[0].number}/>
            </td>
            <td><input type="text" name={'name'} required placeholder={'שם'}
                       onChange={e => updateFieldChanged(index, e)} value={playerForm[0].name}/></td>
            <td><input type="text" name={'bbo'} placeholder={'bbo'} onChange={e => updateFieldChanged(index, e)}
                       value={playerForm[0].bbo}/></td>
            <td>
                <button onClick={onSaveRecord}>{t('שמירה')}</button>
            </td>

        </tr>);
    }

    const onSaveRecord = (e) => {
        e.preventDefault();
        console.log(playerForm);
        const req = {
            players: playerForm,
            event_id: props.event.id
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
        e.preventDefault();
        Axios.delete(`${url2}?player_id=${id}&event_type=${props.event.event_type}&state=${state === '1' ? '0' : '1'}`).then((res) => {
            alert('רישום עודכן');
            refreshPlayers();
        })
    }

    const _handleFocus = (id, text) => {
        console.log('Focused with text: ' + text);
    }

    const _handleFocusOut = (id, text) => {
        Axios.put(`${url2}?player_id=${id}`, {text}).then((res) => {
            alert('   רשומה עודכנה');
        })
    }

    return (
        <>
            <main>
                <button
                    onClick={() => setFormVisible(!formVisible)}>{t(!formVisible ? 'add_players_manual' : 'show_players_table')}</button>
                <form>
                    <Table className={'edit-players'}>
                        {!formVisible && <thead>
                        <tr>
                            <th>{t('participation_id')}</th>
                            <th>{t('registration_time')}</th>
                            <th>{t('notes')}</th>
                            <th>{t('number')}</th>
                            <th>{t('name')}</th>
                            <th>{t('bbo')}</th>
                            <th>{t('payment_amount')}</th>
                            <th>{t('canceled')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>}
                        <tbody>
                        {!formVisible && players?.map((p, index) => {
                            let indexTemp = 1;
                            console.log(p['player' + indexTemp + '_name']);
                            while (p['player' + indexTemp + '_name']) {
                                if (p['player' + indexTemp + '_name']) {
                                    return (<tr key={p.id} className={``}>
                                        <td>{p.id} </td>
                                        <td>{p.registration_time}</td>
                                        <td>

                                            <EditableLabel text={p.notes || ' none'}
                                                           labelClassName='myLabelClass'
                                                           inputClassName='myInputClass'
                                                           inputWidth='200px'
                                                           inputHeight='25px'
                                                           labelPlaceHolder={t('non_notes')}
                                                           inputMaxLength='50'
                                                           labelFontWeight='bold'
                                                           inputFontWeight='bold'
                                                           onFocus={(text) => _handleFocus(p.id, text)}
                                                           onFocusOut={(text) => _handleFocusOut(p.id, text)}
                                            />

                                        </td>
                                        <td>{p['player' + indexTemp + '_num']}</td>
                                        <td>{p['player' + indexTemp + '_name']}</td>
                                        <td>{p['player' + indexTemp + '_bbo']}</td>
                                        <td>{p.payment_amount}</td>
                                        <td>{p.is_canceled === '1' ? ' כן' : 'לא'}</td>
                                        <td>

                                            {p.is_canceled === '0' && <button
                                                onClick={(e) => onUpdateRecord(p.id, e, p.is_canceled)}>{t('cancel_registration')}</button>}
                                            {p.is_canceled === '1' && <button
                                                onClick={(e) => onUpdateRecord(p.id, e, p.is_canceled)}>{t('approve_registration')}</button>}
                                        </td>
                                    </tr>);
                                }
                                indexTemp++;
                            }
                        })}
                        {players.length === 0 && <tr>
                            <td>no players</td>
                        </tr>}
                        {formVisible && getPlayerForm()}
                        </tbody>
                    </Table>
                </form>
            </main>
        </>
    )
}
export default EditParticipantsForm;
