import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../types/types';
import { CommonModule } from '@angular/common';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingSkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categories: Category[] | null = null;
  error: string | null = null;
  loading: boolean = true;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.dataService.getCategories().subscribe({
      next: (result) => {
        this.categories = result.data.getCategoryList.items;
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
}
