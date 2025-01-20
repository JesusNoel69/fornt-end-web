import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-general-configuration',
  standalone: true,
  imports:[MatDialogModule, MatCardModule, MatButtonModule],
  templateUrl: './general-configuration.component.html',
  styleUrl: './general-configuration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigurationComponent {

}
