export interface IEvent {
    id: number | string;
    name: string;
    date: string;
    event_type: string;
    // is_festival: boolean | string;
    // only_members_limit: string;
    // max_participates_limit: string;
    // has_rank_limit: string;
    // max_rank_limit?: any;
    // min_rank_limit?: any;
    // gender_limit: string;
    // has_age_limit: string;
    // min_age_limit?: any;
    // max_age_limit?: any;
    // has_registration_list: string;
    // regulations_file_link?: any;
    // location: string;
    // schedule?: any;
    description?: any;
    // registration_deadline: string;
    // price: string;
    // guest_extra_price: string;
    // is_active: boolean | string;
    // is_online: boolean | string;
    target?: any;
}
