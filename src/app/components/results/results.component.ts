import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiCallService } from '../../api-call.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})

export class ResultsComponent implements OnChanges {
  @Input() songDetails:any;
  public lyrics!:string;

  constructor(
    private apiSongs: ApiCallService
  ) {}

  ngOnChanges() {
    if (this.songDetails) {
      this.displayLyrics();
    }
  }

  public displayLyrics() {
    this.apiSongs.fetchLyrics(this.songDetails.result.id).subscribe({
      next: (data) => {
        console.log(data.lyrics.lyrics.body);
        this.lyrics = data.lyrics.lyrics.body.html;
      },
      error: (err) => {
        console.error("Error fetching song lyrics: ", err);
      }
    })
  }
}
