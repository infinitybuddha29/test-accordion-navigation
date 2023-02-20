import * as eq from 'fp-ts/Eq';
import * as F from 'fp-ts/function';

import { Text } from '../../../generic/components/base/Text';
import { useAtomKnob } from '../../../generic/supply/stories/useAtomKnob';
import { useIsPlaceholderKnob } from '../../../generic/supply/stories/useIsPlaceholderKnob';
import { useOptionKnob } from '../../../generic/supply/stories/useOptionKnob';
import { useQueryKnob } from '../../../generic/supply/stories/useQueryKnob';
import { TUnboxAtom } from '../../../generic/supply/type-utils';
import { Country } from '../../data/other/Country';
import { StoreItemInventory } from '../../data/product-store-items/StoreItemInventory';
import { DepsAccordionNavigation } from './deps';

type Deps = DepsAccordionNavigation<Country, StoreItemInventory>;

export const useDepsAccordionNavigationKnob = (): Deps => ({
  state$: useAtomKnob<TUnboxAtom<Deps['state$']>>({
    openedGroups: [Country.createUnsafe({ code: 'GB', name: 'United Kingdom' })],
    selectedItem: useOptionKnob('selectedItem', StoreItemInventory.ctorItem('Germany')),
  }),
  stateR$: useAtomKnob<TUnboxAtom<Deps['stateR$']>>({
    isPlaceholder: useIsPlaceholderKnob(),
    value: [
      Country.createUnsafe({ code: 'GB', name: 'United Kingdom' }),
      Country.createUnsafe({ code: 'US', name: 'United States' }),
      Country.createUnsafe({ code: 'DE', name: 'Germany' }),
    ],
  }),
  ctorItems: F.constant(
    useQueryKnob({
      name: 'ctorItems',
      result: [
        StoreItemInventory.ctorItem('Germany'),
        StoreItemInventory.ctorItem('United States'),
        StoreItemInventory.ctorItem('United Kingdom'),
      ],
    })
  ),
  displayGroup: (group) => <Text variant="labelBold">{group.name}</Text>,
  displayItem: ({ item, isActive }) => ({
    left: (
      <Text variant="label" isInverted={isActive}>
        {item.name}
      </Text>
    ),
    right: <></>,
  }),
  eqA: eq.eqStrict,
  eqB: eq.eqStrict,
});
