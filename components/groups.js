import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { loadActiveConnectionFromLocalStorage, getOperationResultDetails, getFixedCurlCommand } from '../lib/util';
import CurlCopyButton from './curl-copy-button';

const defaults = { state: 'Type group name or ID' };
export default function Groups() {

    useEffect(() => {
        setConnection(loadActiveConnectionFromLocalStorage());
    });

    const [groupName, setGroupName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [operationResult, setOperationResult] = useState({});
    const [status, setStatus] = useState(defaults.state);
    const [connection, setConnection] = useState(null);
    const [curl, setCurl] = useState();

    if (!connection) {
        return <div className={'alert alert-danger'} role="alert" onClick={() => { setConnection(loadActiveConnectionFromLocalStorage());}}>No connection selected. Click to reaload active connection.</div>;
    }

    const [url, secretToken] = connection.split('|');

    const handleSearchClick = () => {
        if (!groupName) return;
        setStatus('searching ...');
        setCurl();
        const qs = '?filter=displayName eq "'+encodeURIComponent(groupName)+'"';
        axios.post('/api/scim/Groups', { secretToken, url, qs, method: 'GET' })
            .then(response => {
                setOperationResult({ ok: true, data: { Resources: response.data.Resources, totalResults: response.data.totalResults, startIndex: response.data.startIndex, itemsPerPage: response.data.itemsPerPage }});
                const numUsers = response.data.totalResults === 1 ? response.data.Resources[0].members && response.data.Resources[0].members.length : 0;
                if (response.data.totalResults === 1) {
                    setGroupId(response.data.Resources[0].id);
                }
                setStatus(`Found ${response.data.totalResults} group for "${groupName}" with ${numUsers} users.`);
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                setOperationResult({ ok: false, reason: error.response.data });
                setStatus(`Error searching for "${groupName}"`);
            });
    };

    const handleClearResultsClick = () => {
        setGroupName(''); 
        setGroupId('');
        setOperationResult();
        setStatus(defaults.state);
        setCurl();
    };

    const handleCreateClick = async(evt) => {
        setOperationResult();
        setStatus('creating ...');
        setCurl();
        axios.post('/api/scim/Groups', { secretToken, url, method: 'POST', group: { externalId: groupName }})
            .then(response => {
                setOperationResult({ ok: true, data: _.omit(response.data, 'curlCommand') });
                setGroupId(response.data.id);
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                console.error('error creating', error.response.data);
                setOperationResult({ ok: false, reason: error.response.data });
            })
            .finally(()=> {
                setStatus(evt.target.innerText + ' ' + groupName);
            });
    };

    const handleDeleteClick = async(evt) => {
        setOperationResult();
        setStatus('deleting ...');
        setCurl();
        axios.post('/api/scim/Groups', { secretToken, url, method: 'DELETE', group: { id: groupId }})
            .then(response => {
                setOperationResult({ ok: true });
                setCurl(getFixedCurlCommand(response.data.curlCommand));
            })
            .catch(error => {
                console.error('error deleting group', error.response.data);
                setOperationResult({ ok: false, reason: error.response.data });
            })
            .finally(() => {
                setStatus(evt.target.innerText + ' ' + groupName);
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

    const groupBadgesHTML = ['Sales', '[TEST SCIM] R&D', '[TEST SCIM] Catering'].map(group => {
        const c = group === groupName ? 'bg-info' : 'bg-secondary';
        return <span key={group}>
            <span className={`badge mx-1 ${c}`} style={{ fontSize: 'small', cursor: 'pointer' }} data-connection={group} onClick={() => {
                setGroupName(group);
                setGroupId('');
            }}>
                {group}
            </span>
        </span>;
    });

    return (
        <section id='groups' className='px-1'>
            <span>Pre-defined group names: {groupBadgesHTML}</span>

            <div className="input-group">
                <span className="input-group-text">Display name</span>
                <input type="text" className="form-control" value={groupName} onChange={evt => { setGroupName(evt.target.value); }} />
                <span className="input-group-text">External ID</span>
                <input type="text" className="form-control" value={groupName} style={{ fontSize: 'small' }} title='Same as display name.' />
                <button className='btn btn-info' type="reset" onClick={handleClearResultsClick}>Clear results</button>
                <button className='btn btn-primary' type="submit" onClick={handleSearchClick}>Search</button>
                <button className='btn btn-success' type="submit" onClick={handleCreateClick}>Create</button>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">ID</span>
                <input type="number" className="form-control" value={groupId} onChange={evt => { setGroupId(evt.target.value); }} placeholder='ID' />
                <button className='btn btn-danger' type="submit" onClick={handleDeleteClick}>Delete</button>
            </div>
            <div className="input-group">
            </div>
            {statusHTML}
            {detailsHTML}
        </section>
    );
}
