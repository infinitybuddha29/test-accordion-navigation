import * as eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as atom from 'fp-ts-atom/dist/Atom';
import * as atomR from 'fp-ts-atom/dist/ReadonlyAtom';

import { ph } from '../../../generic/instances';
import { Query } from '../../../generic/supply/remote-action/Query';

export interface DepsAccordionNavigation<A, B> {
  state$: atom.Atom<{ openedGroups: readonly A[]; selectedItem: O.Option<B> }>;
  stateR$: atomR.ReadonlyAtom<ph.Placeholder<readonly A[]>>;
  ctorItems: (group: A) => Query<unknown, readonly B[]>;
  displayGroup: (group: A) => JSX.Element;
  displayItem: ({ item, isActive }: { item: B; isActive: boolean }) => {
    left: JSX.Element;
    right: JSX.Element;
  };
  eqA: eq.Eq<A>;
  eqB: eq.Eq<B>;
}
