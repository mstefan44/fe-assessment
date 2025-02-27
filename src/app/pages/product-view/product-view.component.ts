import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Product } from '../../types/types';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { RelatedProductsComponent } from '../../components/related-products/related-products.component';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, CountdownComponent, RelatedProductsComponent],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
})
export class ProductViewComponent implements OnInit {
  product: Product | null = null;
  currentSlug: string | null = null;
  categorySlug: string | null = null;
  errorSingleProduct: string | null = null;
  loadingSingleProduct: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.categorySlug = this.route.snapshot.queryParamMap.get('category');
      this.currentSlug = slug;
      if (slug) {
        this.loadProduct(slug);
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
    this.loadingSingleProduct = true;
    this.errorSingleProduct = null;
    this.product = null;
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
        this.router.navigate(['/404']);
      },
      complete: () => {
        this.loadingSingleProduct = false;
      },
    });
  }

  goBack(): void {
    if (this.categorySlug) {
      this.router.navigate(['/category', this.categorySlug]);
    } else {
      this.router.navigate(['/']); // Fallback to home if no categorySlug
    }
  }
}
