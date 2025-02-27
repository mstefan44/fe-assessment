import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryViewComponent } from './pages/category-view/category-view.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:slug', component: CategoryViewComponent },
  { path: 'product/:slug', component: ProductViewComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
