import { createContext, useState, useRef } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastsContext = createContext();

const ToastsProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(0); // ~ static variable, different for every connection

  const enqueue = (toast) => {
    const id = nextIdRef.current++;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleClose = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastsContext.Provider value={{ enqueue }}>
      {children}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => handleClose(toast.id)}
            bg={toast.variant || "light"}
            delay={toast.delay || 3000}
            autohide
            className="mb-2"
          >
            {toast.title && (
              <Toast.Header closeButton>
                <strong className="me-auto">{toast.title}</strong>
              </Toast.Header>
            )}
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>{" "}
    </ToastsContext.Provider>
  );
};

export { ToastsContext, ToastsProvider };
