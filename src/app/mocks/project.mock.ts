import { Project } from "../entities/project.entity";


let project1: Project = {
    Id: 1,
    StartDate: new Date('2025-01-01'),
    State: 1,
    Repository: "https://github.com/example/app-web",
    ServerImage: "https://example.com/server-image1.png",
    ProjectNumber: 101,
    Sprints: [
        {
            Id: 1,
            StartDate: new Date('2025-01-02'),
            State: 1,
            Repository: "https://github.com/example/app-web/sprint1",
            Goal: "Crear la estructura base de la aplicación",
            ProjectNumber: 101,
            ChangeDetails: [],
            Tasks: [
                {
                    Id: 1,
                    Name: "Configurar Angular",
                    WeeklyScrum: "Inicio de configuración base",
                    Description: "Configuración inicial del framework Angular",
                    State: 1,
                    ChangeDetails: [],
                    Sprint: null as any,
                    ProductBacklog: null as any,
                }
            ],
            Project: null as any,
        }
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
                    }
                ],
                TeamProject: null as any,
            }
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
                Name: "Diseñar prototipo de UI",
                WeeklyScrum: "Diseño preliminar aprobado",
                Description: "Prototipo de la interfaz principal",
                State: 1,
                ChangeDetails: [],
                Sprint: null as any,
                ProductBacklog: null as any,
            }
        ]
    }
};
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
            ProjectNumber: 202,
            ChangeDetails: [],
            Tasks: [
                {
                    Id: 3,
                    Name: "Configurar base de datos",
                    WeeklyScrum: "Finalizada integración inicial",
                    Description: "Creación de tablas para usuarios y roles",
                    State: 2,
                    ChangeDetails: [],
                    Sprint: null as any,
                    ProductBacklog: null as any,
                },
                {
                    Id: 4,
                    Name: "Configurar base de datos 2",
                    WeeklyScrum: "Finaliza",
                    Description: "Creación de tablas",
                    State: 4,
                    ChangeDetails: [],
                    Sprint: null as any,
                    ProductBacklog: null as any,
                }
            ],
            Project: null as any,
        },
        {
            Id: 5,
            StartDate: new Date('2025-02-05'),
            State: 1,
            Repository: "https://github.com/example/ecommerce-platform/sprint1",
            Goal: "Implementar sistema de autenticación",
            ProjectNumber: 202,
            ChangeDetails: [],
            Tasks: [
                {
                    Id: 6,
                    Name: "Configurar base de datos",
                    WeeklyScrum: "Finalizada integración inicial",
                    Description: "Creación de tablas para usuarios y roles",
                    State: 1,
                    ChangeDetails: [],
                    Sprint: null as any,
                    ProductBacklog: null as any,
                },
                {
                    Id: 7,
                    Name: "Configurar base de datos 2",
                    WeeklyScrum: "Finaliza",
                    Description: "Creación de tablas",
                    State: 4,
                    ChangeDetails: [],
                    Sprint: null as any,
                    ProductBacklog: null as any,
                }
            ],
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
                    Id: 102,
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
                        Id: 202,
                        Rol: false,
                        Name: "Carlos Rivera",
                        Account: "carlos.rivera",
                        Password: "securepassword101",
                        NameSpecialization: "Backend Development",
                        Team: null as any,
                        ProductOwner: null as any,
                        Developer: null as any,
                        ChangeDetails: null as any,
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
        Tasks: [
            {
                Id: 4,
                Name: "Diseñar página de login",
                WeeklyScrum: "Pendiente de aprobación",
                Description: "Interfaz inicial para el sistema de login",
                State: 1,
                ChangeDetails: [],
                Sprint: null as any,
                ProductBacklog: null as any,
            }
        ]
    }
};
export let projects: Project[]=[project1, project2];

// const project1: Project = {
//     Id: 1,
//     StartDate: new Date('2025-01-01'),
//     State: 1, // Activo
//     Repository: "https://github.com/example/app-web",
//     ServerImage: "https://example.com/server-image1.png",
//     ProjectNumber: 101,
//     Sprints: [sprint1], // Vinculando el sprint al proyecto
//     TeamProject: null as any,
//     ProductBacklog: null as any,
// };

// sprint1.Project = project1;