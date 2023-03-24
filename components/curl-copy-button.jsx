'use client';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import { CopyIcon } from '@primer/octicons-react';
import { useToasts } from './toast-manager';

export default function CurlCopyButton({ curl }) {

    const { addToast } = useToasts();

    return <>
        {curl ? <CopyToClipboard text={curl} onCopy={() => {
            addToast({ bg: 'success', delay: 5000, text: curl.substring(0, 100) + ' ...', title: 'Copied!' });
        }}>
            <Button variant='outline-success' title='Copy curl to clipboard' size='sm'>
                <code>curl <CopyIcon fill='black'/></code>
            </Button>
        </CopyToClipboard> : null}
    </>;
}
