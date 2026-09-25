import { MessageSender } from '@/plugin/MessageSender';
import { EventType } from '@/eventType';
import { ErrorHandler } from '@/plugin/ErrorHandler';
import { Logger } from '@/plugin/Logger';
import { MessageType } from '@/plugin/FigmaUIMessaging';
import { ImageUintArrayCollector } from '@/plugin/ImageUintArrayCollector';

export class FigmaAPI {
  private messageSender: MessageSender;
  private errorHandler: ErrorHandler;
  private logger: Logger;
  private selectionChangeId = 0;

  constructor() {
    this.messageSender = new MessageSender();
    this.errorHandler = new ErrorHandler();
    this.logger = new Logger();
  }

  sendCurrentUserInformation() {
    const message = {
      type: EventType.USER_ACCOUNT_DATA,
      payload: {
        data: figma.currentUser,
      },
    };
    this.messageSender.sendMessageToUI(message);
  }

  sendImageCollectionToUI(collection: ImageInfo[]) {
    const message = {
      type: EventType.IMAGES_UINT_ARRAY_COLLECTION,
      payload: {
        data: collection,
      },
    };

    this.messageSender.sendMessageToUI(message);
  }

  sendSelectedImageCollectionToUI(collection: ImageInfo[]) {
    const message = {
      type: EventType.SELECTED_IMAGES_COLLECTION,
      payload: {
        data: collection,
      },
    };

    this.messageSender.sendMessageToUI(message);
  }

  async handleSelectionChange() {
    const changeId = ++this.selectionChangeId;
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      this.sendMessageToUI({
        type: EventType.SELECTION_CLEARED,
        payload: null,
      });
      return;
    }

    if (selectedNodes.length > 1) {
      this.errorHandler.handleMultipleSelections();
      return;
    }

    const selectedNode = selectedNodes[0];

    if (selectedNode.height !== selectedNode.width) {
      this.errorHandler.handleNonSquareNode();
      return;
    }

    try {
      const unitArray = await selectedNode.exportAsync({
        format: 'PNG',
        suffix: '',
        contentsOnly: true,
        constraint: {
          type: 'SCALE',
          value: 1,
        },
      });

      // The selection changed again (e.g. was cleared) while exporting, so this image is stale.
      if (changeId !== this.selectionChangeId) {
        return;
      }

      const message = {
        type: EventType.IMAGE_UNIT_ARRAY_DATA,
        payload: {
          data: unitArray,
        },
      };

      this.sendMessageToUI(message);
    } catch (e) {
      this.logger.logError(e);
    }
  }

  async handleSelectedNodes() {
    const selectedNodes = figma.currentPage.selection;

    const collector = new ImageUintArrayCollector({
      chunkSize: 1,
      onChunkProcessed: (collection: ImageInfo[]) => {
        this.sendSelectedImageCollectionToUI(collection);
      },
      onCompleted: () => {
        collector.clear();

        const message = {
          type: EventType.SELECTED_IMAGES_COLLECTION_COMPLETE,
          payload: {},
        };

        this.sendMessageToUI(message);
      },
    });

    if (selectedNodes.length > 0) {
      await collector.collectNodesFromSelection(selectedNodes as BaseNode[]);
    }

    if (selectedNodes.length === 0) {
      const message = {
        type: EventType.SELECTED_IMAGES_COLLECTION_COMPLETE,
        payload: {},
      };

      this.sendMessageToUI(message);
    }
  }

  async handleAddImageToPage(payload: any) {
    const { name, dimensions, processedImageData } = payload;
    const imageHash = figma.createImage(processedImageData).hash;

    const imageNode = figma.createRectangle();
    imageNode.resize(dimensions.width, dimensions.height);

    imageNode.fills = [
      {
        type: 'IMAGE',
        scaleMode: 'FILL',
        imageHash: imageHash,
      },
    ];

    imageNode.name = name;

    const { x, y } = figma.viewport.center;
    imageNode.x = x - imageNode.width / 2;
    imageNode.y = y - imageNode.height / 2;

    figma.currentPage.appendChild(imageNode);
    figma.currentPage.selection = [imageNode];
  }

  private sendMessageToUI(message: MessageType) {
    this.messageSender.sendMessageToUI(message);
  }
}
