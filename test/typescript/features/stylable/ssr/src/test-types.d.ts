declare module '*.st.css' {
  import { RuntimeStylesheet } from '@stylable/runtime';

  const value: RuntimeStylesheet;
  export = value;
}
