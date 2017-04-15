
export class Plant {
  public id:number;
  public name:string;
  public image:string;
  public place:string;
  public comment:string;
  public waterLevel:number; // 0 - 1

  constructor(id_:number, name_:string, image_:string, place_?:string, comment_?:string, waterLevel_?:number) {
    this.id = id_;
    this.name = name_;
    this.image = image_;
    this.place = place_;
    this.comment = comment_;
    this.waterLevel = waterLevel_;

    console.log('constructor new Plant', this);
  }
}