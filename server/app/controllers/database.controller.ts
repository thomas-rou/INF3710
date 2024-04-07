import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { Bird } from "../../../common/tables/Bird";

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    // ======= HOTEL ROUTES =======
    // ex http://localhost:3000/database/hotel?hotelNb=3&name=LeGrandHotel&city=laval
    router.get("/birds", (req: Request, res: Response, _: NextFunction) => {
      var birdScientificName = req.query.nomScientifique ? req.query.nomScientifique : "";
      var birdCommonName = req.query.nomCommun ? req.query.nomCommun : "";
      var birdSpecieStatus = req.query.statutSpeces ? req.query.statutSpeces : "";
      var birdConsumeScientificName = req.query.nomScientifiqueComsommer ? req.query.nomScientifiqueComsommer : "";

      this.databaseService
        .filterBirds(
          birdScientificName as string,
          birdCommonName as string,
          birdSpecieStatus as string,
          birdConsumeScientificName as string
        )
        .then((result: pg.QueryResult) => {
          const birds: Bird[] = result.rows.map((bird: Bird) => ({
            nomscientifique: bird.nomscientifique,
            nomcommun: bird.nomcommun,
            statutspeces: bird.statutspeces,
            nomscientifiquecomsommer: bird.nomscientifiquecomsommer,
          }));
          res.json(birds);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.post(
      "/birds/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const bird: Bird = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun ? req.body.nomcommun : "",
          statutspeces: req.body.statutspeces ? req.body.statutspeces : "",
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer ? req.body.nomscientifiquecomsommer : "",
        };

        this.databaseService
          .createBird(bird)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.post(
      "/birds/delete/:scientificName",
      (req: Request, res: Response, _: NextFunction) => {
        const birdScientificName: string = req.params.scientificName;
        this.databaseService
          .deleteBird(birdScientificName)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.put(
      "/birds/update",
      (req: Request, res: Response, _: NextFunction) => {
        const bird: Bird = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun ? req.body.nomcommun : "",
          statutspeces: req.body.statutspeces ? req.body.statutspeces : "",
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer ? req.body.nomscientifiquecomsommer : "",
        };

        this.databaseService
          .updateBird(bird)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    // ======= GENERAL ROUTES =======
    router.get(
      "/tables/:tableName",
      (req: Request, res: Response, next: NextFunction) => {
        this.databaseService
          .getAllFromTable(req.params.tableName)
          .then((result: pg.QueryResult) => {
            res.json(result.rows);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    return router;
  }
}
