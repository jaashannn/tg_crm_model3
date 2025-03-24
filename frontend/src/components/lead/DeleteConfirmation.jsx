import { useState } from "react";

const useConfirmationModal = () => {
  const [modalProps, setModalProps] = useState(null);

  const openConfirmationModal = ({ title, message, confirmText, cancelText }) => {
    return new Promise((resolve) => {
      setModalProps({ title, message, confirmText, cancelText, resolve });
    });
  };

  const handleConfirm = () => {
    modalProps?.resolve(true);
    setModalProps(null);
  };

  const handleCancel = () => {
    modalProps?.resolve(false);
    setModalProps(null);
  };

  return {
    openConfirmationModal,
    ConfirmationModal: modalProps ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold">{modalProps.title}</h2>
          <p className="mt-2">{modalProps.message}</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {modalProps.cancelText || "Cancel"}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {modalProps.confirmText || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    ) : null,
  };
};

export default useConfirmationModal;
