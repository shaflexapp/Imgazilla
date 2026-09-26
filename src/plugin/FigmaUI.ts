import { FigmaUIMessaging, MessageType } from '@/plugin/FigmaUIMessaging';
import { FigmaEventManager } from '@/plugin/FigmaEventManager';
import { MessageSender } from '@/plugin/MessageSender';
import { FigmaAPI } from '@/plugin/FigmaAPI';
import { EventType, UIEventType } from '@/eventType';
import { ImageUintArrayCollector } from '@/plugin/ImageUintArrayCollector';
import { RelaunchDataManager } from '@/plugin/RelaunchDataManager';
import { PluginDataStorage } from '@/plugin/PluginDataStorage';
import { RELAUNCH_DATA_STORE_KEY } from '@/plugin/constants';
import { CommandHandler } from '@/plugin/CommandHandler';
import { FigmaGlobalSettingsManager } from '@/plugin/FigmaGlobalSettingsManager';
import { FigmaStorageManager } from '@/plugin/FigmaStorageManager';
import { Logger } from '@/plugin/Logger';

export class FigmaUI {
  private readonly width: number = 700;
  private readonly height: number = 650;

  private figmaUIMessaging: FigmaUIMessaging;
  private figmaEventManager: FigmaEventManager;
  private messageSender: MessageSender;
  private figmaAPI: FigmaAPI;
  private relaunchDataManager: RelaunchDataManager;
  private pluginDataStorage: PluginDataStorage;
  private commandHandler: CommandHandler;
  private globalSettings: FigmaGlobalSettingsManager;
  private logger: Logger;

  private readonly storageManager: FigmaStorageManager;

  constructor() {
    figma.showUI(__html__, { width: this.width, height: this.height });

    this.figmaUIMessaging = new FigmaUIMessaging();
    this.figmaEventManager = new FigmaEventManager();
    this.messageSender = new MessageSender();

    this.figmaAPI = new FigmaAPI();
    this.relaunchDataManager = new RelaunchDataManager();
    this.pluginDataStorage = new PluginDataStorage();
    this.commandHandler = new CommandHandler();
    this.globalSettings = new FigmaGlobalSettingsManager();
    this.storageManager = new FigmaStorageManager();
    this.logger = new Logger();
  }

  async init() {
    this.clearConsole();

    // Subscribe before any await, otherwise early UI requests
    // (e.g. GET_CLIENT_STORAGE_DATA on mount) are dropped.
    this.figmaUIMessaging.subscribe((message: MessageType) =>
      this.handleUIMessage(message).catch((e) =>
        this.logger.logError(`Failed to handle "${message?.type}": ${e}`),
      ),
    );
    await this.figmaEventManager.addSelectionChangeListener(() =>
      this.figmaAPI.handleSelectionChange(),
    );

    this.commandHandler.handleCommand();
    // Sent before the slower awaits below, so the UI can start loading the account early.
    this.figmaAPI.sendCurrentUserInformation();

    await this.globalSettings.sendToUIGlobalSettings();

    const relaunchData = this.pluginDataStorage.getCurrentPageData(
      RELAUNCH_DATA_STORE_KEY,
    );

    // We call this function for first time and check if user selected right node
    await this.figmaAPI.handleSelectionChange();

    if (!Boolean(relaunchData)) {
      this.setRelaunchData();
    }
  }

  private clearConsole() {
    console.clear();
  }

  private setRelaunchData() {
    this.relaunchDataManager.setRelaunchDataForAllImages();

    figma.currentPage.setRelaunchData({
      imagesOptimization: 'Optimized Figma images',
    });
    this.pluginDataStorage.setCurrentPageData(RELAUNCH_DATA_STORE_KEY, 'true');
  }

  private async handleUIMessage(message: MessageType) {
    const { type, payload } = message;

    // Replies to the UI's startup-state requests (see UIEventType).
    if (type === UIEventType.GET_USER_ACCOUNT_DATA) {
      this.figmaAPI.sendCurrentUserInformation();
    }

    if (type === UIEventType.GET_PLUGIN_SETTINGS) {
      await this.globalSettings.sendToUIGlobalSettings();
    }

    if (type === UIEventType.GET_LAUNCH_COMMAND) {
      this.commandHandler.handleCommand();
    }

    if (type === UIEventType.GET_SELECTION_PREVIEW) {
      await this.figmaAPI.handleSelectionChange();
    }

    if (type === UIEventType.GET_IMAGES_UINT_ARRAY_COLLECTION) {
      await this.collectNodes();
    }

    if (type === UIEventType.SET_CLIENT_STORE_DATA) {
      await this.handleClientStoreData(payload);
    }

    if (type === UIEventType.SET_CLIENT_STORAGE_DATA) {
      await this.handleSetClientStorage(
        payload as {
          key: string;
          value: string;
        },
      );
    }

    if (type === UIEventType.GET_CLIENT_STORAGE_DATA) {
      await this.handleGetClientStoreData(
        payload as {
          key: string;
        },
      );
    }

    if (type === UIEventType.GET_SELECTED_IMAGES_UINT_ARRAY) {
      await this.figmaAPI.handleSelectedNodes();
    }

    if (type === UIEventType.ADD_IMAGE_TO_PAGE) {
      await this.figmaAPI.handleAddImageToPage(payload);
    }
  }

  private async handleSetClientStorage(payload: {
    key: string;
    value: string;
  }) {
    await this.storageManager.setGlobalData(payload.key, payload.value);
  }

  private async handleGetClientStoreData(payload: { key: string }) {
    const value = await this.storageManager.getGlobalData(payload.key);

    const message = {
      type: UIEventType.GET_CLIENT_STORAGE_DATA,
      payload: {
        key: payload.key,
        value: value ?? false,
      },
    };
    this.sendMessageToUI(message);
  }

  private async handleClientStoreData(payload: any) {
    await this.globalSettings.updateGlobalSettings(payload);
  }

  private async collectNodes() {
    const collector = new ImageUintArrayCollector({
      chunkSize: 1,
      onChunkProcessed: (collection: ImageInfo[]) => {
        if (collection.length === 0) return;
        this.figmaAPI.sendImageCollectionToUI(collection);
      },
      onCompleted: () => {
        collector.clear();

        const message = {
          type: EventType.IMAGE_COLLECTION_COMPLETE,
          payload: {},
        };

        this.sendMessageToUI(message);
      },
    });

    await collector.collectNodesFromPage();
  }

  private sendMessageToUI(message: MessageType) {
    this.messageSender.sendMessageToUI(message);
  }
}
