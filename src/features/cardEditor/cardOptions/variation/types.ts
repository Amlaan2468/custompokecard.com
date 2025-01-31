import { CardTypeHelpers, IdentifierInfo } from '../types';

// Currently only Dynamax/Gigantamax; which do not change card styles
export interface Variation extends IdentifierInfo, CardTypeHelpers {
  baseSetDependencies: {
    [id: number]: {
      subtypes: number[];
      rarities: number[];
    };
  };
}
