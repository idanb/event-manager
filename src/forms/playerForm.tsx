import React, {useState} from 'react'
import axios from "axios";
import {IEvent} from "../interfaces/event";

interface PlayerFormProp {
    onSave: () => void;
    onCancel: () => void;
    event: IEvent | undefined;
}

const PlayerForm = (props: PlayerFormProp) => {
    const url = process.env.REACT_APP_DOMAIN + '/participantsUpload' || '';
    const url2 = process.env.REACT_APP_DOMAIN_DEV  + '/participantsUpload';

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isDev, setIsDev] = useState<boolean>(false);


    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('avatar', selectedFile);

        axios
            .post((isDev ? url2 : url) + '/' + props.event?.id + '/' + props.event?.event_type, formData, {
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
                    <h2 onDoubleClick={() => setIsDev(true)}>פרטי קובץ :</h2>
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
