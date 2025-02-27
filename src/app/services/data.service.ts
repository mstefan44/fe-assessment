import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Category } from '../types/types';
import {
  GET_CATEGORIES,
  GET_PRODUCTS,
  GET_SINGLE_PRODUCT,
} from '../graphql/queries';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private apollo: Apollo) {}

  getCategories() {
    return this.apollo.query<{
      getCategoryList: { items: Category[] };
    }>({
      query: GET_CATEGORIES,
    });
  }

  getProducts(slug: string) {
    return this.apollo.query<{
      getProductList: { items: any[] };
    }>({
      query: GET_PRODUCTS,
      variables: { slug },
    });
  }

  getSingleProducts(slug: string) {
    return this.apollo.query<{
      getProductList: { items: any[] };
    }>({
      query: GET_SINGLE_PRODUCT,
      variables: { slug },
    });
  }
}
