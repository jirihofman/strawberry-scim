import axios from 'axios';
import _ from 'lodash';

export default (req, res) => {
    let headers = { 'Authorization': 'Bearer ' + req.body.secretToken };
    if (req.method === 'POST') {
        axios
            .get(req.body.url + '/Users?filter=userName eq "bf3f8e8d-f431-4adf-bbe0-833dd06e2a80"', { headers })
            .then(get => {
                res.status(200).json(get.data);
            }).catch(error => {
                return res.status(400).json(_.pick(error.response, 'statusText', 'status', 'data'));
            });
    } else {
        res.status(400).end('POST required');
    }
};
