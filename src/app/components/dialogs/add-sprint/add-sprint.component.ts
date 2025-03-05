// import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatCardModule } from '@angular/material/card';
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
//   CdkDrag,
//   CdkDropList,
// } from '@angular/cdk/drag-drop';

// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {provideNativeDateAdapter} from '@angular/material/core';

// import { MatTableModule } from '@angular/material/table';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDivider } from '@angular/material/divider';
// import { MatButtonModule } from '@angular/material/button';
// import {MatDialogModule} from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { Project } from '../../../entities/project.entity';
// import { ProjectService } from '../../../services/project.service';
// import { Task } from '../../../entities/Task.entity';
// import { Sprint } from '../../../entities/sprint.entity';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-add-sprint',
//   standalone: true,
//   imports: [MatGridListModule, MatCardModule, CdkDrag, CdkDropList, MatTableModule, MatButtonModule, MatIconModule, MatDivider,
//      MatDialogModule, CommonModule, FormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule
//    ],
//   providers: [provideNativeDateAdapter()],
//   templateUrl: './add-sprint.component.html',
//   styleUrl: './add-sprint.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class AddSprintComponent implements OnInit{
//   selectedProject: Project | null = null;
//   private projectService = inject(ProjectService);
//   ngOnInit(): void {
//     this.projectService.getSelectedProject().subscribe((project)=>{
//       this.selectedProject = project,
//       this.todo = project?.ProductBacklog?.Tasks ?? [],
//       this.done = [];
//     });
//   }
//   todo:Task[] = [];
//   done: Task[] = [];
//   goal:string="";
//   description:string="";
//   name: string="";

//   date: Date|null = null;
//   needPlus3: number=5;
//   sprintToAdd: Sprint | null = null;
//   changePlus3(value:number){
//     this.needPlus3=value+3;
//   }
//   deleteFields():void{
//     this.todo = [];
//     this.done = [];
//     this.goal="";
//     this.name="";
//     this.date= null;
//     this.needPlus3=5;
//     this.sprintToAdd = null;
//   }
//   addSprint():void{
//     if (this.selectedProject?.ProductBacklog?.Tasks) {
//       this.selectedProject.ProductBacklog.Tasks = this.todo;
//       let sprintToAdd: Sprint = {
//         Project: this.selectedProject,
//         Tasks: this.done,
//         Goal: this.goal,
//         Id: 0, //autoincremental en db
//         StartDate: new Date(Date.now()),
//         EndDate: this.date??new Date,
//         Description: this.description,
//         State: 0,//por hacer
//         Repository: this.selectedProject?.Repository,
//         ProjectNumber: this.selectedProject?.ProjectNumber, //deberia ser autoincremental en la db, revisar
//         ChangeDetails: []
//       }
//       console.log(sprintToAdd);
//       this.selectedProject.Sprints.push(sprintToAdd)
//       console.log(this.selectedProject.Sprints)
//       console.log(this.selectedProject.ProductBacklog)
//     }
//   }

//   getCircleClass(state: number): string {
//     switch (state) {
//       case 1:
//         return 'circle state-1';
//       case 2:
//         return 'circle state-2';
//       case 3:
//         return 'circle state-3';
//       case 4:
//         return 'circle state-4';
//       default:
//         return '';
//     }
//   }

//   drop(event: CdkDragDrop<Task[]>) {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(
//         event.previousContainer.data, 
//         event.container.data, 
//         event.previousIndex, 
//         event.currentIndex
//       );
//     }
    
//   }
  
// }
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Project } from '../../../entities/project.entity';
import { ProjectService } from '../../../services/project.service';
import { Task } from '../../../entities/Task.entity';
import { Sprint } from '../../../entities/sprint.entity';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-sprint',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CdkDrag, CdkDropList, MatTableModule, MatButtonModule, MatIconModule, MatDivider,
    MatDialogModule, CommonModule, FormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-sprint.component.html',
  styleUrls: ['./add-sprint.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSprintComponent implements OnInit, OnDestroy {
  selectedProject: Project | null = null;
  todo: Task[] = [];
  done: Task[] = [];
  goal: string = "";
  description: string = "";
  name: string = "";
  date: Date | null = null;
  needPlus3: number = 5;
  // sprintToAdd se genera en addSprint()

  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Nos suscribimos al proyecto seleccionado
    this.projectService.getSelectedProject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        this.selectedProject = project;
        if (project) {
          // Llamar al endpoint para obtener el ProductBacklog actualizado
          this.projectService.getProductBacklogById(project.Id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (backlog) => {
                // Asigna las tareas obtenidas del endpoint a "todo"
                console.log(backlog);
                this.todo = backlog.Tasks || [];
                // Inicialmente, "done" es vacío
                this.done = [];
                this.cdr.markForCheck();
              },
              error: (err) => {
                console.error("Error al obtener el ProductBacklog:", err);
              }
            });
        }
      });
  }
  

  changePlus3(value: number): void {
    this.needPlus3 = value + 3;
  }

  deleteFields(): void {
    this.todo = [];
    this.done = [];
    this.goal = "";
    this.name = "";
    this.date = null;
    this.needPlus3 = 5;
  }

  addSprint(): void {
    if (!this.selectedProject) {
      console.warn('No hay un proyecto seleccionado.');
      return;
    }
    // Crear el objeto Sprint a insertar
    const sprintToAdd: Sprint = {
      Project: this.selectedProject,
      Tasks: this.done, // Las tareas asignadas al sprint
      Goal: this.goal,
      Id: 0, // Se asignará en la base de datos
      StartDate: new Date(Date.now()),
      EndDate: this.date ?? new Date(),
      Description: this.description,
      State: 0, // Por hacer
      Repository: this.selectedProject.Repository,
      ProjectNumber: this.selectedProject.ProjectNumber,
      ChangeDetails: []
    };
    
    console.log("Sprint a agregar:", sprintToAdd);
    const url = 'http://localhost:5038/Sprint/AddSprint';

    // Realizamos la llamada POST para insertar el sprint
    // Usamos switchMap para asegurarnos de que haya un proyecto seleccionado (aunque aquí ya lo comprobamos)
    this.projectService.getSelectedProject()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(project => {
          if (project) {
            return this.http.post(url, sprintToAdd);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (response) => {
          console.log("Sprint agregado:", response);
          // Actualizar localmente: agregar el sprint al array de sprints del proyecto
          if (this.selectedProject) {
            this.selectedProject.Sprints.push(sprintToAdd);
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error agregando el sprint:", error);
        }
      });
  }
  getCircleClass(state: number): string {
    switch (state) {
      case 1:
        return 'circle state-1';
      case 2:
        return 'circle state-2';
      case 3:
        return 'circle state-3';
      case 4:
        return 'circle state-4';
      default:
        return '';
    }
  }
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
    }
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
