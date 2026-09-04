export type EquipmentId =
  | 'pull_up_bar'
  | 'chair'
  | 'table'
  | 'towel'
  | 'school_bag';

export interface EquipmentItem {
  id: EquipmentId;
  name: string;
  description: string;
  iconName: string;
  isOptionalVariation: boolean;
}

