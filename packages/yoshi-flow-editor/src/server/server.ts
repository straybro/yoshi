import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import httpTestkit from '@wix/wix-http-testkit';
import bodyParser from 'body-parser';
import cors from 'cors';
import importCwd from 'import-cwd';
import { bootstrap, AmbassadorTestkit } from 'yoshi-serverless-testing';
import proxy from 'express-http-proxy';
import { AppConfig } from '../model';
import velocityDataPrivate from './velocity.private.data.json';
import velocityData from './velocity.data.json';
import renderVM from './vm';

type Mocks = {
  default: ({
    ambassadorTestkit,
  }: {
    ambassadorTestkit: AmbassadorTestkit;
  }) => void;
};

const getSentryConfig = (config: AppConfig | null) => {
  return config?.sentry ?? null;
};

const getProxyConfig = (config: AppConfig | null) => {
  return config?.localProxy ?? null;
};

const serverDirectory = 'node_modules/yoshi-flow-editor/build/server';
const editorTemplate = path.resolve(__dirname, './templates/editorApp.vm');
const settingsTemplate = path.resolve(__dirname, './templates/settingsApp.vm');
const applicationConfig = importCwd.silent(
  './.application.json',
) as AppConfig | null;
const sentry = getSentryConfig(applicationConfig);
const proxyConfig = getProxyConfig(applicationConfig);

const server = httpTestkit.server({
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  ssl: {
    cert: fs.readFileSync(
      path.join(serverDirectory, 'certificates/cert.pem'),
      'utf-8',
    ),
    key: fs.readFileSync(
      path.join(serverDirectory, 'certificates/key.pem'),
      'utf-8',
    ),
    // @ts-ignore
    passphrase: '1234',
  },
});

const app = server.getApp();

app.use(bodyParser.json());
app.use(cors());

app.get(
  '/_api/wix-laboratory-server/laboratory/conductAllInScope',
  (req, res) => {
    const experiments = {
      ...velocityData.experiments,
      ...velocityDataPrivate.experiments,
    };
    res.json(experiments);
  },
);

if (proxyConfig) {
  app.use(
    '/_api/*',
    proxy(proxyConfig?.host || 'editor.wix.com', {
      https: true,
      proxyReqPathResolver(req) {
        return req.originalUrl;
      },
    }),
  );
}

app.use('/editor/:widgetName', (req, res) => {
  const { widgetName } = req.params;
  const { instance } = req.query;
  res.send(
    renderVM(editorTemplate, {
      widgetName,
      sentry,
      usePrivateSDKMock: !instance,
    }),
  );
});

app.use('/settings/:widgetName', (req, res) => {
  const { widgetName } = req.params;
  const { instance } = req.query;
  res.send(
    renderVM(settingsTemplate, {
      widgetName,
      sentry,
      usePrivateSDKMock: !instance,
    }),
  );
});

// Launch the server
server
  .start()
  .then(async () => {
    if (process.env.EXPERIMENTAL_YOSHI_SERVERLESS) {
      const serverlessApp = bootstrap();
      await serverlessApp.start();
      // We try to require and call a user file called 'dev/mocks'
      const mocks = importCwd.silent('./dev/mocks') as Mocks | null;
      if (mocks) {
        try {
          mocks.default({ ambassadorTestkit: serverlessApp.ambassador });
        } catch (e) {
          console.error(
            `
          ------------------ oh no 🤪 ------------------
          There was an error running the 'dev/mocks' file.
          Please make sure that you have a file with:
          export default ({ ambassadorTestkit }) => {
            // Mock your RPC here
          }

          ${e}
          `,
          );
        }
      }
    }
  })
  .catch((err) => {
    console.error(
      `Fake server failed to start on port ${process.env.PORT}: ${err.message}`,
    );
  });
