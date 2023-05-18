
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  test()  {return {message: 'test'}};

  test2()  {return {message: 'test2'}};

}

