import express  from 'express';
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import cors from 'cors'
import { timeStamp } from 'console';
const app = express();
const port = 3000;

app.use(cors({
    origin: '*',
    credentials: true,
    crossorigin: true,
}))

const server_in4 = await fs.promises.readFile('server_in4.json', 'utf8');
const data = JSON.parse(server_in4);
var clientId = data.client_id;
var clientSecret = data.client_secret;
var redirectUri = data.redirect_uri;

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/install', async (req, res) => {
    if(server_in4 == null){
        alert("Something wrong! Please try again!");
        res.redirect('/');
    }
    else{
        var authUrl = `https://b24-gch904.bitrix24.vn/oauth/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}/callback`;
        res.redirect(authUrl);
    }
});

app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    console.log(`Authorization Code: ${authorizationCode}`);
    try {
        const response = await axios.post('https://oauth.bitrix.info/oauth/token/', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: authorizationCode
            }
        });
        const dataResponse = await response.data;
        saveTokens(dataResponse.access_token, dataResponse.refresh_token, dataResponse.expires_in);
        res.redirect('/');
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Error while exchanging code for token.');
        res.redirect('/');
    }
});

function saveTokens( access_Token, refresh_Token, expires_In) {
    const tokens = { access_Token, refresh_Token, expires_In, timeStamp: Date.now() };
    fs.writeFileSync('tokens.json', JSON.stringify(tokens));
}

async function getNewToken() {
    const tokens_data = await fs.promises.readFile('tokens.json', 'utf8');
    const tokens = JSON.parse(tokens_data);
    console.log(tokens.expires_In);
    if (Date.now() >= tokens.timeStamp + tokens.expires_In * 1000)
    {
        console.log(Date.now());
        console.log(tokens.timeStamp);
        try {
            const response = await axios.post('https://oauth.bitrix.info/oauth/token/',null, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: tokens.refresh_Token
                }
            });
            const dataResponse = await response.data;
            if(dataResponse != null)
            {
                saveTokens(dataResponse.access_token, dataResponse.refresh_token, dataResponse.expires_in);
                console.log(clientId + ' ' + clientSecret + ' ' + tokens.refresh_Token);
                console.log(dataResponse);
            }
            else
            {
                console.log('Failed to refresh token' , response.status);
            }
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
};

// Hàm gọi API bất kì
async function callBitrixApi(action, payload) {
    try {
        getNewToken();
        const tkData = await fs.promises.readFile('tokens.json', 'utf8');
        const tokens = JSON.parse(tkData);
        let token = tokens.access_Token;
        console.log(`Token: ${token}`);
        const response = await fetch(`https://b24-gch904.bitrix24.vn/rest/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            getNewToken();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data)}`);
        return data;
    }
    catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, renew it
            const newToken = await getNewToken();
            if (newToken) {
                return callBitrixApi(action, payload);
            }
        }
        console.error('Error calling Bitrix API:', error);
        return null;
    }
}

// app.get('/employee', async (req, res) => {
//     try {
//         console.log('Fetching employees...');
//         const action = 'user.get.json';
//         const employeesResponse = await callBitrixApi(action, {});
//         if (employeesResponse) {
//             console.log('Employees fetched successfully:', employeesResponse);
//             res.json(employeesResponse.result);
//         } else {
//             console.error('Failed to fetch employees');
//             res.status(500).json({ error: 'Failed to fetch employees' });
//         }
//     } catch (error) {  
//         console.error('Error fetching employees:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

app.get('/contacts', async (req, res) => {
    try {
        console.log('Fetching contacts...');
        const action = 'crm.contact.list';
        const contactsResponse = await callBitrixApi(action, {});
        if (contactsResponse) {
            console.log('Contacts fetched successfully:', contactsResponse);
            res.json(contactsResponse.result);
        } else {
            console.error('Failed to fetch contacts');
            res.status(500).json({ error: 'Failed to fetch contacts' });
        }
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/contacts/:id', async (req, res) => {
    try {
        console.log('Fetching contact with ID:', req.params.id, '...');
        const action = 'crm.contact.get?id=' + req.params.id;
        const contactResponse = await callBitrixApi(action, {});
        if (contactResponse) {
            console.log('Contact fetched successfully:', contactResponse);
            res.json(contactResponse.result);
        } else {
            console.error('Failed to fetch contact');
            res.status(500).json({ error: 'Failed to fetch contact' });
        }
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/bank/:id', async (req, res) => {
    try {
        console.log('Fetching bank with ID:', req.params.id, '...');
        const action = 'crm.requisite.bankdetail.get?id=' + req.params.id;
        const bankResponse = await callBitrixApi(action, {});
        if (bankResponse) {
            console.log('Bank fetched successfully:', bankResponse);
            res.json(bankResponse.result);
        } else {
            res.json(bankResponse.result);
            console.error('Failed to fetch bank');
            res.status(500).json({ error: 'Failed to fetch bank' });
        }
    } catch (error) {
        console.error('Error fetching bank:', error);
        res.status(500).json({ error: error.message });
    }  
});

app.get('/refresh', async (req, res) => {
    try {
        console.log('Refreshing token...');
        getNewToken();
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
