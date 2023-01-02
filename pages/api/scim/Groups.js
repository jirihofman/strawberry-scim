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
        const displayName = req.body.group.displayName || req.body.group.externalId;
        const externalId = req.body.group.externalId;
        // Creating a group
        data = { externalId, displayName };
        axiosInstance.post(url + '/Groups', data, { headers, curlirize: false })
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
        axiosInstance.delete(url + '/Groups/' + groupId, { headers, curlirize: false })
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
        axiosInstance.get(url + '/Groups' + req.body.qs, { headers, curlirize: false })
            .then(response => {
                // TODO: try axios.interceptors to have it all in one place
                response.data.curlCommand = response.config.curlCommand;
                return res.status(200).json(response.data);
            }).catch(error => {
                console.error(error.response);
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data', 'url'));
            });
    } else if (req.body.method === 'PATCH') {
        const { id: groupId, userId } = req.body.group;
        const patchDataAdd = {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            Operations: [{ op: 'Add', path: 'members', value: [{ value: userId }] }]
        };

        // Adding user to group
        axiosInstance.patch(url + '/Groups/' + groupId, patchDataAdd)
            .then(response => {
                response.data = { curlCommand: response.config.curlCommand };
                res.status(200).json(response.data);
            }).catch(error => {
                console.error(error);
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
