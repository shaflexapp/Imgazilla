import { MessageSender } from '@/plugin/MessageSender';
import { MessageType } from '@/plugin/FigmaUIMessaging';
import { EventType } from '@/eventType';

export class ErrorHandler {
  private messageSender: MessageSender;
  constructor() {
    this.messageSender = new MessageSender();
  }

  handleMultipleSelections() {
    const errorMessage: MessageType = {
      type: EventType.MULTIPLE_NODES_SELECTED_ERROR,
      payload: null,
    };
    this.sendMessageToUI(errorMessage);
  }

  handleNonSquareNode() {
    const errorMessage: MessageType = {
      type: EventType.NON_SQUARE_NODE_SELECTED_ERROR,
      payload: null,
    };
    this.sendMessageToUI(errorMessage);
  }

  private sendMessageToUI(message: MessageType) {
    this.messageSender.sendMessageToUI(message);
  }
}
