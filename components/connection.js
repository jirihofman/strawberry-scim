import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { loadConnectionsFromLocalStorage, loadActiveConnectionFromLocalStorage } from '../lib/util';

export default function Test() {

    const [result, setResult] = useState();
    const [connections, setConnections] = useState(loadConnectionsFromLocalStorage());
    const [activeConnection, setActiveConnection] = useState(loadActiveConnectionFromLocalStorage());
    const [url, setUrl] = useState(activeConnection ? activeConnection.split('|')[0] : '');
    const [secretToken, setSecretToken] = useState(activeConnection ? activeConnection.split('|')[1] : '');

    /** Sets the connection as active */
    const handleConnectionBadgeClick = (evt) => {
        const selectedConnection = evt.target.dataset.connection;

        window.localStorage.setItem('activeConnection', selectedConnection);
        if (activeConnection && selectedConnection && activeConnection !== selectedConnection) {
            window.location.reload();
        } else {
            const con = selectedConnection.split('|');
            setUrl(con[0]);
            setSecretToken(con[1]);
        }
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
                setActiveConnection(url + '|' + secretToken);
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
        setConnections([]);
        setActiveConnection();
        window.localStorage.removeItem('activeConnection');
        window.localStorage.removeItem('connections');
    };

    const handleTestConnectionClick = async() => {
        if (url && url.startsWith('http') && secretToken) {
            setResult({ pending: true, reason: 'Connecting ...' });
            axios.post('/api/scim/test', { secretToken, url }).then(response => {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const connectionString = url + '|' + secretToken;
                    const isInLocalStorage = connections.includes(connectionString);
                    if (!isInLocalStorage) {
                        connections.push(connectionString);
                    }
                    setConnections(connections);
                    setActiveConnection(connectionString);
                    window.localStorage.setItem('connections', JSON.stringify(connections));
                    window.localStorage.setItem('activeConnection', connectionString);
                }

                setResult({ ok: true, status: response.status });
            }).catch(error => {
                setResult({ ok: false, reason: JSON.stringify(error.response.data) });
                return;
            });
        } else {
            setResult({ ok: false, reason: 'Specify valid URL and Secret Token' });
        }
    };

    const badgesHTML = connections.map(connection => {
        const c = connection === activeConnection ? 'bg-info' : 'bg-secondary';
        return <span key={connection}>
            <span className={`badge fs-6 ${c}`} style={{ fontSize: 'x-small', cursor: 'pointer' }} data-connection={connection} onClick={handleConnectionBadgeClick}>
                {connection.split('|')[0]}
            </span>
            <span className='badge btn bg-dark fs-6' data-connection={connection} onClick={handleConnectionRemoveBadgeClick}>x</span>
        </span>;
    });

    let resultAlertClass = 'alert-secondary';
    let resultAlertText = 'To be tested ...';

    if (result && result.ok) {
        resultAlertClass = 'alert-success';
        resultAlertText = 'Success: ' + result.reason;
    } else if (result && result.ok === false) {
        resultAlertClass = 'alert-danger';
        resultAlertText = result.reason;
    } else if (result && result.pending === true) {
        resultAlertText = result.reason;
    }

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
