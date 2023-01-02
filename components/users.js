import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { loadActiveConnectionFromLocalStorage, getOperationResultDetails, getFixedCurlCommand } from '../lib/util';
import CurlCopyButton from './curl-copy-button';

const defaults = { state: 'Type username or ID' };
export default function Test() {

    useEffect(() => {
        setConnection(loadActiveConnectionFromLocalStorage());
    });

    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [operationResult, setOperationResult] = useState({});
    const [status, setStatus] = useState(defaults.state);
    const [connection, setConnection] = useState(null);
    const [curl, setCurl] = useState();

    if (!connection) {
        return <div className={'alert alert-danger'} role="alert" onClick={() => { setConnection(loadActiveConnectionFromLocalStorage());}}>No connection selected. Click to reaload active connection.</div>;
    }

    const [url, secretToken] = connection.split('|');

    const handleSearchClick = () => {
        if (!userName) return;
        setStatus('searching ...');
        setCurl();
        const qs = '?filter=userName eq "'+encodeURIComponent(userName)+'"';
        axios.post('/api/scim/Users', { secretToken, url, qs, method: 'GET' })
            .then(response => {
                setOperationResult({ ok: true, data: { Resources: response.data.Resources, totalResults: response.data.totalResults, startIndex: response.data.startIndex, itemsPerPage: response.data.itemsPerPage }});
                if (response.data.totalResults === 1) {
                    setUserId(response.data.Resources[0].id);
                }
                setStatus(`Found ${response.data.totalResults} user for "${userName}"`);
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                setOperationResult({ ok: false, reason: error.response.data });
                setStatus(`Error searching for "${userName}"`);
            });
    };

    const handleClearResultsClick = () => {
        setUserName(''); 
        setUserId('');
        setOperationResult();
        setStatus(defaults.state);
        setCurl();
    };

    const handleCreateClick = async(evt) => {
        setOperationResult();
        setStatus('creating ...');
        setCurl();
        axios.post('/api/scim/Users', { secretToken, url, method: 'POST', user: { externalId: userName }})
            .then(response => {
                setOperationResult({ ok: true, data: _.omit(response.data, 'curlCommand') });
                setUserId(response.data.id);
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                console.error('error creating', error.response.data);
                setOperationResult({ ok: false, reason: error.response.data });
            })
            .finally(()=> {
                setStatus(evt.target.innerText + ' ' + userName);
            });
    };

    const handleDeleteClick = async(evt) => {
        setOperationResult();
        setStatus('deleting ...');
        setCurl();
        axios.post('/api/scim/Users', { secretToken, url, method: 'DELETE', user: { id: userId }})
            .then(response => {
                setOperationResult({ ok: true });
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                setOperationResult({ ok: false, reason: error.response.data });
            })
            .finally(() => {
                setStatus(evt.target.innerText + ' ' + userName);
            });
    };

    let resultAlertClass = 'alert-secondary';
    if (operationResult && operationResult.ok) {
        resultAlertClass = 'alert-success';
    } else if (operationResult && operationResult.ok === false) {
        resultAlertClass = 'alert-danger';
    }

    const copyCurlButton = <CurlCopyButton curl={curl} />;

    const operationDetails = getOperationResultDetails(operationResult);
    const statusHTML = <div className={`alert ${resultAlertClass}`} role="alert">{status} {copyCurlButton}</div>;
    const detailsHTML = operationDetails ? <div className={`alert ${resultAlertClass}`} role="alert"><pre>{operationDetails}</pre></div> : null;

    const userBadgesHTML = ['adam@example.com', 'carl@example.com', 'jane@example.com', 'strawberry-scim-u-0@1secmail.org'].map(user => {
        const c = user === userName ? 'bg-info' : 'bg-secondary';
        return <span key={user}>
            <span className={`badge mx-1 ${c}`} style={{ fontSize: 'small', cursor: 'pointer' }} data-connection={user} onClick={() => {
                setUserName(user);
                setUserId('');
            }}>
                {user}
            </span>
        </span>;
    });

    return (
        <section id='users' className='px-1'>
            <span>Pre-defined user names: {userBadgesHTML}</span>

            <div className="input-group">
                <span className="input-group-text">Display name</span>
                <input type="text" className="form-control" value={userName} onChange={evt => { setUserName(evt.target.value); }} />
                <span className="input-group-text">External ID</span>
                <input type="text" className="form-control" value={userName} style={{ fontSize: 'small' }} title='Same as display name.' />
                <button className='btn btn-info' type="reset" onClick={handleClearResultsClick}>Clear results</button>
                <button className='btn btn-primary' type="submit" onClick={handleSearchClick}>Search</button>
                <button className='btn btn-success' type="submit" onClick={handleCreateClick}>Create</button>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">ID</span>
                <input type="number" className="form-control" value={userId} onChange={evt => { setUserId(evt.target.value); }} placeholder='ID' />
                <button className='btn btn-danger' type="submit" onClick={handleDeleteClick}>Delete</button>
            </div>
            <div className="input-group">
            </div>
            {statusHTML}
            {detailsHTML}
        </section>
    );
}
