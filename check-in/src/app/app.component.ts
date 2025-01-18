import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';  // Import MatAutocompleteModule
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Angular Material



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule,
    MatInputModule, HttpClientModule] // Include required modules
})
export class AppComponent implements OnInit {
  participants: string[] = [];
  members: string[] = [];
  filteredMembers: string[] = [];
  filteredParticipants: string[] = [];
  selectedMember: string = ''; // For check-in selection
  selectedParticipant: string = ''; // For check-out selection

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMembersFromCSV();
  }

  

  filterMembers(): void {
    const query = this.selectedMember.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.toLowerCase().includes(query)
    );
  }

  filterParticipants(): void {
    const query = this.selectedParticipant.toLowerCase();
    this.filteredParticipants = this.participants.filter(participant =>
      participant.toLowerCase().includes(query)
    );
  }

  // Load members from the CSV file
  loadMembersFromCSV(): void {
    this.http.get('assets/members.csv', { responseType: 'text' }).subscribe({
      next: (data) => {
        console.log(data)
        this.filteredMembers = this.members = data.split('\n').map(line => line.trim()).filter(line => line !== '');
      },
      error: (err) => {
        console.error('Error loading members from CSV:', err);
      }
    });
  }


  // Add selected member to participants
  addToParticipants(): void {
    if (this.selectedMember && !this.participants.includes(this.selectedMember)) {
      this.participants.push(this.selectedMember);
    }
    this.filterParticipants()
    this.selectedMember = '';
  }

  // Remove selected participant from participants
  removeFromParticipants(): void {
    if (this.selectedParticipant) {
      this.filteredParticipants = this.participants = this.participants.filter(participant => participant !== this.selectedParticipant);
      this.selectedParticipant = '';
    }
  }
}

