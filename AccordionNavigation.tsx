import { pipe } from 'fp-ts/function';
import * as arrayR from 'fp-ts/ReadonlyArray';
import React from 'react';

import { useObservable } from '../../../generic/supply/react-helpers';
import { AccordionGroup } from './AccordionGroup';
import { DepsAccordionNavigation } from './deps';

interface IProps<A, B> extends React.HTMLAttributes<HTMLDivElement>, DepsAccordionNavigation<A, B> {
  ref?: React.Ref<HTMLDivElement>;
}

const Component = <A, B>(
  { state$, stateR$, ctorItems, displayGroup, displayItem, eqA, eqB, ...rest }: IProps<A, B>,
  ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element => {
  const stateR = useObservable(stateR$);
  return (
    <div ref={ref} {...rest}>
      {pipe(
        stateR.value,
        arrayR.mapWithIndex((i, group) => (
          <AccordionGroup
            eqB={eqB}
            eqA={eqA}
            key={`${group} ${i}`}
            items={ctorItems(group)}
            displayItem={displayItem}
            displayGroup={displayGroup}
            state$={state$}
            group={group}
            isPlaceholder={stateR.isPlaceholder}
          />
        ))
      )}
    </div>
  );
};

interface IAccordionNavigation {
  <A, B>(props: IProps<A, B>): JSX.Element;
}

export const AccordionNavigation: IAccordionNavigation = React.memo(
  React.forwardRef(Component)
) as unknown as IAccordionNavigation;
