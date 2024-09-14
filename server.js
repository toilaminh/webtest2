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

var clientId = null;
var clientSecret = null;
var redirectUri = null;

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// app.get('/', (req, res) => {
//     res.send(`<h1>Welcome to Bitrix24 OAuth App</h1>
//             <p><a href="/install">Install Application</a></p>
//             <p><a href="/employee">Test User API</a></p>`);
// });

// Route chính để bắt đầu quá trình ủy quyền
app.get('/install', async (req, res) => {
    const server_in4 = await fs.promises.readFile('server_in4.json', 'utf8');
    if(server_in4 == null){
        alert("Something wrong! Please try again!");
        res.redirect('/');
    }
    else{
        const data = JSON.parse(server_in4);
        clientId = data.client_id;
        clientSecret = data.client_secret;
        redirectUri = data.redirect_uri;
        var authUrl = `https://b24-gch904.bitrix24.vn/oauth/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}/callback`;
        res.redirect(authUrl);
    }
});

// Route để nhận mã code sau khi người dùng ủy quyền
app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    
    console.log(`Authorization Code: ${authorizationCode}`);
    // Trao đổi mã code lấy access token
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

function saveTokens( access_Token, refresh_Token, expire_In) {
    const tokens = { access_Token, refresh_Token, expire_In, timeStamp: Date.now() };
    fs.writeFileSync('tokens.json', JSON.stringify(tokens));
}

async function getNewToken() {
    const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
    if (Date.now() >= tokens.timestamp + tokens.expires_in * 1000)
    {
        try {
            const response = await axios.post('https://oauth.bitrix.info/oauth/token/', {
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: tokens.refresh_Token
            });
            const dataResponse = await response.json();
            saveTokens(dataResponse.access_token, dataResponse.refresh_token, dataResponse.expires_in);
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
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
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

app.get('/employee', async (req, res) => {
    try {
        console.log('Fetching employees...');
        const action = 'user.get.json';
        const employeesResponse = await callBitrixApi(action, {});
        if (employeesResponse) {
            console.log('Employees fetched successfully:', employeesResponse);
            res.json(employeesResponse.result);
        } else {
            console.error('Failed to fetch employees');
            res.status(500).json({ error: 'Failed to fetch employees' });
        }
    } catch (error) {  
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
