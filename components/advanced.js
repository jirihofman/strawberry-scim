import { useEffect, useRef, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormCheck from 'react-bootstrap/FormCheck';
import _ from 'lodash';
import { loadActiveConnectionFromLocalStorage } from '../lib/util';

const defaults = { userCount: 2, userAssign: true, userUpdate: true, testPrefix: 'strawberry-scim-' };
const STEPS = {
    gc: { endpoint: 'POST /Groups', name: '👥 created' },
    uc: { endpoint: 'POST /Users', name: '👤 created' },
    ua: { endpoint: 'PATCH /Groups/:id', name: '👤 added' },
    um: { endpoint: 'PATCH /Users/:id', name: '👤 modified' },
    ud: { endpoint: 'DELETE /Users/:id', name: '👤 deleted' },
    gd: { endpoint: 'DELETE /Users/:id', name: '👥 deleted' },
};
export default function Advanced() {

    const [userCount, setUserCount] = useState(defaults.userCount);
    const [userUpdate, setUserUpdate] = useState(defaults.userUpdate);
    const [userAssign, setUserAssign] = useState(defaults.userAssign);
    const [operations, setOperations] = useState([]);
    const [connection, setConnection] = useState(null);
    const operationsRef = useRef();

    // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
    // All the magic is done in the click handler function. We always need `operations` current value.
    operationsRef.current = operations;

    if (userCount > 100) {
        throw 'Max allowed user count is 100';
    }

    useEffect(() => {
        setConnection(loadActiveConnectionFromLocalStorage());
    });

    if (!connection) {
        return <div className={'alert alert-danger'} role="alert" onClick={() => { setConnection(loadActiveConnectionFromLocalStorage());}}>No connection selected. Click to reaload active connection.</div>;
    }

    const [url, secretToken] = connection.split('|');

    const handleClearResultsClick = () => {

        setUserCount(defaults.userCount);
        setUserUpdate(defaults.userUpdate);
        setUserAssign(defaults.userAssign);
        setOperations([]);
    };

    const prepareOperations = () => {
        setOperations([]);

        const operations = _.range(0, userCount).map(i => ({
            id: 'uc' + i,
            step: 'usersCreated',
            status: 'pending',
            username: 'u-' + i + '@1secmail.org',
        }));
        if (userAssign) {
            _.range(0, userCount).forEach(i => {
                operations.push({
                    id: 'ua' + i,
                    step: 'usersAdded',
                    status: 'pending',
                    username: 'u-' + i + '@1secmail.org',
                });
            });
        }
        if (userUpdate) {
            _.range(0, userCount).forEach(i => {
                operations.push({
                    id: 'um' + i,
                    step: 'usersModified',
                    status: 'pending',
                    username: 'u-' + i + '@1secmail.org',
                });
            });
        }
        _.range(0, userCount).forEach(i => {
            operations.push({
                id: 'ud' + i,
                step: 'usersDeleted',
                status: 'pending',
                username: 'u-' + i + '@1secmail.org',
            });
        });
        operations.unshift({
            step: 'groupCreated',
            status: 'in-progress',
            id: 'gc',
        });
        operations.push({
            step: 'groupDeleted',
            status: 'pending',
            id: 'gd',
        });
        setOperations(operations);
        return operationsRef.current = operations;
    };

    const processGroupCall = async({ body, operationIndex }) => {
        let details;
        const timer = performance.now();
        await fetch('/api/scim/Groups', {
            body: JSON.stringify({ secretToken, url, ...body }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(async response => {
            let isError = !response.ok;
            const now = performance.now();
            const duration = parseInt(now - timer, 10);

            try {
                const data = await response.json();
                details = JSON.stringify(data);
                if (data.status > 299) {
                    isError = true;
                }
            } catch (error) {
                isError = true;
                details = JSON.stringify(error);
            }

            const newOps = getResolvedOperatons(operationsRef.current, { details, duration, isError, operationIndex });
            setOperations(newOps);
            operationsRef.current = newOps;
        }).catch(error => {
            console.error('unexpected error when processing group', error.response.data);
        });

        return JSON.parse(details);
    };

    const processUserCall = async({ body, operationIndex }) => {

        let details;
        const timer = performance.now();

        await fetch('/api/scim/Users', {
            body: JSON.stringify({ secretToken, url, ...body }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            keepalive: false
        }).then(async response => {
            let isError = !response.ok;
            const now = performance.now();
            const duration = parseInt(now - timer, 10);

            try {
                const data = await response.json();
                details = JSON.stringify(data);
                if (data.status > 299) {
                    isError = true;
                }
            } catch (error) {
                isError = true;
                details = JSON.stringify(error);
                console.error('Error getting response for', body, error);
            }

            const newOps = getResolvedOperatons(operationsRef.current, { details, duration, isError, operationIndex });
            setOperations(newOps);
            operationsRef.current = newOps;
            // console.info('It should be resolved as', isError ? 'error' : 'success', operationIndex);
        }).catch(error => {
            console.error('unexpected error when processing user', error.response.data);
        });

        return JSON.parse(details);
    };

    const processUsersCreated = async() => {
        const userCreatedOps = operationsRef.current.filter(op => op.id.startsWith('uc'));
        const userCreatedOpsPromises = userCreatedOps.map(op => {
            // Process step: userCreated
            // Index starting after groupCreated
            const index = _.findIndex(userCreatedOps, o => o.id === op.id) + 1;
            return processUserCall({ body: { method: 'POST', user: { displayName: op.displayName, externalId: defaults.testPrefix + op.username }}, operationIndex: index });
        });

        await (await Promise.all(userCreatedOpsPromises)).forEach((p, i) => {

            if (p.status > 299) {
                console.error('Not updating rest of operations for ', p);
                return;
            }
            // We obtained IDs of new Users. Let's add them to the rest of users' operations.
            const opIds = ['ua' + i, 'um' + i, 'ud' + i];
            const newOps = operationsRef.current.map((op) => {
                if (opIds.includes(op.id)) {
                    op.appId = p.id;
                }
                return op;
            });
            setOperations(newOps);
            operationsRef.current = newOps;
        });
    };

    const updateUsersProgress = (type) => {
        const newOps = getFilteredOperatons(operationsRef.current, type);
        setOperations(newOps);
        operationsRef.current = newOps;
    };

    const handleStartClick = async() => {

        operationsRef.current = prepareOperations();

        // Process step: groupCreated
        const { id: newGroupId } = await processGroupCall({ body: { method: 'POST', group: { displayName: 'Sales', externalId: defaults.testPrefix + 'sales' }}, operationIndex: 0 });

        // Process step: usersCreated
        updateUsersProgress('uc');
        await processUsersCreated();

        // Process step: usersAdded
        if (userAssign) {
            updateUsersProgress('ua');
            const userAddedOps = operationsRef.current.filter(op => op.step.startsWith('usersAdded'));
            const userOpsAddedPromises = userAddedOps.map(op => {
                const index = _.findIndex(userAddedOps, o => o.id === op.id) + 1 + userCount;
                return processGroupCall({ body: { method: 'PATCH', group: { id: newGroupId, userId: op.appId }}, operationIndex: index });
            });
            await Promise.all(userOpsAddedPromises);
        }

        // Process step: usersModified
        if (userUpdate) {
            updateUsersProgress('um');
            const userModifiedOps = operationsRef.current.filter(op => op.step.startsWith('usersModified'));
            const userOpsModifiedPromises = userModifiedOps.map(op => {
                const index = _.findIndex(userModifiedOps, o => o.id === op.id) + 1 + userCount + (userAssign ? userCount : 0);
                const newUserName = op.username.replace('1secmail.org', '1secmail.net');
                return processUserCall({ body: { method: 'PATCH', user: { id: op.appId, userName: newUserName }}, operationIndex: index });
            });
            await Promise.all(userOpsModifiedPromises);
        }

        // Process step: usersDeleted
        updateUsersProgress('ud');
        const userDeletedOps = operationsRef.current.filter(op => op.step.startsWith('usersDeleted'));
        const userOpsDeletedPromises = userDeletedOps.map(op => {
            const index = _.findIndex(userDeletedOps, o => o.id === op.id) + 1 + userCount + (userAssign ? userCount : 0) + (userUpdate ? userCount : 0);
            return processUserCall({ body: { method: 'DELETE', user: { id: op.appId }}, operationIndex: index });
        });
        await Promise.all(userOpsDeletedPromises);

        updateUsersProgress('gd');
        await processGroupCall({ body: { method: 'DELETE', group: { id: newGroupId }}, operationIndex: operationsRef.current.length - 1 });
    };

    return (
        <section id='advanced' className='px-1'>
            <div className="input-group mb-3">
                <table>
                    <tr>
                        <th className=''>
                            <span className="input-group-text">Number of users: <code className='ps-1'>{userCount.toString().padStart(2, '0')}</code></span>
                        </th>
                        <td>
                            <input type={'range'} value={userCount} max={20} onChange={evt => setUserCount(Number(evt.target.value))} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <span className="input-group-text">Data prefix</span>
                        </th>
                        <td>
                            <input type="text" className="form-control" id="secret-token" value={defaults.testPrefix} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <FormCheck
                                type="switch"
                                id="user-assign"
                                label="Assign User"
                                title='Add each user to group'
                                checked={userAssign} onChange={evt => setUserAssign(evt.target.checked)}
                            />
                        </td>
                        <td>
                            <FormCheck
                                type="switch"
                                id="user-update"
                                label="Update User"
                                title='Change userName (email address)'
                                checked={userUpdate} onChange={evt => setUserUpdate(evt.target.checked)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th colSpan={2}>
                            <button className='btn btn-info' type="reset" onClick={handleClearResultsClick}>Reset</button>
                            <button className='btn btn-primary' type="submit" onClick={handleStartClick}>Start</button>
                            <button className='btn btn-secondary' type="button" onClick={() => {alert('Coming soon. Use your intuition.');}}>Help</button>
                        </th>
                    </tr>
                </table>
            </div>
            <ProgressBar>
                {getProgressBar(operations)}
            </ProgressBar>
            <table>
                <tr>
                    <th style={{ maxWidth: '12px' }}>ℹ️</th>
                    <th>Operation</th>
                    <th>Endpoint</th>
                    <th>Duration</th>
                </tr>
                {renderStatusRow('gc', operationsRef.current)}
                {userCount > 0 ? <>
                    {renderStatusRow('uc', operationsRef.current)}
                    {userAssign ? <>
                        {renderStatusRow('ua', operationsRef.current)}
                    </> : null}
                    {userUpdate ? <>
                        {renderStatusRow('um', operationsRef.current)}
                    </> : null}
                    {renderStatusRow('ud', operationsRef.current)}
                </> : null}
                {renderStatusRow('gd', operationsRef.current)}
            </table>

            <hr />
            <h3>Coming soon</h3>
            <div>➡️ curl commands available for each step</div>
            <div>➡️ statistics: total time, number of requests, avg time, number of errors</div>
            <div>➡️ nicer look</div>

        </section>
    );
}

function getStatusIcon(operations = []) {

    const statuses = _.uniq(operations.map(op => op.status));
    let status = 'pending';
    if (statuses.includes('success'))
        status = 'success';
    if (statuses.includes('pending'))
        status = 'pending';
    if (statuses.includes('in-progress'))
        status = 'in-progress';
    if (statuses.includes('error'))
        status = 'error';
    switch (status) {
        case 'pending':
            return '⏸';
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'in-progress':
            return '🔄';

        default:
            return '⁉️' + status;
    }
}
function renderStatusRow(step, operations = []) {

    const stepOps = operations.filter(op => op.id.startsWith(step));
    const status = getStatusIcon(stepOps);
    const stepName = STEPS[step].name;
    const endpoint = STEPS[step].endpoint;
    const maxDuraton = _.max(stepOps.map(op => op.duration));
    return <tr>
        <td style={{ width: '10px' }}>{status}</td>
        <td>{stepName}</td>
        <td><code style={{ fontSize: '10px' }}>{endpoint}</code></td>
        <td>{maxDuraton}</td>
    </tr>;
}

function getProgressBar(operations = []) {

    if (!operations.length) return null;
    const progressBars = operations.map((op, i) => {

        let variant = '';
        switch (op.status) {
            case 'error':
                variant = 'danger';
                break;
            case 'pending':
                variant = 'secondary';
                break;
            case 'in-progress':
                variant = 'warning';
                break;
            case 'success':
                variant = 'success';
                break;

            default:
                throw 'Unsupported operation status: ' + op.status;
        }

        return <ProgressBar variant={variant} now={1} key={i} max={operations.length} />;
    });

    return progressBars;
}

function getFilteredOperatons(ops = [], type = '') {
    const newOperations = _.cloneDeep(ops);
    newOperations.forEach((op) => {
        if (op.id.startsWith(type)) {
            op.status = 'in-progress';
        }
    });
    return newOperations;
}

// Adds status of a single resolved operation into existing operations.
function getResolvedOperatons(ops = [], { details, duration, isError, operationIndex }) {

    const newOperations = _.cloneDeep(ops);
    newOperations[operationIndex] = { ...newOperations[operationIndex], status: isError ? 'error' : 'success', details, duration };
    return newOperations;
}
