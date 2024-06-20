import { Component } from '@angular/core';
import { ApiCallService } from '../../api-call.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  public songDetails:any;
  public trackName!:string;
  public songs:any[] = [];
  public songName!:string;
  public songId!:string;

  constructor(
    private apiSongs: ApiCallService
  ) {}

  public getSongDetails() {
    this.apiSongs.searchTrack(this.trackName).subscribe({
      next: (data) => {
        this.songs = data.hits;
        this.songDetails = this.songs.find(song => {
          return song.result.title.toLowerCase() === this.trackName.toLowerCase();
        });
        console.log(this.songDetails);
        this.songId = this.songDetails.result.id;
        console.log("Song ID: ", this.songId);
      },
      error: (err) => {
        console.error('Error fetching song details:', err);
      }
    });
  }
}
