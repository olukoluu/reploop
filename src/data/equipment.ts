import { EquipmentItem } from '../types/equipment';

export const AVAILABLE_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'pull_up_bar',
    name: 'Pull-up Bar',
    description: 'Enables pull-ups and chin-ups on Pull Day (replaces towel, superman, and table pull-ups).',
    iconName: 'git-commit-outline',
    isOptionalVariation: true,
  },
  {
    id: 'chair',
    name: 'Chair / Bench',
    description: 'Used for Chair Dips (Push Day & Upper Day) and Incline Push-ups.',
    iconName: 'cube-outline',
    isOptionalVariation: false,
  },
  {
    id: 'table',
    name: 'Sturdy Table',
    description: 'Used for Table Inverted Pull-ups on Pull Day & Upper Day.',
    iconName: 'tablet-landscape-outline',
    isOptionalVariation: false,
  },
  {
    id: 'towel',
    name: 'Towel',
    description: 'Used for Towel Back Extensions on Pull Day.',
    iconName: 'layers-outline',
    isOptionalVariation: false,
  },
  {
    id: 'school_bag',
    name: 'Backpack / School Bag',
    description: 'Weighted backpack for Bicep Curls on Pull Day & Upper Day.',
    iconName: 'briefcase-outline',
    isOptionalVariation: false,
  },
];

