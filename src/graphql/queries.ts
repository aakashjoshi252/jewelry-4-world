import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query {
    me {
      id
      username
      email
      isEmailVerified
      products {
        id
        name
        description
        material
        slug
        createdAt
        reviewCount
        averageRating
        price
        category {
          name
        }
        variations {
          price
          size
          color
        }
      }
    }
  }
`;

export const WE_QUERY = gql`
  query Me {
    we {
      id
      username
      email
      contact
      isEmailVerified
      addresses {
        id
        streetAddress
        streetAddress2
        country
        state
        city
        zipcode
      }
    }
  }
`;

export const MY_ADDRESSES = gql`
  query MyAddresses {
    myAddresses {
      id
      streetAddress
      streetAddress2
      city
      state
      country
      zipcode
    }
  }
`;

export const GET_WISHLISTS = gql `
 query {
  getWishlist {
    id
    createdAt
    items {
      product {
        id
        name
        description
        size
        price
        slug
        averageRating
        reviewCount
      }
      variation {
      id
      size
      color
      price
      }  
    }
  }
}
`;

export const GET_MY_ADDRESSES = gql`
  query MyAddresses {
    myAddresses {
      id
      streetAddress
      streetAddress2
      city
      state
      country
      zipcode
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

export const CATEGORY_BY_SLUG = gql`
   query($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      slug
      products {
        name
        price
        slug
        reviewCount
        averageRating
        reviewCount
        category {
          name
        }
        slug
        material
      }
    }
  }
`;


export const GET_PARENT_CATEGORIES = gql`
  query {
    parentCategories {
      id
      name
      slug
    }
  }
`;

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($parentCategoryId: String!) {
    subcategories(parentCategoryId: $parentCategoryId) {
      id
      name
    }
  }
`;


export const ALL_PRODUCTS_QUERY = gql `
  query {
    allProducts {
      id
      name
      description
      material
      price
      createdAt
      reviewCount
      slug
      averageRating
      category {
        name
      }
      variations {
        color
        price
        size
      }
    }
  }
`;

export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: ID!) {
    company(id: $id) {
      id
      cname
      email
      contact
      location
      status
      statusHistory
      isEmailVerified
      createdAt
      updatedAt
      products {
        id
        name
        price
        stock
        status
      }
    }
  }
`;

export const UPDATE_COMPANY_STATUS = gql`
  mutation UpdateCompanyStatus($id: ID!, $status: CompanyStatus!, $statusNote: String) {
    updateCompanyStatus(id: $id, status: $status, statusNote: $statusNote) {
      id
      status
      statusHistory
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql `
 query($productId: String!) {
  product(id: $productId) {
    id
    name
    description
    price
    size
    material
    slug
    createdAt
    category {
      id
      name
    }
    variations {
      name
      price
      size
    }
    averageRating
    reviewCount
    reviews {
      comment
      rating
      sentiment
    }
    company {
      cname
    }
  }
}
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query ProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
      slug
      price
      size
      createdAt
      weight
      averageRating
      reviewCount
      material
      reviews {
       id
       comment
       sentiment
       rating
       createdAt 
       user {
       username
       }
      }
      variations {
        id
        size
        color
        price
        slug
      }
      category {
        id
        name
      }
      company {
      cname
      }  
    }
  }
`;


export const FILTERED_PRODUCTS_QUERY = gql`
  query FilteredProducts(
    $search: String
    $category: String
    $material: String
    $minPrice: Float
    $maxPrice: Float
  ) {
    filteredProducts(
      search: $search
      category: $category
      material: $material
      minPrice: $minPrice
      maxPrice: $maxPrice
    ) {
      id
      name
      price
      description
      slug
      createdAt
      material
      category {
        name
      }
      variations {
      color
      price
      size
      }  
    }
  }
`;

export const GET_MATERIALS = gql `
  query {
    getMaterials {
      material
    }
  }
`;

export const GET_UNIQUE_SIZES = gql `
  query {
    getUniqueSizes
  }
