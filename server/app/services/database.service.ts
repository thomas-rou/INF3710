import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Bird, SpecieStatus } from "../../../common/tables/Bird";

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
    const res = await client.query(`SELECT * FROM ${tableName};`);
    client.release();
    return res;
  }

  // ======= BIRD =======
  public async createBird(bird: Bird): Promise<pg.QueryResult> {
    var values: string[];
    var queryText: string;
    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);

    if (!bird.nomscientifique || !bird.nomcommun|| !bird.statutspeces || !Object.values(SpecieStatus).includes(bird.statutspeces))
      throw new Error("Invalid create bird values");
    if (bird.nomscientifiquecomsommer === "") {
      values = [bird.nomscientifique, bird.nomcommun, bird.statutspeces];
      queryText = `INSERT INTO Especeoiseau(nomscientifique, nomcommun, statutspeces) VALUES($1, $2, $3);`;
    } else {
      values= [bird.nomscientifique, bird.nomcommun, bird.statutspeces, bird.nomscientifiquecomsommer];
      queryText= `INSERT INTO Especeoiseau(nomscientifique, nomcommun, statutspeces, nomscientifiquecomsommer) VALUES($1, $2, $3, $4);`;
    }

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

    if (bird.nomscientifique.length > 0) toUpdateValues.push(`nomscientifique = '${bird.nomscientifique}'`);
    if (bird.nomcommun.length > 0) toUpdateValues.push(`nomcommun = '${bird.nomcommun}'`);
    if (bird.statutspeces.length > 0) toUpdateValues.push(`statutspeces = '${bird.statutspeces}'`);
    if (bird.nomscientifiquecomsommer.length > 0) toUpdateValues.push(`nomscientifiquecomsommer = '${bird.nomscientifiquecomsommer}'`);

    if (
      bird.nomscientifique.length === 0 ||
      bird.nomcommun.length === 0 ||
      bird.statutspeces.length === 0
    )
      throw new Error("Invalid bird update query");

    const query = `UPDATE Especeoiseau SET ${toUpdateValues.join(
      ", "
    )} WHERE nomscientifique = '${bird.nomscientifique}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteBird(birdScientificName: string): Promise<pg.QueryResult> {
    if (birdScientificName.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    await client.query(`SET search_path TO ornithologue_bd;`);
    // Delete the records in the "observation" table that reference the record you're trying to delete
    const deleteObservationQuery = `DELETE FROM observation WHERE nomscientifique = '${birdScientificName}';`;
    await client.query(deleteObservationQuery);

    // Delete the records in the "resider" table that reference the record you're trying to delete
    const deleteResiderQuery = `DELETE FROM resider WHERE nomscientifique = '${birdScientificName}';`;
    await client.query(deleteResiderQuery)

    // Set the foreign key column to null for any records that reference the record you're trying to delete
    const updateQuery = `UPDATE Especeoiseau SET nomscientifiquecomsommer = NULL WHERE nomscientifiquecomsommer = '${birdScientificName}';`;
    await client.query(updateQuery);

    // Delete the record in the "Especeoiseau" table
    const deleteQuery = `DELETE FROM Especeoiseau WHERE nomscientifique = '${birdScientificName}';`;

    const res = await client.query(deleteQuery);
    client.release();
    return res;
  }
}
