export interface Wishlist {
    variation: {
       id: string;
       price: number;
       size: string;
       color: string;
    };
    id: string;
    product: {
      slug: string;
      id: string;
      name: string;
      price: number;
      size: string;
      weight: string;
      description: string;
      material: string;
      averageRating: string;
    }
  }