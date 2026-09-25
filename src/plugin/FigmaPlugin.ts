import { FigmaUI } from '@/plugin/FigmaUI';
import { Logger } from '@/plugin/Logger';

export class FigmaPlugin {
  private ui: FigmaUI;
  private logger: Logger;

  constructor() {
    this.ui = new FigmaUI();
    this.logger = new Logger();
  }

  async run() {
    try {
      await this.ui.init();
    } catch (e) {
      this.logger.logError(`Plugin initialization failed: ${e}`);
    }
  }
}

const plugin = new FigmaPlugin();

plugin.run();
