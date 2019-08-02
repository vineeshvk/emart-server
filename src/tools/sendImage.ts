import { Image } from '../entity/Image';
import * as fs from 'fs';

export const sendImage = async (app: any) => {
  await app.use('/image/:id', async (req, res) => {
    try {
      const inventoryId = req.params.id;
      const image = await Image.findOne({ inventoryId });
      console.log('image', image);

      if (!image) throw Error();

      const base64 = image.imageString.replace(/^data:image\/png;base64,/, '');
      const img = Buffer.from(base64, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img, 'binary');
    } catch {
      fs.readFile('./placeholder_image.jpg', (err, data) => {
        console.log(err);

        res.end(data, 'binary');
      });
    }
  });
};
