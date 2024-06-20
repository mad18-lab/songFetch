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
  public loading:boolean=false;
  public errorMsg: string | null = null;

  constructor(
    private apiSongs: ApiCallService
  ) {}

  public getSongDetails() {
    this.loading = true;
    this.errorMsg = null;
    this.songDetails = null;

    const timeOut = setTimeout(() => {
      if (!this.songDetails) {
        this.loading = false;
        this.errorMsg = "Sorry :( your song wasn't found. Please try again.";
      }
    }, 16000);

    this.apiSongs.searchTrack(this.trackName).subscribe({
      next: (data) => {
        this.songs = data.hits;
        this.songDetails = this.songs.find(song => {
          return song.result.title.toLowerCase() === this.trackName.toLowerCase();
        });
        console.log(this.songDetails);
        this.songId = this.songDetails.result.id;
        console.log("Song ID: ", this.songId);
        this.loading = false;
        clearTimeout(timeOut);

        if (!this.songDetails) {
          this.errorMsg = "Sorry :( your song wasn't found. Please try again.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = "An error occurred while fetching the song. Please try again.";
        clearTimeout(timeOut);
      }
    });
  }
}
