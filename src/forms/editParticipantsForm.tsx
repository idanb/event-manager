import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import Axios from "axios";
import {IPlayerParticipation} from "../interfaces/playerParticipation";

import {Table} from "react-bootstrap";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// To make rows collapsible
import "bootstrap/js/src/collapse.js";

interface EditParticipantsFormProps {
    event: any;
    onSave: () => void;
    onCancel: () => void;
}

const EditParticipantsForm = (props: EditParticipantsFormProps) => {

    var url = 'http://local.bridge.co.il/payments/competitions/participants';
    const {t, i18n} = useTranslation();
    const [players, setPlayers] = useState<IPlayerParticipation[]>([]);


    useEffect(() => {

        Axios.get(`${url}?eventType=${props.event.event_type}&event=${props.event.id}`).then((res) => {
            if (res.data && res.data.length) {
                setPlayers(res.data);
            }
        })

        // id: number | string;
        // event_id: number;
        // registration_time: string;
        // event_type: string;
        // is_festival: boolean | string;
        // status: boolean | string;
        // player1_id: string;
        // player1_name: string;
        // player1_bbo: string;
        // player2_id: string;
        // player2_name: string;
        // player2_bbo: string;
        // photo_approval: boolean;
        // payment_amount: number;
        // notes: string;
        // receipt: string;

    }, [])
    return (
        <>
            <main>
                <form>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>{t('participation_id')}</th>
                            <th>{t('registration_time')}</th>
                            <th>{t('payment_amount')}</th>
                            <th>{t('notes')}</th>
                            <th>{t('receipt')}</th>
                            <th>{t('payment_amount')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players?.map((p) => {
                            return (<>
                                    <tr key={p.id} className={``}
                                        data-toggle="collapse"
                                        data-target={`.multi-collapse${p.id}`}
                                        aria-controls={`multiCollapse${p.id}`}>
                                        <td>{p.id}</td>
                                        <td>{p.registration_time}</td>
                                        <td>{p.payment_amount}</td>
                                        <td>{p.notes}</td>
                                        <td>{p.receipt}</td>
                                        <td>{p.payment_amount}</td>
                                        <td>{t('press_to_show')}</td>
                                    </tr>
                                    <tr className={`collapse multi-collapse${p.id}`}
                                        id={`multiCollapse${p.id}`}>
                                        <td>{p.player1_id}</td>
                                        <td>{p.player1_name}</td>
                                        <td>{p.player1_bbo}</td>
                                    </tr>
                                </>
                            );
                        })}
                        {players.length === 0 && <span>אין משתתפים</span>}
                        </tbody>
                    </Table>
                </form>
            </main>

            {/*<Table striped bordered hover>*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*        <th>#</th>*/}
            {/*        <th>Name</th>*/}
            {/*        <th>Email</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    <tr*/}
            {/*        data-toggle="collapse"*/}
            {/*        data-target=".multi-collapse1"*/}
            {/*        aria-controls="multiCollapseExample1"*/}
            {/*    >*/}
            {/*        <td>1</td>*/}
            {/*        <td>TEST 123</td>*/}
            {/*        <td>test123@test.com</td>*/}
            {/*    </tr>*/}

            {/*    <tr*/}
            {/*        data-toggle="collapse"*/}
            {/*        data-target=".multi-collapse2"*/}
            {/*        aria-controls="multiCollapseExample2"*/}
            {/*    >*/}
            {/*        <td>2</td>*/}
            {/*        <td>TEST 456</td>*/}
            {/*        <td>test456@test.com</td>*/}
            {/*    </tr>*/}
            {/*    <tr className="collapse multi-collapse2" id="multiCollapseExample2">*/}
            {/*        <td>Child col 1</td>*/}
            {/*        <td>Child col 2</td>*/}
            {/*        <td>Child col 3</td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</Table>*/}
        </>
    )
}
export default EditParticipantsForm;
