import React, { useEffect, useState} from 'react';
import { Dialog } from 'primereact/dialog';
import './dialog.r.scss';

export interface ModalProps {
  visible: boolean;
  className?: string;
  width?: string;
  title?: string;
  modalClosed?: any;
  children?: any;
}
export const Modal = (props: ModalProps) => {
  const classNames = ['tr-modal-light', 'ic-modal', props.className];
  const width = props.width || '80vw';
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  const onHide = () => {
    props.modalClosed();
  };
  return (<Dialog visible={visible}
                  header={props.title}
                 className={classNames.join(' ')}
                 style={{width: width}}
                 onHide={onHide}>
    {props.children}
  </Dialog>);
};

export default Modal;
