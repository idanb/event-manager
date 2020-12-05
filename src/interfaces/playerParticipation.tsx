export interface IPlayerParticipation {
    id: number | string;
    event_id: number;
    registration_time: string;
    event_type: string;
    is_festival: boolean | string;
    status: boolean | string;
    player1_id: string;
    player1_name: string;
    player1_bbo: string;
    player2_id: string;
    player2_name: string;
    player2_bbo: string;
    photo_approval: boolean;
    payment_amount: number;
    notes: string;
    receipt: string;
}
