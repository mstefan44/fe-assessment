import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { Product } from '../../types/types';
import { CommonModule } from '@angular/common';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingSkeletonComponent],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
})
export class CategoryViewComponent implements OnInit {
  products: Product[] | null = null;
  error: string | null = null;
  currentSlug: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentSlug = this.route.snapshot.paramMap.get('slug');
    if (this.currentSlug) {
      this.dataService.getProducts(this.currentSlug).subscribe({
        next: (result) => {
          if (result.data.getProductList.items.length === 0) {
            this.router.navigate(['/404']);
          } else {
            this.products = result.data.getProductList.items;
          }
        },
        error: (error) => {
          console.error('error', error);
          this.error = 'An error occurred while fetching data';
          this.loading = false;
          this.router.navigate(['/404']);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
    // Scroll to top after route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }, 10);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']); // Always go back to home
  }
}
