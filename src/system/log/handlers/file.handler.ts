import { BaseHandler } from "./base.handler";
import { HandlerInterface } from "./handler.interface";
import { date } from '../../helper/date.helper';
import * as fs from 'fs';
import { join } from 'path';

export class FileHandler extends BaseHandler implements HandlerInterface {
  /**
	 * Folder to hold logs
	 *
	 * @var string
	 */
	protected path;

	/**
	 * Extension to use for log files
	 *
	 * @var string
	 */
	protected fileExtension;

	/**
	 * Permissions for new log files
	 *
	 * @var integer
	 */
	protected filePermissions;

	/**
	 * context
	 *
	 * @var string
	 */
	protected context = '';

	//--------------------------------------------------------------------

	/**
	 * Constructor
	 *
	 * @param object config
	 */
  constructor(config: Object, context: string) {
    super(config, context);

    this.path = config['path'] !== '' ? config['path'] : join(process.env.WRITEPATH, 'logs');

		this.fileExtension = config['fileExtension'] !== '' ? config['fileExtension'] : 'log';
		this.fileExtension = this.fileExtension.replace('.', '');

		this.filePermissions = config['filePermissions'] !== '' ? config['filePermissions'] : 0o644;
		this.context = context;

  }

  //--------------------------------------------------------------------

	/**
	 * Handles logging the message.
	 * If the handler returns false, then execution of handlers
	 * will stop. Any handlers that have not run, yet, will not
	 * be run.
	 *
	 * @param level
	 * @param message
	 *
	 * @return boolean
	 */

  handle(level: string, message: any): boolean {
		const filepath = join(this.path,`log-${date('yyyy-MM-dd')}.${this.fileExtension}`);

		if(!fs.existsSync(filepath))
		{
			fs.writeFileSync(filepath, '', { mode: this.filePermissions });
		}

		const currentDate = date(this.dateFormat);
		const context =  this.context.length === 0 ? '' : `[${this.context}] `;

		const msg = `${level.toUpperCase()} - ${currentDate} --> ${context}${message}\n`;

		fs.appendFileSync(filepath, msg);

    return true;
  }

}
