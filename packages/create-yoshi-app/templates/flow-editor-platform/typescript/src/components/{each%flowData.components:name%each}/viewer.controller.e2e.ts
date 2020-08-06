import eventually from 'wix-eventually';
import { viewerUrl } from '../../../dev/sites';

const BUTTON_SELECTOR = '[data-testid=buttonElement]';

describe('Viewer App', () => {
  it('should change text on button click', async () => {
    await page.goto(viewerUrl);
    await page.waitForSelector('h2');

    const widgetText = await page.$eval('h2', (node) =>
      node?.textContent?.toLowerCase().trim(),
    );

    expect(widgetText).toEqual('click the button');

    await page.waitForSelector(BUTTON_SELECTOR);
    await page.click(BUTTON_SELECTOR);

    eventually(async () => {
      const widgetTextAfterClick = await page.$eval('h2', (node) =>
        node?.textContent?.toLowerCase().trim(),
      );
      expect(widgetTextAfterClick).toEqual('you clicked the button');
    });
  });
});
