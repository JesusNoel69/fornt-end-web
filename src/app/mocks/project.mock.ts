import { Project } from "../entities/project.entity";
import { Task } from "../entities/Task.entity";

let tasks1:Task[] =[
    {
        Id: 2,
        Name: "Configurar servicios en Angular",
        WeeklyScrum: "Servicios configurados parcialmente",
        Description: "Configuración de servicios y conexión con la API.",
        State: 2,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
      },
      {
        Id: 3,
        Name: "Implementar integración inicial",
        WeeklyScrum: "API conectada correctamente",
        Description: "Conexión de las llamadas iniciales a la API desde Angular.",
        State: 2,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
      },
];
let tasks3:Task[] =[
  {
      Id: 12,
      Name: "Configurar servicios en Angular",
      WeeklyScrum: "Servicios configurados parcialmente",
      Description: "Configuración de servicios y conexión con la API.",
      State: 2,
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: null as any,
      Responsible: null as any
    },
    {
      Id: 13,
      Name: "Implementar integración inicial",
      WeeklyScrum: "API conectada correctamente",
      Description: "Conexión de las llamadas iniciales a la API desde Angular.",
      State: 2,
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: null as any,
      Responsible: null as any
    },
];
let tasks4:Task[] =[
  {
      Id: 1001,
      Name: "Configurar servicios en Angular",
      WeeklyScrum: "Servicios configurados parcialmente",
      Description: "Configuración de servicios y conexión con la API.",
      State: 2,
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: null as any,
      Responsible: null as any
    },
    {
      Id: 1002,
      Name: "Implementar integración inicial",
      WeeklyScrum: "API conectada correctamente",
      Description: "Conexión de las llamadas iniciales a la API desde Angular.",
      State: 2,
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: null as any,
      Responsible: null as any

    },
];
let tasks5:Task[] =[
  {
    Id: 1003,
    Name: "Configurar servicios en Angular task 5",
    WeeklyScrum: "Servicios configurados parcialmente",
    Description: "Configuración de servicios y conexión con la API.",
    State: 2,
    ChangeDetails: [],
    Sprint: null as any,
    ProductBacklog: null as any,
    Responsible: null as any

  },
    {
      Id: 1004,
      Name: "Implementar integración inicial tasks 5",
      WeeklyScrum: "API conectada correctamente",
      Description: "Conexión de las llamadas iniciales a la API desde Angular.",
      State: 2,
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: null as any,
      Responsible: null as any

    },
];
let project1: Project = {
    Id: 1,
    StartDate: new Date('2025-01-01'),
    State: 1,
    Repository: "https://github.com/example/app-web",
    ServerImage: "https://example.com/server-image1.png",
    ProjectNumber: 101,
    Sprints: [
      // {
      //   Id: 1,
      //   StartDate: new Date('2025-01-02'),
      //   EndDate: new Date('2025-01-10'),
      //   Description:
      //     "Lorem ipsumConsequat elit eiusmod aliqua ex proident commodo laboris amet. Aute incididunt minim irure ea proident non eiusmod fugiat adipisicing irure culpa eiusmod sit. In sunt reprehenderit incididunt quis nisi amet in elit veniam est nulla esse esse.",
      //   State: 1,
      //   Repository: "https://github.com/example/app-web/sprint1",
      //   Goal: "Crear la estructura base de la aplicación",
      //   ProjectNumber: 101,
      //   ChangeDetails: [],
      //   Tasks: tasks1,
      //   Project: null as any,
      // },
      {
        Id: 2,
        StartDate: new Date('2025-01-11'),
        EndDate: new Date('2025-01-20'),
        Description:
          "Sprint enfocado en el desarrollo de la capa de servicios y la integración inicial de la API.",
        State: 2,
        Repository: "https://github.com/example/app-web/sprint2",
        Goal: "Desarrollar la capa de servicios y conexión con la API",
        ProjectNumber: 101,
        ChangeDetails: [],
        Tasks: tasks3,
        Project: null as any,
      },
      {
        Id: 50,
        StartDate: new Date('2025-01-11'),
        EndDate: new Date('2025-01-20'),
        Description:
          "Sprint enfocado en el desarrollo de la capa de servicios y la integración inicial de la API 2.",
        State: 2,
        Repository: "https://github.com/example/app-web/sprint2",
        Goal: "Desarrollar la capa de servicios y conexión con la API 2",
        ProjectNumber: 101,
        ChangeDetails: [],
        Tasks: tasks5,
        Project: null as any,
      },
      {
        Id: 3,
        StartDate: new Date('2025-01-21'),
        EndDate: new Date('2025-01-30'),
        Description:
          "Sprint dedicado a las pruebas de la funcionalidad principal y la resolución de errores.",
        State: 3,
        Repository: "https://github.com/example/app-web/sprint3",
        Goal: "Realizar pruebas y corregir errores en la funcionalidad base",
        ProjectNumber: 101,
        ChangeDetails: [],
        Tasks: [
          {
            Id: 4,
            Name: "Pruebas unitarias",
            WeeklyScrum: "Pruebas unitarias completadas al 80%",
            Description: "Creación y ejecución de pruebas unitarias para los servicios.",
            State: 3,
            ChangeDetails: [],
            Sprint: null as any,
            ProductBacklog: null as any,
            Responsible: null as any
          },
          {
            Id: 5,
            Name: "Corrección de errores",
            WeeklyScrum: "Errores principales corregidos",
            Description: "Resolución de errores encontrados en las pruebas iniciales.",
            State: 3,
            ChangeDetails: [],
            Sprint: null as any,
            ProductBacklog: null as any,
            Responsible: null as any
          },
          {
            Id: 6,
            Name: "Pruebas unitarias 2",
            WeeklyScrum: "Pruebas unitarias completadas al 80%",
            Description: "Creación y ejecución de pruebas unitarias para los servicios.",
            State: 4,
            ChangeDetails: [],
            Sprint: null as any,
            ProductBacklog: null as any,
            Responsible: null as any
          },
          {
            Id: 7,
            Name: "Corrección de errores 2",
            WeeklyScrum: "Errores principales corregidos",
            Description: "Resolución de errores encontrados en las pruebas iniciales.",
            State: 3,
            ChangeDetails: [],
            Sprint: null as any,
            ProductBacklog: null as any,
            Responsible: null as any
          },
          
        ],
        Project: null as any,
      },
    ],
    TeamProject: {
      TeamId: 1,
      ProjectId: 1,
      Teams: [
        {
          Id: 1,
          Name: "Equipo Águila",
          Code: "EAG001",
          ProductOwner: {
            Id: 101,
            Rol: true,
            Name: "Jane Doe",
            Account: "jane.doe",
            Password: "securepassword123",
            StakeHolderContact: "jane@example.com",
            Team: null as any,
            ProductOwner: null as any,
            Developer: null as any,
            ChangeDetails: null as any,
          },
          Developers: [
            {
              Id: 201,
              Rol: false,
              Name: "John Smith",
              Account: "john.smith",
              Password: "securepassword456",
              NameSpecialization: "Frontend Development",
              Team: null as any,
              ProductOwner: null as any,
              Developer: null as any,
              ChangeDetails: null as any,
              WeeklyScrum: null as any
            },
          ],
          TeamProject: null as any,
        },
      ],
      Projects: [],
    },
    ProductBacklog: {
      Id: 1,
      UpdateAt: new Date('2025-01-03'),
      Comment: "Creación inicial del backlog",
      UpdatedBy: "Jane Doe",
      Project: null as any,
      Tasks: [
        {
          Id: 2,
          Name: "Diseñar prototipo de UI2",
          WeeklyScrum: "Diseño preliminar aprobado",
          Description: "Prototipo de la interfaz principal",
          State: 1,
          ChangeDetails: [],
          Sprint: null as any,
          ProductBacklog: null as any,
          Responsible: null as any
        },
      ],
    },
  };
