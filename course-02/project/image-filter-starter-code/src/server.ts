import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
//import { FilterImageFromURLRouter , DeleteLocalFilesRouter  } from './util/util';
//import { FilterImageFromURLRouter } from './util/util';

import { Router, Request, Response } from 'express';
//import urlExists from 'url-exists';
//import { urlExists } from 'url-exists';

//import isUrl from 'is-url';
import isUrl from 'is-url';
import { urlExists } from 'url-exists-promise';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  //const port = process.env.PORT || 8081;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  const router: Router = Router();
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.get( "/", async ( req, res ) => {
    res.send( "GET /filteredimage?image_url={{URL}}" );
  });

app.get('/filteredimage/',
      async (req: Request, res: Response) => {
      //console.log( `==> start` );
      let { image_url } = req.query;
      //let { image_url } = req.params;

      if (! isUrl(image_url)) {
        res.status(422).send( `URL Invalid: "${image_url}"` )
      }else{
        urlExists(image_url)
          .then(exists=>filterImageFromURL(image_url).then(outputpath=>{res.status(200).sendFile(outputpath, function(err) {
                if (! err) {
                  let list_delete : string[] = [outputpath]
                  deleteLocalFiles(list_delete);
                }
              })
            }))
          .catch(err=>res.status(422).send( `URL Not Exists: ${image_url}` ))
      }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
