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
    }
}; 
