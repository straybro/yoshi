import { widgetScriptBuilder } from '@wix/bob-widget-services';
import {
  WixSelector,
  WixCodeAPI,
  WidgetAPI,
  ControllerConfig,
  AppParams,
} from '@wix/bob-widget-services/dist/src/types/viewerTypes';

const DEFAULT_PROPS = {
  initialText: 'Click the button',
  textFromButton: 'You clicked the button',
};

function createWidget({
  $w,
  $widget,
}: {
  $w: WixSelector;
  $widget: WidgetAPI;
}) {
  return {
    pageReady: async () => {
      $w('#widgetText').text = $widget.props.initialText;

      $w('#widgetButton').onClick(() => {
        $w('#widgetText').text = $widget.props.textFromButton;
      });
    },
  };
}

const widgetViewerController = widgetScriptBuilder()
  .withDefaultProps(DEFAULT_PROPS)
  .withCreateMethod(createWidget)
  .build();

export default ({
  controllerConfig,
}: {
  controllerConfig: {
    config: ControllerConfig;
    $w: WixSelector;
    wixCodeApi: WixCodeAPI;
    appParams: AppParams;
  };
}) => widgetViewerController(controllerConfig);
