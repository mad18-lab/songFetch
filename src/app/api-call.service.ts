import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError, tap, of } from 'rxjs';
import { throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  private api_key = '969bac002fmsh3edbe92b96998d1p18a210jsn6841aa09fbf0';
  private base_url = 'https://genius-song-lyrics1.p.rapidapi.com';

  private cache = new Map<string, any>();

  constructor(
    private httpClient: HttpClient
  ) { }

  //function to search for song to get trackID
  searchTrack(trackName: string):Observable<any> {
    const cache_key = `search_${trackName}`;
    
    if (this.cache.has(cache_key)) {
      return of(this.cache.get(cache_key));
    }

    const headers = new HttpHeaders({
      'x-rapidapi-key': this.api_key,
      'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com',
    });

    return this.httpClient.get<any>(`${this.base_url}/search?q=${trackName}&per_page=10&page=1`, { headers }).pipe(
      tap(response => this.cache.set(cache_key, response)),
      throttleTime(1000),
      catchError(this.handleErrors)
    );
  }

  //function to search for song lyrics
  fetchLyrics(trackID: string):Observable<any> {
    const cache_key = `lyrics_${trackID}`;

    if (this.cache.has(cache_key)) {
      return of(this.cache.get(cache_key));
    }

    const headers = new HttpHeaders({
      'x-rapidapi-key': this.api_key,
      'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com',
    });

    return this.httpClient.get<any>(`${this.base_url}/song/lyrics/?id=${trackID}`, { headers }).pipe(
      tap(response => this.cache.set(cache_key, response)),
      throttleTime(1000),
      catchError(this.handleErrors)
    );
  }

  handleErrors(error: HttpErrorResponse) {
    let errorMessage:String;
    if (error.error instanceof ErrorEvent) {
      //error is client side
      errorMessage = `MESSAGE: ${error.error.message}`;
    } else {
      //error is server side
      errorMessage = `STATUS: ${error.status} MESSAGE: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
