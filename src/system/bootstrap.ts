import { Inject, Injectable } from '@nestjs/common';
import { Path } from './interfaces/path/path.interface';
import { Logger } from './log/logger';

@Injectable()
export class Bootstrap {
  constructor(@Inject('APP_PATHS') private readonly paths: Path, private readonly log: Logger) {
    this.log.setContext('Bootstrap');

    /*
    * ---------------------------------------------------------------
    * SETUP OUR PATH CONSTANTS
    * ---------------------------------------------------------------
    *
    * The path constants provide convenient access to the folders
    * throughout the application. We have to setup them up here
    * so they are available in the config files that are loaded.
    */

    /**
     * The path to the system directory.
     */
    if (! process.env.SYSTEMPATH)
    {
      process.env.SYSTEMPATH = this.paths.systemDirectory;
    }
    
    /**
     * The path to the writable directory.
     */
    if (! process.env.WRITEPATH)
    {
      process.env.WRITEPATH = this.paths.writableDirectory;
    }

    this.log.info(`Bootstrap Class Initialized...`);
  }
}
