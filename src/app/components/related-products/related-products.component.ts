import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../types/types';
import { DataService } from '../../services/data.service';
import { LoadingSkeletonComponent } from '../loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSkeletonComponent],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
})
export class RelatedProductsComponent implements OnInit {
  @Input({ required: true }) categorySlug!: string;
  @Input({ required: true }) currentSlug!: string;
  relatedProducts: Product[] | null = null;
  errorRelatedProducts: string | null = null;
  loadingRelatedProducts: boolean = true;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadRelatedProducts();
  }
  private loadRelatedProducts(): void {
    this.dataService
      .getRelatedProducts(this.categorySlug, this.currentSlug)
      .subscribe({
        next: (result) => {
          const otherProducts = result.data.getProductList.items;
          this.relatedProducts = this.getRandomProducts(otherProducts, 3);
          this.loadingRelatedProducts = false;
        },
        error: (error) => {
          console.error('Error fetching related products:', error);
          this.errorRelatedProducts =
            'An error occurred while fetching related products';
          this.loadingRelatedProducts = false;
          this.router.navigate(['/404']);
        },
        complete: () => {
          this.loadingRelatedProducts = false;
        },
      });
  }
  private getRandomProducts(products: Product[], count: number): Product[] {
    if (!products || products.length === 0) return [];
    if (products.length <= count) return [...products];

    const indices = new Set<number>();
    while (indices.size < Math.min(count, products.length)) {
      const randomIndex = Math.floor(Math.random() * products.length);
      indices.add(randomIndex);
    }

    return Array.from(indices).map((index) => products[index]);
  }
}
