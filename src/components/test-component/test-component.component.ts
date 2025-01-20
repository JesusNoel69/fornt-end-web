import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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
  url: string = "http://localhost:5038/Test/";
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
