import path from 'path';
import globby from 'globby';
import { isLeft } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import serializeError from 'serialize-error';
import { BUILD_DIR } from 'yoshi-config/build/paths';
import { requestPayloadCodec, DSL } from '../types';
import { relativeFilePath, connectToYoshiServerHMR, HttpError } from '../utils';
import { route } from '..';
import nonWebpackRequireFresh from '../non-webpack-require-fresh';

const buildDir = path.resolve(__dirname, '..', '..', BUILD_DIR);

let functions = createFunctions();

function createFunctions() {
  const serverChunks = globby.sync('**/*.api.js', {
    cwd: buildDir,
    absolute: true,
  });

  const functions: {
    [filename: string]: { [functionName: string]: DSL<any, any> };
  } = serverChunks.reduce((acc, absolutePath) => {
    const filename = relativeFilePath(buildDir, absolutePath);

    return {
      ...acc,
      [filename]: nonWebpackRequireFresh(absolutePath),
    };
  }, {});

  return functions;
}

if (process.env.NODE_ENV === 'development') {
  const socket = connectToYoshiServerHMR();

  socket.onmessage = async () => {
    try {
      functions = createFunctions();
    } catch (error) {
      socket.send(JSON.stringify({ success: false }));
    }
    socket.send(JSON.stringify({ success: true }));
  };
}

export default route(async function () {
  const body = this.req.body; // || (await parseBodyAsJson(this.req));
  const validation = requestPayloadCodec.decode(body);

  if (isLeft(validation)) {
    throw new HttpError(PathReporter.report(validation), 406);
  }

  const { fileName, functionName, args } = validation.right;
  const fn = functions?.[fileName]?.[functionName]?.__fn__;

  if (!fn) {
    throw new HttpError(
      [`Function ${functionName}() was not found in file ${fileName}`],
      406,
    );
  }

  try {
    const fnThis = {
      context: this.context,
      req: this.req,
      initData: this.initData,
    };

    return { payload: await fn.apply(fnThis, args) };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new HttpError(['internal server error'], 500);
    }
    throw new HttpError([serializeError(error)], 500);
  }
});
