import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Bird } from "../../../common/tables/Bird";

@injectable()
export class DatabaseService {
  // TODO: A MODIFIER POUR VOTRE BD
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "ornithologue_bd",
    password: "inf3710",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= DEBUG =======
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);
    const res = await client.query(`SELECT * FROM ornithologue_bd.${tableName};`);
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createBird(bird: Bird): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);

    if (!bird.nomscientifique || !bird.nomcommun|| !bird.statutspeces || !bird.nomscientifiquecomsommer)
      throw new Error("Invalid create hotel values");

    const values: string[] = [bird.nomscientifique, bird.nomcommun, bird.statutspeces, bird.nomscientifiquecomsommer];
    const queryText: string = `INSERT INTO Especeoiseau VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async filterBirds(
    birdScientificName: string,
    birdCommonName: string,
    birdSpecieStatus: string,
    birdConsumeScientificName: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);

    const searchTerms: string[] = [];
    if (birdScientificName.length > 0) searchTerms.push(`nomscientifique = '${birdScientificName}'`);
    if (birdCommonName.length > 0) searchTerms.push(`nomcommun = '${birdCommonName}'`);
    if (birdSpecieStatus.length > 0) searchTerms.push(`statutspeces = '${birdSpecieStatus}'`);
    if (birdConsumeScientificName.length > 0) searchTerms.push(`nomscientifiquecomsommer = '${birdConsumeScientificName}'`);

    let queryText = "SELECT * FROM Especeoiseau";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // modify name or city of a hotel
  public async updateBird(bird: Bird): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);

    let toUpdateValues = [];

    if (bird.nomscientifique.length > 0) toUpdateValues.push(`scientificName = '${bird.nomscientifique}'`);
    if (bird.nomcommun.length > 0) toUpdateValues.push(`name = '${bird.nomcommun}'`);
    if (bird.statutspeces.length > 0) toUpdateValues.push(`specieStatus = '${bird.statutspeces}'`);
    if (bird.nomscientifiquecomsommer.length > 0) toUpdateValues.push(`consumeScientificName = '${bird.nomscientifiquecomsommer}'`);

    if (
      bird.nomscientifique.length === 0 ||
      bird.nomcommun.length === 0 ||
      bird.statutspeces.length === 0 ||
      bird.nomscientifiquecomsommer.length === 0
    )
      throw new Error("Invalid hotel update query");

    const query = `UPDATE Especeoiseau SET ${toUpdateValues.join(
      ", "
    )} WHERE hotelNb = '${bird.nomscientifique}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteBird(birdScientificName: string): Promise<pg.QueryResult> {
    if (birdScientificName.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);
    const query = `DELETE FROM Especeoiseau WHERE hotelNb = '${birdScientificName}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }
}
