import readline from 'readline';

type Callback = () => void;

export class UserActionsWatcher {
  private actions: { [key: string]: Callback } = {};

  on(key: string, callback: Callback) {
    this.actions[key] = callback;
  }

  watch() {
    if (!process.stdout.isTTY) {
      return;
    }

    readline.emitKeypressEvents(process.stdin);

    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');

    const CTRL_C = '\u0003';

    process.stdin.on('keypress', (str) => {
      if (str === CTRL_C) {
        process.stdin.setRawMode(false);
        process.exit(130);
      } else {
        this.actions[str]?.(); // eslint-disable-line no-unused-expressions
      }
    });
  }
}

export default function createUserActionsWatcher() {
  const watcher = new UserActionsWatcher();

  watcher.watch();

  return watcher;
}
