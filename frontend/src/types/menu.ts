export interface QuickMenu {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string;
  menuCode: string;
  displayOrder: number | null;
  isActive: boolean;
}
