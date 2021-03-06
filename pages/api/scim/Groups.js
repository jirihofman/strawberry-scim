import axios from 'axios';
import curlirize from 'axios-curlirize';
import _ from 'lodash';

export default (req, res) => {
    let headers = { 'Authorization': 'Bearer ' + req.body.secretToken };
    let url = req.body.url;
    let data = {};

    // initializing axios-curlirize with your axios instance
    curlirize(axios);

    if (req.method !== 'POST') return res.status(400).end('only POST supported, got: ' + req.method);

    if (req.body.method === 'POST') {
        const groupName = req.body.group.externalId;
        // Creating a group
        data = { externalId: groupName, displayName: groupName };
        axios.post(url + '/Groups', data, { headers, curlirize: false })
        //.get(url + '/Users?filter=userName eq "bf3f8e8d-f431-4adf-bbe0-833dd06e2a80"', { headers })
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data.curlCommand = response.config.curlCommand;
                res.status(200).json(response.data);
            }).catch(error => {
                console.error(error.response);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });
    } else if (req.body.method === 'DELETE') {
        const groupId = req.body.group.id;
        // Creating a group
        axios.delete(url + '/Groups/' + groupId, { headers, curlirize: false })
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data = { curlCommand: response.config.curlCommand };
                res.status(200).json(response.data);
            }).catch(error => {
                console.error(error);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });
    } else if (req.body.method === 'GET') {
        // Filtering
        axios.get(url + '/Groups' + req.body.qs, { headers, curlirize: false })
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data.curlCommand = response.config.curlCommand;
                return res.status(200).json(response.data);
            }).catch(error => {
                console.error(error.response);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });

    } else {
        return res.status(400).end('TODO PATCH ID');
    }
};

export const config = {
    api: {
        externalResolver: true,
    },
};