let tasks2:Task[]=[
    {
        Id: 22,
        Name: "Configurar base de datos",
        WeeklyScrum: "Finalizada integración inicial",
        Description: "Creación de tablas para usuarios y roles",
        State: 2,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
    },
    {
        Id: 24,
        Name: "Configurar base de datos 2",
        WeeklyScrum: "Finaliza",
        Description: "Creación de tablas",
        State: 4,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
      },
    {
        Id: 26,
        Name: "Configurar base de datos",
        WeeklyScrum: "Finalizada integración inicial",
        Description: "Creación de tablas para usuarios y roles",
        State: 1,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
    },
    {
        Id: 27,
        Name: "Configurar base de datos 2",
        WeeklyScrum: "Finaliza",
        Description: "Creación de tablas",
        State: 4,
        ChangeDetails: [],
        Sprint: null as any,
        ProductBacklog: null as any,
        Responsible: null as any
    }
]
let project2: Project = {
    Id: 2,
    StartDate: new Date('2025-02-01'),
    State: 2,
    Repository: "https://github.com/example/ecommerce-platform",
    ServerImage: null,
    ProjectNumber: 202,
    Sprints: [
        {
            Id: 2,
            StartDate: new Date('2025-02-05'),
            State: 3,
            Repository: "https://github.com/example/ecommerce-platform/sprint1",
            Goal: "Implementar sistema de autenticación",
            EndDate: new Date('2025-01-10'),
            Description:"Lorem ipsumConsequat elit eiusmod aliqua ex proident commodo laboris amet. Aute incididunt minim irure ea proident non eiusmod fugiat adipisicing irure culpa eiusmod sit. In sunt reprehenderit incididunt quis nisi amet in elit veniam est nulla esse esse.",
            ProjectNumber: 202,
            ChangeDetails: [],
            Tasks: tasks2,
            Project: null as any,
        },
        {
            Id: 5,
            StartDate: new Date('2025-02-05'),
            State: 1,
            Repository: "https://github.com/example/ecommerce-platform/sprint1",
            Goal: "Implementar sistema de autenticación 2",
            EndDate: new Date('2025-01-10'),
            Description:"Lorem ipsumConsequat elit eiusmod aliqua ex proident commodo laboris amet. Aute incididunt minim irure ea proident non eiusmod fugiat adipisicing irure culpa eiusmod sit. In sunt reprehenderit incididunt quis nisi amet in elit veniam est nulla esse esse.",
            ProjectNumber: 202,
            ChangeDetails: [],
            Tasks: tasks1,
            Project: null as any,
        }
    ],
    TeamProject: {
        TeamId: 2,
        ProjectId: 2,
        Teams: [
            {
                Id: 2,
                Name: "Equipo Fénix",
                Code: "PHX001",
                ProductOwner: {
                    Id: 100,
                    Rol: true,
                    Name: "Alice Brown",
                    Account: "alice.brown",
                    Password: "securepassword789",
                    StakeHolderContact: "alice@example.com",
                    Team: null as any,
                    ProductOwner: null as any,
                    Developer: null as any,
                    ChangeDetails: null as any,
                },
                Developers: [
                    {
                      Id: 305,
                      Rol: false,
                      Name: "Carlos Rivera",
                      Account: "carlos.rivera",
                      Password: "securepassword101",
                      NameSpecialization: "Backend Development",
                      Team: null as any,
                      ProductOwner: null as any,
                      Developer: null as any,
                      ChangeDetails: null as any,
                      WeeklyScrum: null as any
                    },{
                        Id: 305,
                        Rol: false,
                        Name: "Carlos Rivera",
                        Account: "carlos.rivera",
                        Password: "securepassword101",
                        NameSpecialization: "Backend Development",
                        Team: null as any,
                        ProductOwner: null as any,
                        Developer: null as any,
                        ChangeDetails: null as any,
                      WeeklyScrum: null as any

                    },{
                      Id: 304,
                      Rol: false,
                      Name: "Carlos Rivera",
                      Account: "carlos.rivera",
                      Password: "securepassword101",
                      NameSpecialization: "Backend Development",
                      Team: null as any,
                      ProductOwner: null as any,
                      Developer: null as any,
                      ChangeDetails: null as any,
                      WeeklyScrum: null
                    },{
                      Id: 303,
                      Rol: false,
                      Name: "Carlos Rivera",
                      Account: "carlos.rivera",
                      Password: "securepassword101",
                      NameSpecialization: "Backend Development",
                      Team: null as any,
                      ProductOwner: null as any,
                      Developer: null as any,
                      ChangeDetails: null as any,
                      WeeklyScrum: null
                    },{
                      Id: 301,
                      Rol: false,
                      Name: "Carlos Rivera",
                      Account: "carlos.rivera",
                      Password: "securepassword101",
                      NameSpecialization: "Backend Development",
                      Team: null as any,
                      ProductOwner: null as any,
                      Developer: null as any,
                      ChangeDetails: null as any,
                      WeeklyScrum: null
                    },{
                      Id: 300,
                      Rol: false,
                      Name: "Joaquin",
                      Account: "carlos.rivera",
                      Password: "securepassword101",
                      NameSpecialization: "Backend Development",
                      Team: null as any,
                      ProductOwner: null as any,
                      Developer: null as any,
                      ChangeDetails: null as any,
                      WeeklyScrum: null
                    }
                ],
                TeamProject: null as any,
            }
        ],
        Projects: [],
    },
    ProductBacklog: {
        Id: 2,
        UpdateAt: new Date('2025-02-06'),
        Comment: "Primera iteración del backlog",
        UpdatedBy: "Alice Brown",
        Project: null as any,
        Tasks: tasks4
    }
};
project1.Sprints[0].ChangeDetails = [
    {
      Id: 1,
      SprintNumber: 1,
      UserData: "Jane Doe",
      TaskInformation: "Actualizó la descripción de la tarea 'Configurar Angular'",
      Task: project1.Sprints[0].Tasks[0],
      User: project1.TeamProject.Teams[0].ProductOwner,
      Sprint: project1.Sprints[0],
    },
    {
      Id: 2,
      SprintNumber: 1,
      UserData: "John Smith",
      TaskInformation: "Marcó la tarea 'Configurar Angular' como 'En progreso'",
      Task: project1.Sprints[0].Tasks[0],
      User: project1.TeamProject.Teams[0].Developers[0],
      Sprint: project1.Sprints[0],
    },
  ];
  project1.Sprints[1].ChangeDetails = [
    {
      Id: 3,
      SprintNumber: 2,
      UserData: "John Smith",
      TaskInformation: "Agregó una nueva tarea 'Implementar integración inicial'",
      Task: project1.Sprints[1].Tasks[1],
      User: project1.TeamProject.Teams[0].Developers[0],
      Sprint: project1.Sprints[1],
    },
    {
      Id: 4,
      SprintNumber: 2,
      UserData: "Jane Doe",
      TaskInformation: "Revisó la implementación de los servicios en Angular",
      Task: project1.Sprints[1].Tasks[0],
      User: project1.TeamProject.Teams[0].ProductOwner,
      Sprint: project1.Sprints[1],
    },
    
  ];
  
