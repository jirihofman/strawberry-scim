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
            const userName = body.user.externalId;
            // Creating a user
            data = { externalId: userName, userName: userName };
            const response = await axiosInstance.post(url + '/Users', data);
            
            response.data.curlCommand = response.config.curlCommand;
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'DELETE') {
            const userId = body.user.id;
            // Deleting a user
            const response = await axiosInstance.delete(url + '/Users/' + userId);
            
            response.data = { curlCommand: response.config.curlCommand };
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'GET') {
            // Filtering
            const response = await axiosInstance.get(url + '/Users' + body.qs);
            
            response.data.curlCommand = response.config.curlCommand;
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } else if (body.method === 'PATCH') {
            const userId = body.user.id;
            const userName = body.user.userName;
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

            // Updating a user
            const response = await axiosInstance.patch(url + '/Users/' + userId, patchData);
            
            response.data.curlCommand = response.config.curlCommand;
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('Unknown method', { status: 400 });
        }
    } catch (error) {
        console.error(error);
        const errorData = _.pick(error.response, 'statusText', 'status', 'data', 'url');
        return new Response(JSON.stringify(errorData), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}