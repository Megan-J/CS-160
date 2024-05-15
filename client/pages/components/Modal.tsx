import React from "react";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  children?: React.ReactNode; // Allows any valid React child (JSX, strings, elements, etc.)
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggleModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={toggleModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
