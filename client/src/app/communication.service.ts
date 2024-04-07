import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { Bird } from "../../../common/tables/Bird";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private _listners: any = new Subject<any>();

  public listen(): Observable<any> {
    return this._listners.asObservable();
  }

  public filter(filterBy: string): void {
    this._listners.next(filterBy);
  }

  public getBirds(): Observable<Bird[]> {
    return this.http
      .get<Bird[]>(this.BASE_URL + "/birds")
      .pipe(catchError(this.handleError<Bird[]>("getBirds")));
  }

  public insertBird(bird: Bird): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/birds/insert", bird)
      .pipe(catchError(this.handleError<number>("insertBird")));
  }

  public updateBird(bird: Bird): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/birds/update", bird)
      .pipe(catchError(this.handleError<number>("updateBird")));
  }

  public deleteBird(birdScientificName: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/birds/delete/" + birdScientificName, {})
      .pipe(catchError(this.handleError<number>("deleteBird")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
