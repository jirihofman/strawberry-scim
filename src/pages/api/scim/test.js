import axios from 'axios';
import curlirize from 'axios-curlirize';
import _ from 'lodash';

export async function POST({ request }) {
    try {
        const body = await request.json();
        
        let headers = { 'Authorization': 'Bearer ' + body.secretToken };
        // initializing axios-curlirize with your axios instance
        curlirize(axios);

        const response = await axios.get(body.url + '/Users?filter=userName eq "bf3f8e8d-f431-4adf-bbe0-833dd06e2a80"', { headers, curlirize: false });
        
        response.data.curlCommand = response.config.curlCommand;
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        const errorData = _.pick(error.response, 'statusText', 'status', 'data');
        return new Response(JSON.stringify(errorData), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}