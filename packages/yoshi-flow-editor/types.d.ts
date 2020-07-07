/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference path="global.d.ts" />

declare module '*.md' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.html' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.st.css' {
  type StateValue = boolean | number | string;

  interface StateMap {
    [stateName: string]: StateValue;
  }

  interface AttributeMap {
    className?: string;
    [attributeName: string]: StateValue | undefined;
  }

  interface InheritedAttributes {
    className?: string;
    [props: string]: any;
  }

  type RuntimeStylesheet = {
    (
      className: string,
      states?: StateMap,
      inheritedAttributes?: InheritedAttributes,
    ): AttributeMap;
    $root: string;
    $namespace: string;
    $depth: number;
    $id: string | number;
    $css?: string;

    $get(localName: string): string | undefined;
    $cssStates(stateMapping?: StateMap | null): StateMap;
  } & { [localName: string]: string };

  const stylesheet: RuntimeStylesheet;
  export default stylesheet;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module '*.inline.worker.ts' {
  const value: any;
  export = value;
}

declare module 'wix-base-ui/*';
