import { Logger } from "@nestjs/common";
import { BaseHandler } from "./base.handler";
import { HandlerInterface } from "./handler.interface";

export class ErrorlogHandler extends BaseHandler implements HandlerInterface {
  /**
   * Maps the log levels to the ChromeLogger types.
   *
   * @var array
   */
  protected levels = {
    'emergency' : 'fatal',
    'alert'     : 'fatal',
    'critical'  : 'fatal',
    'error'     : 'error',
    'warning'   : 'warn',
    'notice'    : 'verbose',
    'info'      : 'log',
    'debug'     : 'debug',
  };

  //--------------------------------------------------------------------

  /**
	 * Constructor
	 *
	 * @param object config
	 */
  constructor(config: Object, context: string) {
    super(config, context);

		this.context = context;

  }

  handle(level: any, message: any): boolean {

    // Default to 'log' type.
    let messageType = '';

    if (this.levels.hasOwnProperty(level)) {
      messageType = this.levels[level];
    }

    this.logger(message, messageType);

    return true;
  }

  /**
   * Extracted call to `new Logger()` in order to be tested.
   *
   * @codeCoverageIgnore
   */
  protected logger(message: string, messageType): boolean
  {
    const logger = new Logger(this.context);
    logger[messageType](message);

    return true;
  }
}