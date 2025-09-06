import axios from 'axios';
import curlirize from 'axios-curlirize';
import _ from 'lodash';

export async function POST({ request }) {
    try {
        const body = await request.json();
        
        let headers = { 'Authorization': 'Bearer ' + body.secretToken };
        let url = body.url;
        let data = {};

        const axiosInstance = axios.create({ headers, curlirize: false });
        // initializing axios-curlirize with your axios instance
        curlirize(axiosInstance);

        if (body.method === 'POST') {
            const displayName = body.group.displayName || body.group.externalId;
            const externalId = body.group.externalId;
            // Creating a group
            data = { externalId, displayName };
            const response = await axiosInstance.post(url + '/Groups', data, { headers, curlirize: false });
            
            response.data.curlCommand = response.config.curlCommand;
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'DELETE') {
            const groupId = body.group.id;
            // Deleting a group
            const response = await axiosInstance.delete(url + '/Groups/' + groupId, { headers, curlirize: false });
            
            response.data = { curlCommand: response.config.curlCommand };
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'GET') {
            // Filtering
            const response = await axiosInstance.get(url + '/Groups' + body.qs, { headers, curlirize: false });
            
            response.data.curlCommand = response.config.curlCommand;
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'PATCH') {
            const { id: groupId, userId } = body.group;
            const patchDataAdd = {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [{ op: 'Add', path: 'members', value: [{ value: userId }] }]
            };

            // Adding user to group
            const response = await axiosInstance.patch(url + '/Groups/' + groupId, patchDataAdd);
            
            response.data = { curlCommand: response.config.curlCommand };
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else {
            return new Response('TODO PATCH ID', { status: 400 });
        }
    } catch (error) {
        console.error(error.response);
        const errorData = _.pick(error.response, 'statusText', 'status', 'data', 'url');
        return new Response(JSON.stringify(errorData), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}