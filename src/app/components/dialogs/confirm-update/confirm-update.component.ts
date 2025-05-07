import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-confirm-update',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './confirm-update.component.html',
  styleUrl: './confirm-update.component.css'
})
export class ConfirmUpdateComponent {
  private dialogRef = inject(MatDialogRef<ConfirmUpdateComponent>);

  /** Cierra el diálogo indicando confirmación */
  confirm(): void {
    this.dialogRef.close(true);
  }

  /** Cierra el diálogo sin confirmar */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
