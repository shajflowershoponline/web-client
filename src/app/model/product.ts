import { Category } from "././category";
import { File } from "./file.model";
import { ProductCollection } from "././product-collection";
import { ProductImage } from "././product-image";
import { Discounts } from "./discounts";
import { GiftAddOns } from "./gift-add-ons";
import { CustomerUserWishlist } from "./customer-user-wish-list.model";
export class Product {
  productId: string;
  sku: string | null;
  name: string;
  shortDesc: string;
  price: string;
  discountPrice: string;
  size: number; // 1 | 2 | 3
  longDesc: string;
  interested: number;
  iAmInterested: boolean;
  active: boolean;
  category: Category;
  thumbnailFile: File;
  productCollections: ProductCollection[];
  productImages: ProductImage[];
  selectedGiftAddOns: GiftAddOns[];
  selectedDiscounts: Discounts[];
  customerUserWishlist: CustomerUserWishlist;
}
