import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Product } from '../../types/types';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { RelatedProductsComponent } from '../../components/related-products/related-products.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    CommonModule,
    CountdownComponent,
    RelatedProductsComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
})
export class ProductViewComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] | null = null;
  currentSlug: string | null = null;
  categorySlug: string | null = null;
  errorSingleProduct: string | null = null;
  loadingSingleProduct: boolean = true;
  errorRelatedProducts: string | null = null;
  loadingRelatedProducts: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.categorySlug = this.route.snapshot.queryParamMap.get('category');

      if (slug) {
        this.loadProduct(slug);
      }
      if (this.categorySlug && slug) {
        this.loadRelatedProducts(this.categorySlug, slug);
      }
    });
    // Scroll to top after route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  }
  private loadProduct(slug: string): void {
    this.dataService.getSingleProducts(slug).subscribe({
      next: (result) => {
        if (result.data.getProductList.items.length === 0) {
          this.router.navigate(['/404']);
        } else {
          this.product = result.data.getProductList.items[0];
        }
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.errorSingleProduct =
          'An error occurred while fetching product data';
        this.loadingSingleProduct = false;
      },
      complete: () => {
        this.loadingSingleProduct = false;
      },
    });
  }

  private loadRelatedProducts(categorySlug: string, currentSlug: string): void {
    this.dataService.getProducts(categorySlug).subscribe({
      next: (result) => {
        const filteredProducts = result.data.getProductList.items.filter(
          (p) => p.slug !== currentSlug
        );
        this.relatedProducts = this.getRandomProducts(filteredProducts, 3);
        this.loadingRelatedProducts = false;
      },
      error: (error) => {
        console.error('Error fetching related products:', error);
        this.errorRelatedProducts =
          'An error occurred while fetching related products';
        this.loadingRelatedProducts = false;
      },
      complete: () => {
        this.loadingRelatedProducts = false;
      },
    });
  }

  // Randomly selects 3 indices from the given products array
  private getRandomProducts(products: Product[], count: number): Product[] {
    if (!products || products.length === 0) return [];
    if (products.length <= count) return [...products]; // Return all if fewer than count

    const indices = new Set<number>(); // To avoid duplicates

    while (indices.size < Math.min(count, products.length)) {
      const randomIndex = Math.floor(Math.random() * products.length);
      indices.add(randomIndex);
    }

    return Array.from(indices).map((index) => products[index]);
  }

  goBack(): void {
    if (this.categorySlug) {
      this.router.navigate(['/category', this.categorySlug]);
    } else {
      this.router.navigate(['/']); // Fallback to home if no categorySlug
    }
  }
}
