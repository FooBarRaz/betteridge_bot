#!/usr/bin/env node

const qs = require("querystring");
const https = require('https');

const username = process.env.username;
const password = process.env.password;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const authEndpoint = 'https://www.reddit.com/api/v1/access_token';

function getBasicAuth(user, pass) {
    const userPass = `${user}:${pass}`;
    return `Basic ${new Buffer(userPass).toString('base64')}`;
}

function doWithToken(callback) {
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": getBasicAuth(clientId, clientSecret),
            "cache-control": "no-cache",
        }
    };

    const req = https.request(authEndpoint, options, res => {
        const chunks = [];

        res.on("data", chunk => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            const body = Buffer.concat(chunks);
            const token = JSON.parse(body).access_token;
            callback(token);
        });
    });

    req.write(qs.stringify({
        grant_type: 'password',
        username: username,
        password: password,
    }));
    req.end();
}

function getAndDo(url, options, callback) {
    const req = https.get(url, options, res => {
        const chunks = [];

        res.on("data", chunk => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            const body = Buffer.concat(chunks);
            const data = JSON.parse(body);
            callback(data);
        });
    });

    req.end();
}

function readHeadline(token) {
    const options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`,
            "cache-control": "no-cache",
            "User-Agent": "BetteridgeBot by betteridge_bot"
        }
    };
    const url = 'https://oauth.reddit.com/r/all/hot';
    getAndDo(url, options, ({data}) => writeHeadlinesToConsole(data.children.map(x => x.data)));
}

function writeHeadlinesToConsole(posts) {
    posts
        .map(
        post => ({
            title: post.title,
            subreddit: post.subreddit_name_prefixed
        }))
        .forEach(console.log);
}

exports.handler = async (event) => {
    doWithToken(readHeadline);
};

exports.handler({type: 'foo'});

