import { route, render } from 'yoshi-serverless';

export default route(async function () {
  const html = await render('app', { foo: '123' }); // test this.req type

  return html;
});
