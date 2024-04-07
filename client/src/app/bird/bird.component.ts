import { Component, ElementRef, ViewChild } from "@angular/core";
import { Bird, SpecieStatus } from "../../../../common/tables/Bird";
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
  public specieStatuses: string[] = Object.values(SpecieStatus);
  public birdScientificNames: string[] = [];


  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getBirds();
  }

  public getBirds(): void {
    this.communicationService.getBirds().subscribe((birds: Bird[]) => {
      this.birds = birds;
      this.birdScientificNames = birds.map((bird: Bird) => bird.nomscientifique);
    });
  }

  public insertBird(): void {
    const bird: any = {
      nomscientifique: this.newBirdScientificName.nativeElement.innerText,
      nomcommun: this.newBirdName.nativeElement.innerText,
      statutspeces: this.newBirdStatus.nativeElement.value,
      nomscientifiquecomsommer: this.newBirdScientificNameConsume.nativeElement.value,
    };

    this.communicationService.insertBird(bird).subscribe((res: number) => {
      if (res > 0) {
        this.communicationService.filter("update");
      }
      this.refresh();
      this.getBirds();
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

  public deleteBird(birdScientificName: string) {
    this.communicationService.deleteBird(birdScientificName).subscribe((res: any) => {
      this.refresh();
    });
  }

  public changeBirdScientificName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].nomscientifique = editField;
  }

  public changeBirdName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].nomcommun = editField;
  }

  public changeBirdStatus(event: any, i:number){
    this.birds[i].statutspeces = event.target.value;
  }

  public changeBirdScientificNameConsume(event: any, i:number){
    this.birds[i].nomscientifiquecomsommer = event.target.value;
  }

  public updateBird(i: number) {
    this.communicationService.updateBird(this.birds[i]).subscribe((res: any) => {
      this.refresh();
    });
  }
}
