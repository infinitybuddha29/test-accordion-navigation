import { StoryWrapper } from '../../../generic/supply/story-helpers';
import { AccordionNavigation } from './AccordionNavigation';
import { useDepsAccordionNavigationKnob } from './useDepsAccordionNavigationKnob';

export default {
  title: 'Modules/+standalone/accordion-navigation/AccordionNavigation',
  component: AccordionNavigation,
};

export const Default = () => (
  <StoryWrapper maxWidth="250px">
    <AccordionNavigation {...useDepsAccordionNavigationKnob()} />
  </StoryWrapper>
);

Default.storyName = '🛡️ AccordionNavigation';
