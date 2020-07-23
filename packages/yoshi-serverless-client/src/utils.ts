import { DSL, FunctionResult, FunctionArgs } from 'yoshi-serverless/types';

// we replaced `isomorphic-unfetch` because we want it to support web-workers
// see: https://github.com/developit/unfetch/pull/109
const unfetch = require('./isomorphic-unfetch');

// https://github.com/developit/unfetch/issues/46
const fetch = unfetch;

export function joinUrls(baseUrl: string, relativeUrl: string) {
  return baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '');
}

export function showToast<
  Result extends FunctionResult,
  Args extends FunctionArgs
>(error: any, method: DSL<Result, Args>, args: any, baseUrl: string) {
  const Toastify = require('toastify-js');

  createCss();

  Toastify({
    duration: 60000,
    gravity: 'bottom',
    position: 'right',
    stopOnFocus: true,
    close: true,
    text: `😱😱😱 There was an error on your server function call. Click to open on your IDE<BR/>
                  File: <b style="color: blue;cursor: pointer;"><u>${method.fileName}</u></b>, method: <b>${method.functionName}</b>: <BR/>
                  Arguments: <b>${args}</b> <BR/>
                  Error: ${error.errors[0].message}
              `,
    className: 'popover',
    async onClick() {
      const [, file, line, col] = error.errors[0].stack.match(
        /\/([/\w-_.]+\.[j|t]sx?):(\d*):(\d*)/,
      );
      await fetch(
        baseUrl + `/_launchEditor_?file=${file}&line=${line}&col=${col}`,
        {
          credentials: 'same-origin',
          method: 'GET',
        },
      );
    },
  }).showToast();
}

function createCss() {
  const toastStyle = 'toast-style';
  if (document.querySelector(`#${toastStyle}`)) {
    return;
  }
  const css = document.createElement('style');
  css.id = toastStyle;
  css.textContent = `
    .toast-close {
      position: absolute;
      top: 0px;
      right: 0px;
      margin: 5px;
      cursor: pointer;
    }
    .popover {
      position: absolute;
      right: 20px;
      padding: 10px 20px;
      max-width: 500px;
      background: #fff;
      color: #000;
      font: initial;
      cursor: initial;
      letter-spacing: initial;
      text-shadow: initial;
      text-transform: initial;
      visibility: initial;
      font-size: 12px;
      line-height: 1.5;
      align-items: center;
      box-shadow: 0 11px 40px 0 rgba(0, 0, 0, 0.25), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
      transition: bottom 1.5s ease;
    }
  `;

  document.body.appendChild(css);
}
