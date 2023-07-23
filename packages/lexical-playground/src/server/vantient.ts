/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/* eslint-disable @typescript-eslint/no-var-requires */
// Note: Have to use require(). import won't work unless the package is marked as a module, but
// doing so breaks a bunch of other stuff T_T
const http = require('http');
const axios = require('axios');
const url = require('url');

const HOSTNAME = 'localhost';
const PORT = 1236;
const API_URL = 'https://cmty.space/api/query/quest';

interface QuestNodeRequest {
  [x: string]: string;
}

const getPostParams = (
  req: http.IncomingMessage,
): Promise<QuestNodeRequest> => {
  let body = '';
  return new Promise((resolve, reject) => {
    req
      .on('data', (chunk: Uint8Array) => {
        body += chunk;
      })
      .on('end', () => {
        const parsed: QuestNodeRequest = JSON.parse(body);
        resolve(parsed);
      })
      .on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });
  });
};

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const pathname = url.parse(req.url).pathname;
    const {method} = req;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (pathname === '/quest') {
      if (method === 'OPTIONS') {
        res.writeHead(200, {});
        res.end();
      } else if (method === 'POST') {
        const jsonData = await getPostParams(req);
        const {data} = await axios.post(API_URL, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        res.statusCode = 200;
        res.write(JSON.stringify(data));
        res.end();
      }
    } else {
      res.writeHead(404, {});
      res.end();
    }
  },
);

server.listen(PORT, HOSTNAME, () => {
  // eslint-disable-next-line no-console
  console.log(`Vantient API proxy server running at ${HOSTNAME}:${PORT}`);
});
