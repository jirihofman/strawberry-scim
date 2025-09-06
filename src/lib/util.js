export const loadConnectionsFromLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            return JSON.parse(window.localStorage.getItem('connections')) || [];
        } catch (error) {
            return [];
        }
    } else return [];
};

export const loadActiveConnectionFromLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            return window.localStorage.getItem('activeConnection');
        } catch (error) {
            return null;
        }
    } else return null;
};

export const getOperationResultDetails = (operationResult) => {
    if (operationResult && operationResult.ok === true && operationResult.data) {
        return JSON.stringify(operationResult.data, null, 2);
    } else if (operationResult && operationResult.ok === false && operationResult.reason) {
        let details = '';
        if (typeof operationResult.reason.data === 'object') {
            details = (operationResult.reason.data.detail ? operationResult.reason.data.detail : JSON.stringify(operationResult.reason.data));
        } else {
            details = operationResult.reason.data;
        }
        return operationResult.reason.status + ': ' + operationResult.reason.statusText + ' - ' + details;
    }
};

export const getFixedCurlCommand = (curlCommand = '') => {

    let fixed = curlCommand;

    if (curlCommand.includes('--data')) {
        fixed = fixed.replace('Content-Type:application/x-www-form-urlencoded', 'Content-Type:application/json');
    }

    if (fixed.startsWith('curl -X GET')) {
        // Fixing double quotes when searching
        const replaceStart = fixed.indexOf('?filter');
        const replaceEnd = fixed.indexOf('" -H');
        const p1 = fixed.substring(0,replaceStart);
        const p3 = fixed.substring(replaceEnd);
        const replaced = fixed.substring(replaceStart, replaceEnd).replaceAll('"', '\\"').replaceAll(' ', '+');            
        fixed = [p1, replaced, p3].join('');
    }

    return fixed;
}; 
