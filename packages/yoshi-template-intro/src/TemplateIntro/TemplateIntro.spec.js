import React from 'react';
import { mount } from 'enzyme';
import Intro from './TemplateIntro';

describe('Intro', () => {
  let wrapper;

  afterEach(() => wrapper.unmount());

  it('renders a logo', () => {
    wrapper = mount(<Intro />);

    expect(wrapper.find('[alt="logo"]').length).toBe(1);
  });
});
