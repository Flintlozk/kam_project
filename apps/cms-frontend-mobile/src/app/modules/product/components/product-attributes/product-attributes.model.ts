export interface IProductAttributesDataItem {
  sku: string;
  image: string;
  status: string;
  price: number;
  discount: number;
  amount: number;
  productVariants: IProductVariantSale[];
}

export interface IProductVariantSale {
  title: string;
  originalPrice: number;
  salePrice: number;
}
