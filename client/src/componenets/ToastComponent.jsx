// src/components/ToastComponent.jsx
import React, { useEffect, useRef } from "react";
import { Toast } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ToastComponent = ({ message, type, show, setShow }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show) {
      const toastEl = toastRef.current;
      if (toastEl) {
        const toast = new Toast(toastEl);
        toast.show();
        toastEl.addEventListener("hidden.bs.toast", () => setShow(false));
      }
    }
  }, [show, setShow]);

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div
        ref={toastRef}
        className={`toast align-items-center text-bg-${type} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setShow(false)}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastComponent;
