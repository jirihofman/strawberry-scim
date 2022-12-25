import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import { useToasts } from './toast-manager';

export default function CurlCopyButton({ curl }) {

    const { addToast } = useToasts();

    return <>
        {curl ? <CopyToClipboard text={curl} onCopy={() => {
            addToast({ bg: 'success', delay: 5000, text: curl.substring(0, 100) + ' ...', title: 'Copied!' });
        }}>
            <Button variant='outline-success' title='Copy curl to clipboard' size='sm'>
                {/* TODO: use react components - bootstrap icons or @primer/octicons-react */}
                <code>curl <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"></path></svg></code>
            </Button>
        </CopyToClipboard> : null}
    </>;
}