`;

export const GET_SELLER_ORDERS = gql `
 query {
  getSellerOrders {
    id
    createdAt
    total
    items {
      id
      createdAt
      price
      quantity
      product {
        name
        price
      }
    } user {
      username
      addresses {
        country
        state
        city
        streetAddress
        streetAddress2
        zipcode
        }
    }
  }
}
`;

export const PRODUCT_REVIEWS_QUERY = gql`
  query ProductReviews(
    $slug: String!
    $limit: Int!
    $offset: Int!
  ) {
    productReviews(
      slug: $slug
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        comment
        rating
        sentiment
        createdAt
        user {
          id
          username
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetOrder($id: String!) {
    getOrder(id: $id) {
      id
      status
      total
      createdAt
      items {
        id
        quantity
        price
        product {
          name
        }
        variation {
          size
        }
      }
    }
  }
`;

export const GET_EVERY_ORDER_BY_USER = gql`
  query GetOrders {
    getOrders {
      id
      status
      total
      createdAt
      items {
        id
        quantity
        price
        product {
          name
        }
        variation {
          size
        }
      }
    }
  }
`;

export const GET_SIMILAR_PRODUCTS = gql `
  query GetSimilarProducts($productId: String!, $category: String!) {
  getSimilarProducts(productId: $productId, category: $category) {
    category {
      name
    }
    id  
    name
    slug
    price
    averageRating
    reviewCount
    description
    material
  }
}
`;

export const GET_USERS = gql `
 query {
   users {
    id
    username
    email
    contact
    isEmailVerified
    createdAt
    updatedAt
  }
}
`;

export const GET_USER_RATING = gql `
 query {
  userReviews {
    product {
      name
    }
    rating
  }
}
`;

export const GET_COMPANIES = gql `
 query {
  getCompanies {
    id
    cname
    username
    contact
    email
    location
    createdAt
    products {
      id
      name
      price
      description
      material
      size
      category{
      name
      }
      averageRating
      reviewCount
    }
  }
}
`;

export const GET_CURRENTSELLER_PRODUCTS = gql `
 query {
  myProducts {
    id
    name
    description
    price
    size
    weight
    material
    slug
    category {
      id
      name
    }
    variations {
    id
    color
    size
    price
    }
    createdAt
    reviewCount
    averageRating
    reviews {
      comment
      sentiment
      rating
    }
    company {
      cname
    }
  }
}
`;

export const GET_ADMIN = gql `
  query {
    getadmin {
      id
      username
      email
      isEmailVerified
    }
  }
`;

export const GET_PAGINATION = gql `
 query PaginatedProducts($limit: Int!, $cursor: String) {
  paginatedProducts(limit: $limit, cursor: $cursor) {
    products {
      id
      name
      createdAt
      description
      material
      averageRating
      reviewCount
      reviews {
        comment
      }
      size
      price
    }
    hasMore
    nextCursor
  }
}
`;

export const SELLER_PRODUCT_PAGINATION = gql`
 query PaginatedMyProducts($limit: Int!, $offset: Int!) {
  paginatedMyProducts(limit: $limit, offset: $offset) {
    products {
      id
      name
      createdAt
      description
      size
      slug
      price
      reviewCount
      averageRating
      reviews {
      comment
      }
      category {
      name
      }
    }
    total
    hasMore
  }
}
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    getCartItems {
      id
      quantity
      product {
        id
        name
        price
        description
        material
        images
        category {
          id
          name
        }
      }
      variation {
        id
        size
        color
        price
      }
    }
  }
`;

export const GET_CART_ITEMS_BY_USERS = gql `
 query {
  getCartItemsbyusers {
    id
    quantity
  }
}
`;

// export const GET_CART = gql`
//   query {
//     getCart {
//       id
//       total
//       items {
//         id
//         quantity
//         price
//         size
//         product {
//           name
//         }
//         variation {
//           size
//           price
//         }
//       }
//     }
//   }
// `;

export const GET_CART = gql`
  query GetCart {
    getCart {
      id
      createdAt
      updatedAt
      total
      user {
      id
      username
      email
      addresses {
      country
      state
      city
      streetAddress
      streetAddress2
      zipcode
      }
      }
      items {
        id
        quantity
        price
        size
        product {
          id
          name
          slug
        }
        variation {
          id
          size
          price
        }
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      user {
        username
      }
      createdAt
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql `
  query ProductReviews($productId: String!, $limit: Int!, $offset: Int!) {
  productReviews(productId: $productId, limit: $limit, offset: $offset) {
    items {
      id
      rating
      comment
      sentiment
      createdAt
      user {
        username
      }
    }
    total
    hasMore
  }
}
`;

export const GET_PRODUCTS_BY_CATEGORY = gql `
  query($name: String!) {
    productsByCategory(name: $name) {
      name
      description
      slug
      averageRating
      price
      material
    }
  }
`;

export const GET_TOP_RATED_PRODUCTS = gql `
  query TopRatedProducts($limit: Int) {
    topRatedProducts(limit: $limit) {
      id
      name
      slug
      description
      material
      averageRating
      reviewCount
      price
      category {
        name
        slug
      }
      variations {
        id
        price
        size
        color
        slug
      }
      reviews {
        rating
      }
    }
  }
`;