//////
project1.Sprints[0].Tasks[0].weeklyScrums = [
  {
      Id: 1,
      CreatedAt: new Date('2025-01-03'),
      Task: project1.Sprints[0].Tasks[0], // "Configurar servicios en Angular"
      Information: "El equipo discutió la integración de los servicios en Angular y los problemas de autenticación con la API.",
      Developer: project1.TeamProject.Teams[0].Developers[0] // "John Smith"
  },
  {
      Id: 2,
      CreatedAt: new Date('2025-01-04'),
      Task: project1.Sprints[0].Tasks[0],
      Information: "Se encontró un problema con los servicios de autenticación, se realizará un hotfix.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  }
];

project1.Sprints[0].Tasks[1].weeklyScrums = [
  {
      Id: 3,
      CreatedAt: new Date('2025-01-06'),
      Task: project1.Sprints[0].Tasks[1], // "Implementar integración inicial"
      Information: "Se resolvieron errores en la autenticación y se probó la integración con la API.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 4,
      CreatedAt: new Date('2025-01-07'),
      Task: project1.Sprints[0].Tasks[1],
      Information: "Se finalizó la conexión de los servicios de Angular con la API REST.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  }
];

project1.Sprints[1].Tasks[0].weeklyScrums = [
  {
      Id: 5,
      CreatedAt: new Date('2025-01-10'),
      Task: project1.Sprints[1].Tasks[0], // "Pruebas unitarias"
      Information: "Se ejecutaron pruebas unitarias en los servicios y se corrigieron errores menores.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 6,
      CreatedAt: new Date('2025-01-11'),
      Task: project1.Sprints[1].Tasks[0],
      Information: "Se detectaron errores en la validación de formularios, en revisión.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  }
];

project1.Sprints[1].Tasks[1].weeklyScrums = [
  {
      Id: 7,
      CreatedAt: new Date('2025-01-12'),
      Task: project1.Sprints[1].Tasks[1], // "Corrección de errores"
      Information: "Se identificaron y solucionaron problemas de rendimiento en la API.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 8,
      CreatedAt: new Date('2025-01-13'),
      Task: project1.Sprints[1].Tasks[1],
      Information: "Se mejoró la respuesta del servidor reduciendo tiempos de carga.",
      Developer: project1.TeamProject.Teams[0].Developers[0]
  }
];
/////

// Agregamos los Daily Scrums directamente dentro del objeto `project2`
project2.Sprints[0].Tasks[0].weeklyScrums = [
  {
      Id: 9,
      CreatedAt: new Date('2025-02-06'),
      Task: project2.Sprints[0].Tasks[0], // "Configurar base de datos"
      Information: "Se revisó la estructura de la base de datos y se hicieron ajustes en los modelos.",
      Developer: project2.TeamProject.Teams[0].Developers[0] // "Carlos Rivera"
  },
  {
      Id: 10,
      CreatedAt: new Date('2025-02-07'),
      Task: project2.Sprints[0].Tasks[0],
      Information: "Se creó la conexión entre la API y la base de datos, realizando pruebas de inserción.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  }
];

project2.Sprints[0].Tasks[1].weeklyScrums = [
  {
      Id: 11,
      CreatedAt: new Date('2025-02-08'),
      Task: project2.Sprints[0].Tasks[1], // "Configurar base de datos 2"
      Information: "Se implementaron restricciones en las tablas y validaciones.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 12,
      CreatedAt: new Date('2025-02-09'),
      Task: project2.Sprints[0].Tasks[1],
      Information: "Se optimizaron índices en la base de datos para mejorar rendimiento.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  }
];

project2.Sprints[1].Tasks[0].weeklyScrums = [
  {
      Id: 13,
      CreatedAt: new Date('2025-02-10'),
      Task: project2.Sprints[1].Tasks[0], // "Implementar sistema de autenticación"
      Information: "Se inició la implementación del sistema de autenticación con JWT.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 14,
      CreatedAt: new Date('2025-02-11'),
      Task: project2.Sprints[1].Tasks[0],
      Information: "Se realizaron pruebas en la autenticación y se detectaron errores menores.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  }
];

project2.Sprints[1].Tasks[1].weeklyScrums = [
  {
      Id: 15,
      CreatedAt: new Date('2025-02-12'),
      Task: project2.Sprints[1].Tasks[1], // "Implementar sistema de autenticación 2"
      Information: "Se añadieron validaciones de seguridad y cifrado de contraseñas.",
      Developer: project2.TeamProject.Teams[0].Developers[0]
  },
  {
      Id: 16,
      CreatedAt: new Date('2025-02-13'),
      Task: project2.Sprints[1].Tasks[1],
      Information: "Se finalizó la implementación de roles y permisos en la autenticación.",
      Developer: project2.TeamProject.Teams[0].Developers[1]
  }
];

export let projects: Project[]=[project1, project2];
