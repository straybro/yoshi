import React from 'react';
import {
  getEditorParams,
  EditorSDK,
  IEditorSDKConfig,
} from 'yoshi-flow-editor-runtime';
import TextLabel from 'wix-base-ui/lib/controls/textLabel';
import TextInput from 'wix-base-ui/lib/controls/textInput';
import { TextInputLabeled } from 'wix-base-ui/lib/composites/composites';
import { EditorSDK as IEditorSDK } from '@wix/platform-editor-sdk';
import { WidgetEditorAPI } from '@wix/bob-widget-services';
import './Settings.global.scss';

interface WidgetSettingsPanelProps {
  editorSDK: IEditorSDK;
  editorSDKConfig: IEditorSDKConfig;
}

interface WidgetSettingsPanelState {
  ready: boolean;
  initialText: string;
}

class WidgetSettingsPanel extends React.Component<
  WidgetSettingsPanelProps,
  WidgetSettingsPanelState
> {
  private onInitialTextValueChange: (initialText: string) => void;
  private appAPI!: WidgetEditorAPI;
  private componentId: string;

  constructor(props: WidgetSettingsPanelProps) {
    super(props);

    this.state = {
      ready: false,
      initialText: 'Click the button',
    };

    const { componentId } = getEditorParams();
    if (!componentId) {
      throw new Error('No `componentId` was passed via query params');
    }
    this.componentId = componentId;

    this.onInitialTextValueChange = (initialText) => {
      this.setState({ initialText });
      this.appAPI.updateWidgetProp(
        this.componentId,
        'initialText',
        initialText,
      );
    };
  }

  async componentDidMount() {
    const { editorSDK } = this.props;

    this.appAPI = await editorSDK.editor.getAppAPI();
    const initialProps = await this.appAPI.getWidgetProps(this.componentId);

    this.setState({
      ...initialProps,
      ready: true,
    });
  }

  render() {
    const { ready } = this.state;

    return (
      ready && (
        <div className="root-container">
          <TextInputLabeled>
            <TextLabel value="Initial text" />
            <TextInput
              value={this.state.initialText}
              placeholder="Enter value"
              onChange={this.onInitialTextValueChange}
            />
          </TextInputLabeled>
        </div>
      )
    );
  }
}

export default () => (
  <EditorSDK>
    {(sdk) => (
      <WidgetSettingsPanel
        editorSDK={sdk.editorSDK as IEditorSDK}
        editorSDKConfig={sdk.editorSDKConfig}
      />
    )}
  </EditorSDK>
);
