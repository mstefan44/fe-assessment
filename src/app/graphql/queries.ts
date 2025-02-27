import { gql } from 'apollo-angular';

export const GET_CATEGORIES = gql`
  query {
    getCategoryList {
      items {
        _id
        slug
        title
        Image {
          path
        }
        products {
          _id
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query ($slug: String!) {
    getProductList(where: { category: { slug: { eq: $slug } } }) {
      items {
        _id
        category {
          slug
          title
        }
        image {
          path
        }
        name
        price
        slug
      }
    }
  }
`;

export const GET_RELATED_PRODUCTS = gql`
  query ($categorySlug: String!, $currentSlug: String!) {
    getProductList(
      where: {
        category: { slug: { eq: $categorySlug } }
        NOT: { slug: { eq: $currentSlug } }
      }
    ) {
      items {
        _id
        name
        price
        slug
        image {
          path
        }
      }
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
  query ($slug: String!) {
    getProductList(where: { slug: { eq: $slug } }) {
      items {
        _id
        description
        image {
          path
        }
        name
        price
        slug
      }
    }
  }
`;
