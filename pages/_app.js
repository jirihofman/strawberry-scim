import '../styles/global.css';
import { ToastProvider } from '../components/toast-manager';

export default function App({ Component, pageProps }) {
    return <ToastProvider>
        <Component {...pageProps} />
    </ToastProvider>;
}
