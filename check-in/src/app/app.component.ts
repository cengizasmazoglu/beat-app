import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';  // Import MatAutocompleteModule
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Firestore, collection, getDoc, deleteField, updateDoc, arrayRemove, collectionData, doc, addDoc, getDocs, setDoc, arrayUnion } from '@angular/fire/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


interface Member {
  name: string;
  gender: string;
}

interface EventData {
  name: string;
  date: string;
}



//initializeApp(environment);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [],
  imports: [NgFor, FormsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule,
    MatInputModule
  ] // Include required modules
})
export class AppComponent implements OnInit {
  participants: Member[] = [];
  members: Member[] = [];
  filteredMembers: Member[] = [];
  filteredParticipants: Member[] = [];
  selectedMember: string = ''; // For check-in selection
  selectedParticipant: string = ''; // For check-out selection
  selectedEvent: string = ''; // For check-out selection


  events: EventData[] = [];


  
  constructor(private http: HttpClient, private firestore: Firestore) {
    
  }





  ngOnInit(): void {
    //this.loadMembersFromCSV();
    this.loadMembersFromFirestore(); // Load members from Firestore instead of CSV
  }

  async addMember(newMember: Member) {
    const eventDocRef = doc(this.firestore, `events/events`);
    try {
      // Get the document snapshot
      const docSnap = await getDoc(eventDocRef);
  
      // Retrieve the `arr` array
      const arr = docSnap.get("arr");
  
      if (Array.isArray(arr)) {
        // Find the index of the event in the `arr` array
        const index = arr.findIndex((elem: any) => elem["event_name"] === this.selectedEvent);
  
        if (index !== -1) {
          // Add the new member to the `members` array of the specific event
          const updatedMembers = [...(arr[index].members || []), { name: newMember.name, gender: newMember.gender }];
  
          // Update the `members` property of the specific event
          arr[index].members = updatedMembers;
          this.filteredParticipants = updatedMembers;
          // Update the entire `arr` array in Firestore
          await updateDoc(eventDocRef, { arr });
          console.log("Member added successfully");
        } else {
          console.error("Event not found in the array");
        }
      } else {
        console.error("'arr' is not an array");
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  }

  async deleteMember(memberToDelete: string) {
    const eventDocRef = doc(this.firestore, `events/events`);
    try {
      // Get the document snapshot
      const docSnap = await getDoc(eventDocRef);
  
      // Retrieve the `arr` array
      const arr = docSnap.get("arr");
  
      if (Array.isArray(arr)) {
        // Find the index of the event in the `arr` array
        const index = arr.findIndex((elem: any) => elem["event_name"] === this.selectedEvent);
  
        if (index !== -1) {
          // Filter out the member to delete from the `members` array
          const updatedMembers = (arr[index].members || []).filter(
            (member: any) => member.name !== memberToDelete);
  
          // Update the `members` property of the specific event
          arr[index].members = updatedMembers;
          this.filteredParticipants = updatedMembers;
  
          // Update the entire `arr` array in Firestore
          await updateDoc(eventDocRef, { arr });
          console.log("Member deleted successfully");
        } else {
          console.error("Event not found in the array");
        }
      } else {
        console.error("'arr' is not an array");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  }


  async loadMembersFromFirestore() {
    const eventDocRef = doc(this.firestore, `mem_gen/members`);

    try {
      // Fetch the document
      const docSnap = await getDoc(eventDocRef);

      // Check if the document exists
      if (docSnap.exists()) {
          // Document data (for example, the members array)
          const membersData = docSnap.data();
          //console.log("Document data:", membersData["arr"]);
          this.filteredMembers = this.members = membersData["arr"];
          console.log(this.filteredMembers);
      } else {
          console.log("No such document!");
      }
    } catch (error) {
        console.error("Error getting document:", error);
    }

    const eventDoc = doc(this.firestore, `events/events`);
    const docSnap = await getDoc(eventDoc);

    docSnap.get("arr").forEach((elem: any, index: number) => {
        if (index == 0){
          this.selectedEvent = elem["event_name"]; // Default to the first event name
          this.filteredParticipants = this.participants = elem["members"];
        }
        this.events.push({"name": elem["event_name"], "date": elem["event_date"]});
    });

    
    
    console.log(this.filteredParticipants);
    return null;
  }

  async getEvent(event: Event) {
    const target = event.target as HTMLSelectElement;
    let selectedValue: string | null = null; // Declare outside the block
    
    if (target) {
      selectedValue = target.value; // Access the selected value
      this.selectedEvent = selectedValue;
      console.log('Selected Event Name:', selectedValue);
    } else {
      console.error('Event target is null');
    }
    const eventDoc = doc(this.firestore, `events/events`);
    const docSnap = await getDoc(eventDoc);

    docSnap.get("arr").forEach((elem: any) => {
      if (elem["event_name"] === selectedValue) {
        this.filteredParticipants = this.participants = elem["members"];
        
      }
      
    });
    console.log('Selected Event:', event);
  }



  async exportToExcel(): Promise<void> {
    const formattedData = this.filteredParticipants.map(participant => ({
      name: participant.name,
      gender: participant.gender, 
    }));
    console.log(formattedData)
    console.log(this.filteredParticipants)
    
    const eventDoc = doc(this.firestore, `events/events`);
    const docSnap = await getDoc(eventDoc);
    let ev_date: string | null = null; // Declare outside the block
    docSnap.get("arr").forEach((elem: any, index: number) => {
        if (this.selectedEvent == elem["event_name"]){
          ev_date = elem["event_date"];
        }
      });



    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.selectedEvent + '_' + ev_date);

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    
    saveAs(blob, this.selectedEvent + '_' + ev_date + '.xlsx');
  }

  filterMembers(): void {
    console.log(this.selectedMember)
    const query = this.selectedMember.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member["name"].toLowerCase().includes(query)
    );
  }

  async filterParticipants() {
    const query = this.selectedParticipant.toLowerCase();
    this.filteredParticipants = this.participants.filter(participant =>
      participant["name"].toLowerCase().includes(query)
    );  
  }

  // Load members from the CSV file
  loadMembersFromCSV(): void {
    this.http.get('assets/members.csv', { responseType: 'text' }).subscribe({
      next: (data) => {
        //console.log(data)
        //this.filteredMembers = this.members = data.split('\n').map(line => line.trim()).filter(line => line !== '');
      },
      error: (err) => {
        console.error('Error loading members from CSV:', err);
      }
    });
  }


  // Add selected member to participants
  addToParticipants(): void {
    if (this.selectedMember &&
      !this.participants.some((participant) => participant.name === this.selectedMember)) {
      
      const member = this.members.find((m) => m.name === this.selectedMember);
      if (member) {
        // Push the matched member object to participants
        this.participants.push({ name: member.name, gender: member.gender });
      } else {
        this.participants.push({ name: this.selectedMember, gender: "F" });
      }
      this.addMember(<Member>member);
    }
    this.filterParticipants()
    this.selectedMember = '';
  }



  // Remove selected participant from participants
  removeFromParticipants(): void {
    if (this.selectedParticipant) {
      this.filteredParticipants = this.participants = this.participants.filter(participant => participant["name"] !== this.selectedParticipant);
      this.deleteMember(this.selectedParticipant)
      this.selectedParticipant = '';
    }
  }
}

