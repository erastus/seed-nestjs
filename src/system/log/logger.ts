import { Inject, Injectable } from '@nestjs/common';
import { isNumeric } from '../helper';
import { FileHandler } from './handlers/file.handler';

const clases = {
	FileHandler,
};

@Injectable()
export class Logger {

	/**
	 * Path to save log files to.
	 *
	 * @var string
	 */
	protected logPath;

	/**
	 * Used by the logThreshold Config setting to define
	 * which errors to show.
	 *
	 * @var array
	 */
	protected logLevels = {
		'emergency'	: 1,
		'alert'     : 2,
		'critical'  : 3,
		'error'     : 4,
		'warning'   : 5,
		'notice'    : 6,
		'info'      : 7,
		'debug'     : 8,
	};

	/**
	 * Array of levels to be logged.
	 * The rest will be ignored.
	 * Set in Config/logger.php
	 *
	 * @var array
	 */
	protected loggableLevels = [];

	/**
	 * File permissions
	 *
	 * @var integer
	 */
	protected filePermissions = 0o644;

	/**
	 * Format of the timestamp for log files.
	 *
	 * @var string
	 */
	protected dateFormat = 'yyyy-MM-dd HH:mm:ss';

	/**
	 * Filename Extension
	 *
	 * @var string
	 */
	protected fileExt;

	/**
	 * Caches instances of the handlers.
	 *
	 * @var array
	 */
	protected handlers = [];

	/**
	 * Holds the configuration for each handler.
	 * The key is the handler's class name. The
	 * value is an associative array of configuration
	 * items.
	 *
	 * @var array
	 */
	protected handlerConfig = {};

	/**
	 * Caches logging calls for debugbar.
	 *
	 * @var array
	 */
	public logCache;

	/**
	 * Should we cache our logged items?
	 *
	 * @var boolean
	 */
	protected cacheLogs = false;

	//--------------------------------------------------------------------

	/**
	 * Constructor.
	 *
	 * @param  type    config
	 * @param  boolean debug
	 * @throws \RuntimeException
	 */

  constructor() {
		const threshold = 9;
		this.loggableLevels = Array.isArray(threshold) ? threshold : Array.from({ length: Number(threshold) }, (value, index) => index + 1);

		// Now convert loggable levels to strings.
		// We only use numbers to make the threshold setting convenient for users.
		if (this.loggableLevels)
		{
			let temp = [];
			this.loggableLevels.forEach((level) => 
				{
					temp.push(Object.keys(this.logLevels).find(key => this.logLevels[key] === Number(level)))
				}
			);

			this.loggableLevels = temp;
			//unset(temp);
		}

		// this.dateFormat = config.dateFormat ?? this.dateFormat;

		// if (! is_array($config->handlers) || empty($config->handlers))
		// {
		// 	throw LogException::forNoHandlers('LoggerConfig');
		// }

		// Save the handler configuration for later.
		// Instances will be created on demand.
		// this.handlerConfig = config.handlers;
		this.handlerConfig = {
			FileHandler: {
				'handles': [
					'critical',
					'alert',
					'emergency',
					'debug',
					'error',
					'info',
					'notice',
					'warning',
				],
				'fileExtension': '',
				'path': ''
			}
		};

		// this.cacheLogs = debug;
		// if (this.cacheLogs)
		// {
		// 	this.logCache = [];
		// }
  }

	//--------------------------------------------------------------------

	/**
	 * System is unusable.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public emergency(message: String, context: Array<any> = [])
	{
		this.log('emergency', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Action must be taken immediately.
	 *
	 * Example: Entire website down, database unavailable, etc. This should
	 * trigger the SMS alerts and wake you up.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public alert(message: String, context: Array<any> = [])
	{
		this.log('alert', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Critical conditions.
	 *
	 * Example: Application component unavailable, unexpected exception.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public critical(message: String, context: Array<any> = [])
	{
		this.log('critical', message, context);
	}

	//--------------------------------------------------------------------

  /**
	 * Runtime errors that do not require immediate action but should typically
	 * be logged and monitored.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public error(message: String, context: Array<any> = [])
	{
		this.log('error', message, context);
	}

  //--------------------------------------------------------------------

	/**
	 * Exceptional occurrences that are not errors.
	 *
	 * Example: Use of deprecated APIs, poor use of an API, undesirable things
	 * that are not necessarily wrong.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public warning(message: String, context: Array<any> = [])
	{
		this.log('warning', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Normal but significant events.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public notice(message: String, context: Array<any> = [])
	{
		this.log('notice', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Interesting events.
	 *
	 * Example: User logs in, SQL logs.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public info(message: String, context: Array<any> = [])
	{
		this.log('info', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Detailed debug information.
	 *
	 * @param string message
	 * @param array  context
	 *
	 * @return null
	 */
	public debug(message: String, context: Array<any> = [])
	{
		this.log('debug', message, context);
	}

	//--------------------------------------------------------------------

	/**
	 * Logs with an arbitrary level.
	 *
	 * @param mixed  level
	 * @param string message
	 * @param array  context
	 *
	 * @return boolean
	 */
	public log(level: any, message: String, context: Array<any> = []): boolean
	{
		if (isNumeric(level))
		{
			level = Object.keys(this.logLevels).find(key => this.logLevels[key] === Number(level));
		}

		// Is the level a valid level?
		if (! this.logLevels.hasOwnProperty(level))
		{
			//TODO: throw LogException::forInvalidLogLevel($level);
			throw Error(`forInvalidLogLevel(${level})`)
		}

		// Does the app want to log this right now?
		if (! this.loggableLevels.includes(level))
		{
			return false;
		}

		// Parse our placeholders
		// message = this.interpolate(message, context);

		// if (! is_string($message))
		// {
		// 	$message = print_r($message, true);
		// }

		// if (this.cacheLogs)
		// {
		// 	this.logCache[] = [
		// 		'level' => level,
		// 		'msg'   => message,
		// 	];
		// }

		for (const className in this.handlerConfig) {
			const config = this.handlerConfig[className];
			if (! this.handlers.includes(className))
			{
				this.handlers[className] = new clases[className](config);
			}

			/**
			 * @var \system\log\handlers\handler.interface
			 */
			const handler = this.handlers[className];

			if (! handler.canHandle(level))
			{
				continue;
			}

			// If the handler returns false, then we
			// don't execute any other handlers.
			if (! handler.setDateFormat(this.dateFormat).handle(level, message))
			{
				break;
			}
		}

		return true;
	}

}
