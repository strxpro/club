const fetch = require('node-fetch');

const API_KEY = 'cef830252713a75968dd501948b06464';

async function test() {
    const res = await fetch('https://v3.football.api-sports.io/standings?league=135&season=2025', {
        headers: {
            'x-apisports-key': API_KEY
        }
    });
    const data = await res.json();
    console.log("STANDINGS:", JSON.stringify(data, null, 2));

    const res2 = await fetch('https://v3.football.api-sports.io/fixtures?team=490&season=2025', {
        headers: {
            'x-apisports-key': API_KEY
        }
    });
    const data2 = await res2.json();
    console.log("FIXTURES RESULTS:", data2.results);
    console.log("FIXTURES ERRORS:", data2.errors);
}

test();
