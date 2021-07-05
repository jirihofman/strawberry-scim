module.exports = {
    loadConnectionsFromLocalStorage: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                return JSON.parse(window.localStorage.getItem('connections')) || [];
            } catch (error) {
                return [];
            }
        } else return [];
    },
    loadActiveConnectionFromLocalStorage: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                return window.localStorage.getItem('activeConnection');
            } catch (error) {
                return null;
            }
        } else return null;
    },
    getOperationResultDetails: (operationResult) => {
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
    }
}; 
