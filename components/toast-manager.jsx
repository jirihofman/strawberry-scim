import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import PropTypes from 'prop-types'; 

const Ctx = React.createContext();

// Thanks: https://codesandbox.io/s/71q1xvjnx

let toastCount = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const addToast = ({ autohide, bg, delay = 3000, text, title }) => {
        const id = toastCount++;
        const toast = { autohide: autohide === undefined ? bg !== 'danger' : autohide, bg, delay, id, text, title };
        setToasts([...toasts, toast]);
    };
    const removeToast = id => {
        const newToasts = toasts.filter(t => t.id !== id);
        setToasts(newToasts);
    };
    // avoid creating a new fn on every render
    const onDismiss = id => () => removeToast(id);

    return (
        <Ctx.Provider value={{ addToast, remove: removeToast }}>
            {children}
            <ToastContainer>
                {toasts.map(({ id, text, title, ...rest }) => (
                    <Toast key={id} onClose={onDismiss(id)} {...rest}>
                        <Toast.Header><strong className="me-auto">{title}</strong></Toast.Header>
                        <Toast.Body>{text}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </Ctx.Provider>
    );
}

export const useToasts = () => React.useContext(Ctx);

ToastProvider.propTypes = {
    children: PropTypes.element,
};
