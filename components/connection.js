import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { loadConnectionsFromLocalStorage } from '../lib/util';

export default function Test() {

    const [url, setUrl] = useState('');
    const [secretToken, setSecretToken] = useState('');
    const [result, setResult] = useState();
    const [connections, setConnections] = useState(loadConnectionsFromLocalStorage());

    let resultAlertClass = 'alert-secondary';
    let resultAlertText = 'To be tested ...';

    if (result && result.ok) {
        resultAlertClass = 'alert-success';
        resultAlertText = 'Success';
    } else if (result && result.ok === false) {
        resultAlertClass = 'alert-danger';
        resultAlertText = result.reason;
    }
    /** Sets the connection as active */
    const handleConnectionBadgeClick = (evt) => {
        const con = evt.target.dataset.connection.split('|');
        setUrl(con[0]);
        setSecretToken(con[1]);
        window.localStorage.setItem('activeConnection', evt.target.dataset.connection);
    };

    const handleConnectionRemoveBadgeClick = (evt) => {
        const con = evt.target.dataset.connection;
        const storedConnections = loadConnectionsFromLocalStorage();
        const newConnections = _.without(storedConnections,con);
        setConnections(newConnections);
        if (newConnections.length) {
            const [url,secretToken] = newConnections[0].split('|');
            setUrl(url);
            setSecretToken(secretToken);
            const activeConnection = window.localStorage.getItem('activeConnection');
            if (!activeConnection) {
                window.localStorage.setItem('activeConnection', url + '|' + secretToken);
            }
        } else {
            setUrl('');
            setSecretToken('');
            window.localStorage.removeItem('activeConnection');
        }
        window.localStorage.setItem('connections', JSON.stringify(newConnections));
    };

    const handleResetConnectionClick = () => {
        setUrl('');
        setSecretToken('');
        setResult(null);
        window.localStorage.removeItem('activeConnection');
        window.localStorage.removeItem('connections');
    };

    const handleTestConnectionClick = async() => {
        if (url && url.startsWith('http') && secretToken) {
            
            axios.post('/api/scim/test', { secretToken, url }).then(response => {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const connectionString = url + '|' + secretToken;
                    const isInLocalStorage = connections.includes(connectionString);
                    if (!isInLocalStorage) {
                        connections.push(connectionString);
                    }
                    setConnections(connections);
                    window.localStorage.setItem('connections', JSON.stringify(connections));
                    window.localStorage.setItem('activeConnection', connectionString);
                }

                setResult({ ok: true });
            }).catch(error => {
                setResult({ ok: false, reason: JSON.stringify(error.response.data) });
                return;
            });
        } else {
            setResult({ ok: false, reason: 'Specify valid URL and Secret Token' });
        }
    };

    const badgesHTML = connections.map(connection => {
        const c = connection === url + '|' + secretToken ? 'bg-info' : 'bg-secondary';
        return <span key={connection}>
            <span className={`badge fs-6 ${c}`} style={{ fontSize: 'x-small', cursor: 'pointer' }} data-connection={connection} onClick={handleConnectionBadgeClick}>
                {connection.split('|')[0]}
            </span>
            <span className='badge btn bg-dark fs-6' data-connection={connection} onClick={handleConnectionRemoveBadgeClick}>x</span>
        </span>;
    }
    );

    return (
        <section id='test' className='px-1'>
            <h3>Test credentials {badgesHTML}</h3>

            <div className="input-group mb-3">
                <span className="input-group-text">Tenant URL</span>
                <input type="text" className="form-control" id="test-url" value={url} onChange={evt => {setUrl(evt.target.value);}} placeholder='eg: https://your-ev.ngrok.io' />
                <span className="input-group-text">Secret Token</span>
                <input type="text" className="form-control" id="secret-token" value={secretToken} onChange={evt => {setSecretToken(evt.target.value);}} />
                <button className='btn btn-info' type="reset" onClick={handleResetConnectionClick}>Reset</button>
                <button className='btn btn-primary' type="submit" onClick={handleTestConnectionClick}>Test connection</button>
            </div>
            <div className={`alert ${resultAlertClass}`} role="alert">
                {resultAlertText}
            </div>
        </section>
    );
}
