import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../../enviroments/enviroment.prod';
import { Observable } from 'rxjs';
import { AnalysisResult } from '../dtos/analysisresult.dto';
import { ScanResult } from '../components/dialogs/issues/issues.component';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  private url = `${ENVIRONMENT}Integrations/AnalizeProject`;
  constructor(private http: HttpClient) { }
  upload(formData: FormData): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(this.url, formData);
  }

  analizeProject(formData: FormData): Observable<ScanResult> {
    return this.http.post<ScanResult>(this.url, formData);
  }
}
