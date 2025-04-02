import React from "react";
import ReactDOM from "react-dom";
import "../componentcss/modal.css";
const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay2" onClick={onClose}>
      <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header2">
          <h3>{title}</h3>
          <button className="modal-close2" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body2">
          <p>{message}</p>
        </div>
        <div className="modal-footer2">
          <button className="modal-button2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
