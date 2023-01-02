import axios from 'axios';
import curlirize from 'axios-curlirize';
import _ from 'lodash';

export default (req, res) => {
    let headers = { 'Authorization': 'Bearer ' + req.body.secretToken };
    let url = req.body.url;
    let data = {};

    const axiosInstance = axios.create({ headers, curlirize: false });
    // initializing axios-curlirize with your axios instance
    curlirize(axiosInstance);

    if (req.method !== 'POST') return res.status(400).end('only POST supported, got: ' + req.method);

    if (req.body.method === 'POST') {
        const userName = req.body.user.externalId;
        // Creating a user
        data = { externalId: userName, userName: userName };
        axiosInstance.post(url + '/Users', data)
        //.get(url + '/Users?filter=userName eq "bf3f8e8d-f431-4adf-bbe0-833dd06e2a80"', { headers })
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data.curlCommand = response.config.curlCommand;
                res.status(200).json(response.data);
            }).catch(error => {
                console.error(error);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });
    } else if (req.body.method === 'DELETE') {
        const userId = req.body.user.id;
        // Creating a group
        axiosInstance.delete(url + '/Users/' + userId)
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
        axiosInstance.get(url + '/Users' + req.body.qs)
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data.curlCommand = response.config.curlCommand;
                return res.status(200).json(response.data);
            }).catch(error => {
                console.error(error);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });

    } else if (req.body.method === 'PATCH') {
        const userId = req.body.user.id;
        const userName = req.body.user.userName;
        const patchData = {
            schemas: [
                'urn:ietf:params:scim:api:messages:2.0:PatchOp'
            ],
            Operations: [
                {
                    op: 'Replace',
                    path: 'userName',
                    value: userName
                }
            ]
        };

        // Creating a user
        axiosInstance.patch(url + '/Users/' + userId, patchData)
            .then(response => {
                response.data.curlCommand = response.config.curlCommand;
                res.status(200).json(response.data);
            }).catch(error => {
                console.error(error);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });
    } else {
        return res.status(400).end('Unknown method');
    }
};

export const config = {
    api: {
        externalResolver: true,
    },
};
