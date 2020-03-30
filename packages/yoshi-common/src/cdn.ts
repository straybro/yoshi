import fs from 'fs';
import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import serveHandler from 'serve-handler';
import { STATICS_DIR } from 'yoshi-config/build/paths';

export async function startCDN({ port, ssl }: { port: number; ssl: boolean }) {
  function serverFn(req: IncomingMessage, res: ServerResponse) {
    return serveHandler(req, res, {
      public: STATICS_DIR,
      headers: [
        {
          source: '*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Origin, X-Requested-With, Content-Type, Accept',
            },
          ],
        },
      ],
    });
  }

  function httpCdn() {
    return http.createServer(serverFn);
  }

  function getSslCertificate() {
    const customCertPath = process.env.CUSTOM_CERT_PATH;
    const customCertKeyPath = process.env.CUSTOM_CERT_KEY_PATH;
    if (customCertPath && customCertKeyPath) {
      return {
        cert: customCertPath,
        key: customCertKeyPath,
      };
    }

    return {
      cert: fs.readFileSync(
        require.resolve('yoshi-helpers/certificates/server.cert'),
        'utf-8',
      ),
      key: fs.readFileSync(
        require.resolve('yoshi-helpers/certificates/server.key'),
        'utf-8',
      ),
      passphrase: '1234',
    };
  }

  function httpsCdn() {
    return https.createServer(getSslCertificate(), serverFn);
  }

  const server = ssl ? httpsCdn() : httpCdn();
  await new Promise(resolve => server.listen(port, resolve));

  return {
    close: () => new Promise(resolve => server.close(resolve)),
  };
}
