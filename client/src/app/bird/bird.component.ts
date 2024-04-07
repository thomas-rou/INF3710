import { Component, ElementRef, ViewChild } from "@angular/core";
import { Bird } from "../../../../common/tables/Bird";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-bird",
  templateUrl: "./bird.component.html",
  styleUrls: ["./bird.component.css"],
})
export class BirdComponent {
  @ViewChild("newBirdScientificName") newBirdScientificName: ElementRef;
  @ViewChild("newBirdName") newBirdName: ElementRef;
  @ViewChild("newBirdStatus") newBirdStatus: ElementRef;
  @ViewChild("newBirdScientificNameConsume") newBirdScientificNameConsume: ElementRef;

  public birds: Bird[] = [];
  public duplicateError: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getBirds();
  }

  public getBirds(): void {
    this.communicationService.getBirds().subscribe((birds: Bird[]) => {
      this.birds = birds;
    });
  }

  public insertBird(): void {
    const bird: any = {
      scientificName: this.newBirdScientificName.nativeElement.innerText,
      commonName: this.newBirdName.nativeElement.innerText,
      specieStatus: this.newBirdStatus.nativeElement.innerText,
      consumeScientificName: this.newBirdScientificNameConsume.nativeElement.innerText,
    };

    this.communicationService.insertBird(bird).subscribe((res: number) => {
      if (res > 0) {
        this.communicationService.filter("update");
      }
      this.refresh();
      this.duplicateError = res === -1;
    });
  }

  private refresh() {
    this.getBirds();
    this.newBirdScientificName.nativeElement.innerText = "";
    this.newBirdName.nativeElement.innerText = "";
    this.newBirdStatus.nativeElement.innerText = "";
    this.newBirdScientificNameConsume.nativeElement.innerText = "";
  }

  public deleteHotel(birdScientificName: string) {
    this.communicationService.deleteBird(birdScientificName).subscribe((res: any) => {
      this.refresh();
    });
  }

  public changeBirdScientificName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].scientificName = editField;
  }

  public changeBirdName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].commonName = editField;
  }

  public changeBirdStatus(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].specieStatus = editField;
  }

  public changeBirdScientificNameConsume(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].consumeScientificName = editField;
  }

  public updateBird(i: number) {
    this.communicationService.updateBird(this.birds[i]).subscribe((res: any) => {
      this.refresh();
    });
  }
}
