import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../types/types';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
})
export class RelatedProductsComponent {
  @Input() relatedProducts: Product[] | null = null;
  @Input() categorySlug: string | null = null;
}
