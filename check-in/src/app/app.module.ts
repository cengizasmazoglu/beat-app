// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule // Add CommonModule here
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }

