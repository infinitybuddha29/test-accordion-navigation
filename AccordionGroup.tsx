import * as RD from '@devexperts/remote-data-ts';
import * as F from 'fp-ts/function';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as arrayR from 'fp-ts/ReadonlyArray';
import * as atom from 'fp-ts-atom/dist/Atom';
import React from 'react';
import { style } from 'typestyle';

import { Button } from '../../../generic/components/base/Button';
import { MenuItem } from '../../../generic/components/base/MenuItem';
import { Stack } from '../../../generic/components/layout/Stack';
import { atomSet } from '../../../generic/supply/fp-ts-atom-helpers';
import { arrayRIndexOfDeleteOrAppend } from '../../../generic/supply/fp-ts-helpers';
import { useObservable } from '../../../generic/supply/react-helpers';
import { Query } from '../../../generic/supply/remote-action/Query';
import { tv } from '../../../generic/supply/style-helpers';
import { PlaceholderRectangle } from '../../+details/placeholder/PlaceholderRectangle';
import { StateFailure } from '../states/StateFailure';
import { StatePending } from '../states/StatePending';
import { DepsAccordionNavigation } from './deps';

interface IProps<A, B> extends Omit<DepsAccordionNavigation<A, B>, 'ctorItems' | 'stateR$'> {
  items: Query<unknown, readonly B[]>;
  isPlaceholder: boolean;
  group: A;
}

export const AccordionGroup = <A, B>({
  displayItem,
  items,
  state$,
  displayGroup,
  isPlaceholder,
  group,
  eqA,
  eqB,
}: IProps<A, B>): JSX.Element => {
  const state = useObservable(state$);
  const isOpenedGroup = arrayR.elem(eqA)(group)(state.openedGroups);
  const result = useObservable(items.result$);
  return (
    <>
      <MenuItem
        isFit
        onClick={() =>
          pipe(state$, atom.prop('openedGroups'), atom.modify(arrayRIndexOfDeleteOrAppend(group)))
        }
        className={isPlaceholder ? $groupPlaceholder : $group}
        children={
          isPlaceholder ? <PlaceholderRectangle width="25rem" height="3rem" /> : displayGroup(group)
        }
        rightSide={
          isPlaceholder ? undefined : (
            <Stack isInline isCentered>
              {pipe(
                result,
                RD.fold3(
                  () => <StatePending isMini isInline cancel={items.cancel} />,
                  (error) => <StateFailure isMini isInline error={error} retry={items.retry} />,
                  F.constUndefined
                )
              )}
              <Button icon="caret" iconRotate={isOpenedGroup ? 0 : -90} isFlat isBlack />
            </Stack>
          )
        }
      />
      {!isPlaceholder &&
        isOpenedGroup &&
        pipe(
          result,
          RD.toOption,
          O.fold(F.constUndefined, (items) => (
            <>
              {items.map((item) => {
                const isActive = pipe(
                  state.selectedItem,
                  O.fold(F.constFalse, (v) => eqB.equals(v, item))
                );
                const { left, right } = displayItem({ item, isActive });
                return (
                  <MenuItem
                    onClick={() => pipe(state$, atom.prop('selectedItem'), atomSet(O.some(item)))}
                    isFit
                    className={$item}
                    children={left}
                    rightSide={right}
                    isBlue={isActive}
                    isHoverable={!isActive}
                  />
                );
              })}
            </>
          ))
        )}
    </>
  );
};

const $item = style({
  $nest: { '& + &': { borderTop: `1px solid ${tv('base200')}` } },
});

const $groupPlaceholder = style({
  $nest: { '& + &': { marginTop: '1rem' } },
});

const $group = style({
  $nest: {
    [`.${$item} + &`]: { marginTop: '1rem' },
    '& + &': { borderTop: `1px solid ${tv('base200')}` },
  },
});
