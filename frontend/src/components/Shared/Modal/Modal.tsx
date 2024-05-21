import React, { FunctionComponent, useEffect } from 'react';
import './Modal.scss';

type ModalProps = {
    title: string;
    openModal: boolean;
    toggleModal: (showModal: boolean) => void;
    children?: React.ReactNode;
}

export const Modal : FunctionComponent<ModalProps> = ({
    children,
    openModal,
    toggleModal,
    title,
}) => {

    useEffect(() => {
        const modal = document.getElementById("modal");
        
        if (openModal && modal) {
            modal.style.display = "block";
        }
        else if (modal) {
            modal.style.display = "none";
        };
        
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal && modal) {
                modal.style.display = "none";
                toggleModal(false);
            }
        };

    }, [openModal]);


    return <>
    <div id="modal" className="modal">
        <div className="modal-box">
            <span onClick={() => toggleModal(false)} className="close">&times;</span>
            <h2>{title}</h2>
            <div className='modal-content'>{children}</div>
        </div></div>
    </>
};

export default Modal;