import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($options: LoginInput!) {
    login(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        contact
        isEmailVerified
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($options: RegisterInput!) {
    register(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        contact
        isEmailVerified
      }
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($email: String!, $code: String!) {
    verifyCode(input: { email: $email, code: $code }) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
        isEmailVerified
      }
    }
  }
`;

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
      isEmailVerified
      addresses {
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

export const UPDATE_USER_FIELDS = gql`
 mutation($input: UpdateRegisterInput!, $userid: String!) {
  updateUserFields(input: $input, userid: $userid) {
    username
    email
    contact
  }
}
`;

export const UPDATE_PRODUCT_DETAILS = gql`
 mutation($input: UpdateProductFields!, $productid: String!) {
  updateProducts(input: $input, productid: $productid) {
    name
    price
    description
    material
    size
    weight
  }
}
`;

export const UPDATE_PRODUCTVAR_DETAILS = gql`
 mutation($input: UpdateProductVariations!, $variationid: String!) {
  updateProductVar(input: $input, variationid: $variationid) {
    size
    color
    price
  }
}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ADMIN_LOGIN = gql `
 mutation($options: AdminLoginInput!) {
  adminLogin(options: $options) {
    errors {
      field
      message
    }   
  }
}
`;

export const ADMIN_LOGOUT = gql `
  mutation {
  adminLogout
}
`;

export const REGISTER_COMPANY = gql`
  mutation RegisterCompany($options: RegisterCompanyInput!) {
    registerCompany(options: $options) {
      errors {
        field
        message
      }
       company {
        id
        cname
        username
        email
        contact
        location
        isEmailVerified
     }
    }
  }
`;

export const LOGIN_COMPANY = gql`
  mutation LoginCompany($options: LoginCompanyInput!) {
    loginCompany(options: $options) {
      errors {
        field
        message
      }
      company {
        id
        cname
        email
      }
    }
  }
`;

export const VERIFY_COMPANY = gql`
  mutation VerifyCompany($email: String!, $code: String!) {
    verifyCompany(input: {email: $email,code: $code}) {
      errors {
        field
        message
      }
      company {
        id
        cname
        email
        isEmailVerified
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      material
      weight
      size
      price
      category {
        id
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

export const LOGIN_ADMIN = gql `
  mutation($options: AdminLoginInput!) {
    adminLogin(options: $options) {
      admin {
        email
        username
      }
    }
  }
`;

export const CREATE_USER_ADDRESS = gql`
  mutation CreateUserAddress($input: UserAddressInput!) {
    createUserAddress(input: $input) {
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

export const REGISTER_ADMIN = gql `
  mutation($options: AdminregInput!) {
    adminregister(options: $options) {
      admin {
        id
        username
        email
        isEmailVerified
      }
      errors {
        field
        message
      }
    }
  }
`;

export const VERIFY_ADMINCODE = gql `
  mutation {
    adminCode(options: $options) {
      errors {
        field
        message
      }
      admin {
        id
        username
        email
        isEmailVerified
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId)
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($itemId: String!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      id
      quantity
      price
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: String!, $quantity: Float!, $variationId: String) {
    addToCart(productId: $productId, quantity: $quantity, variationId: $variationId) {
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
`;

// export const ADD_TO_CART = gql`
//   mutation AddToCart($productId: String!, $variationId: String, $quantity: Float!) {
//     addToCart(productId: $productId, variationId: $variationId, quantity: $quantity) {
//       id
//       quantity
//       product {
//         id
//         name
//         slug
//         price
//       }
//       variation {
//         id
//         size
//         color
//         price
//       }
//     }
//   }
// `;

// export const ADD_TO_CART = gql`
//   mutation AddToCart($productId: ID!, $variationId: ID, $quantity: Float!) {
//     addToCart(productId: $productId, variationId: $variationId, quantity: $quantity) {
//       id
//       product {
//         id
//         name
//       }
//       variation {
//         id
//         size
//         color
//         price
//       }
//       quantity
//     }
//   }
// `;
export const UPDATE_ADDRESS = gql`
 mutation($input: UpdateUserAddressInput!, $updateUserAddressId: String!) {
  updateUserAddress(input: $input, id: $updateUserAddressId) {
    country
    state
    city
    streetAddress
    streetAddress2
    zipcode
    user {
      id
      username
    }
  }
}
`;

export const CREATE_REVIEW = gql `
 mutation($input: ReviewInput!) {
    createReview(input: $input) {
      id
      comment
      rating
      createdAt
      sentiment
      user {
        id
        username
      }
      product {
        id
        name
        averageRating
        reviewCount
      }
    }
  }
`;
