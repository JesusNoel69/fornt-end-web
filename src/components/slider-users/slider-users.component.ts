import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-slider-users',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './slider-users.component.html',
  styleUrl: './slider-users.component.css'
})
export class SliderUsersComponent {
  users = [
    { label: 'AJ', color: '#8BC34A' },
    { label: 'BJ', color: '#81C784' },
    { label: 'CJ', color: '#FFEB3B' },
    { label: 'DJ', color: '#9575CD' },
    { label: 'EJ', color: '#F06292' },
    { label: 'FJ', color: '#4DB6AC' },
    { label: 'GJ', color: '#FF7043' },
  ];

  visibleItems = this.users.slice(0, 5); //mostrar los primeros 5
  startIndex = 0;
  nextSlide() {
    if (this.startIndex + 5 < this.users.length) {
      this.startIndex++;
      this.updateVisibleItems();
    }
  }
  prevSlide() {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateVisibleItems();
    }
  }

  updateVisibleItems() {
    this.visibleItems = this.users.slice(this.startIndex, this.startIndex + 5);
  }
  getScale(index: number): string {
    if (index === 2) { 
        return 'scale(1.3)'; // El tercer elemento
    } else if (index === 1 || index === 3) {
        return 'scale(1.1)'; // Segundo y cuarto elemento
    } else {
        return 'scale(1)'; // Los demás elementos
    }
  }
  getZIndex(index: number): number {
    if (index === 0 || index === 4) {
        return 1;
    } else if (index === 1 || index === 3) {
        return 2;
    } else if (index === 2) {
        return 3;
    }
    return 0;
  }

}
