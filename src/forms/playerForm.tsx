import React, {useState} from 'react'
import {useTranslation} from "react-i18next";

interface PlayerFormProp {
    onSave: () => void;
    onCancel: () => void;
}

const PlayerForm = (props: PlayerFormProp) => {
    return (
        <>
            <main>
                <form>
                    {'test'}
                </form>
            </main>
        </>
    )
}
export default PlayerForm;
