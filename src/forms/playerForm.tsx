import React, {useState} from 'react'
import axios from "axios";
import {IEvent} from "../interfaces/event";
import isDev from "../helper";

interface PlayerFormProp {
    onSave: () => void;
    onCancel: () => void;
    event: IEvent | undefined;
}

const PlayerForm = (props: PlayerFormProp) => {
    const url = (isDev() ? process.env.REACT_APP_DOMAIN : process.env.REACT_APP_DOMAIN) + '/participantsUpload' || '';
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('avatar', selectedFile);

        axios
            .post(url + '/' + props.event?.id + '/' + props.event?.event_type, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(res => {
                props.onSave();
            })
            .catch(err => alert('שמירה נכשלה'));
    }

    const fileData = () => {
        if (selectedFile) {
            return (
                <div>
                    <h2>פרטי קובץ :</h2>
                    <p> שם קובץ: {selectedFile.name}</p>
                    <p> סוג הקובץ: {selectedFile.type}</p>
                    <p>
                        שונה לאחרונה:{" "}
                        {selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                </div>
            );
        }
    };

    return (
        <>
            <main>
                <div>
                    <div>
                        <form method={'post'} onSubmit={onSubmit} action={url}
                              encType="multipart/form-data">
                            <input type="file" name="files[]" onChange={onFileChange}
                                   accept=".csv" />
                            <button type={'submit'} disabled={!selectedFile}>
                                העלאת קובץ
                            </button>
                        </form>
                    </div>
                    {fileData()}
                </div>
            </main>
        </>
    )
}
export default PlayerForm;
