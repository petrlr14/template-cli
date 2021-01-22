import JWT from 'jsonwebtoken';
import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function getJWTFromPEM() {
  try {
    const key = await readFile(
      join(__dirname, `../../${process.env.KEY_NAME}`),
      'utf-8'
    );
    const now = Math.round(Date.now() / 1000);
    const token = JWT.sign(
      {
        iat: now,
        exp: now + Number(process.env.TOKEN_EXP),
        iss: process.env.APP_ID,
      },
      key,
      { algorithm: 'RS256' }
    );
    return token;
  } catch (e) {
    console.log(e);
    exit(1);
  }
}

async function retriveGithubInstallationID(jwt) {
  try {
    const response = await fetch('https://api.github.com/app/installations', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const json = await response.json();
    return json[0].id;
  } catch (e) {
    console.log(e);
    exit(1);
  }
}

async function retriveAccessToken(jwt, installationID) {
  try {
    const response = await fetch(
      `https://api.github.com/app/installations/${installationID}/access_tokens`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        method: 'POST',
      }
    );
    const json = await response.json();
    return json.token;
  } catch (e) {
    console.log(e);
    exit(1);
  }
}

async function getBranchesName(token) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.USER}/${process.env.REPO}/branches`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await response.json();
    return json.map((branch) => {
      return branch.name;
    });
  } catch (e) {
    console.log(e);
    exit(1);
  }
}

export async function getBranches() {
  const jwt = await getJWTFromPEM();
  const installationID = await retriveGithubInstallationID(jwt);
  const x = await retriveAccessToken(jwt, installationID);
  return await getBranchesName(x);
}
