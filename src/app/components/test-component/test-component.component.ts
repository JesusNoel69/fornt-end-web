import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ENVIROMENT } from '../../../enviroments/enviroment.prod';

// Definimos la interfaz para el tipo de respuesta esperado
interface TestResponse {
  message: string;
}

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [],
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponent {
  url: string = ENVIROMENT+"Test/";
  valueBackendTest: string = "";

  constructor(private client: HttpClient) {}

  public testCall(): void {
    this.client.get<TestResponse>(this.url).subscribe({
      next: (response) => {
        this.valueBackendTest = response.message;
        console.log(this.valueBackendTest); 
      },
      error: (error) => {
        this.valueBackendTest = "error";
        console.log(this.valueBackendTest);
      }
    });
  }
}
