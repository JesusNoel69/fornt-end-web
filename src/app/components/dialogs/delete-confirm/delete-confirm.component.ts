import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.css'
})
export class DeleteConfirmComponent {
  private dialogRef = inject(MatDialogRef<DeleteConfirmComponent>);

  /** Cierra el diálogo indicando confirmación */
  confirm(): void {
    this.dialogRef.close(true);
  }

  /** Cierra el diálogo sin confirmar */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
