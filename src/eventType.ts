export enum EventType {
  MULTIPLE_NODES_SELECTED_ERROR = 'multiple_nodes_selected_error',
  NON_SQUARE_NODE_SELECTED_ERROR = 'non_square_node_selected_error',
  SELECTION_CLEARED = 'selection_cleared',
  IMAGE_UNIT_ARRAY_DATA = 'image_unit_array_data',
  USER_ACCOUNT_DATA = 'user_account_data',
  IMAGES_UINT_ARRAY_COLLECTION = 'images_uint_array_collection',
  OPEN_IMAGES_OPTIMIZATION_TAB = 'open_images_optimization_tab',
  OPEN_FAVICON_EXPORT_TAB = 'open_favicon_export_tab',
  IMAGE_COLLECTION_COMPLETE = 'image_collection_complete',
  UPDATE_PLUGIN_SETTINGS = 'update_plugin_settings',
  SELECTED_IMAGES_COLLECTION = 'selected_images_collection',
  SELECTED_IMAGES_COLLECTION_COMPLETE = 'selected_images_collection_collection',
}

export enum UIEventType {
  GET_IMAGES_UINT_ARRAY_COLLECTION = 'get_images_uint_array_collection',
  SET_CLIENT_STORE_DATA = 'set_client_store_data',
  GET_CLIENT_STORE_DATA = 'get_client_store_data',
  GET_SELECTED_IMAGES_UINT_ARRAY = 'get_selected_images_uint_array',
  ADD_IMAGE_TO_PAGE = 'add_image_to_page',
  SET_CLIENT_STORAGE_DATA = 'set_client_storage_data',
  GET_CLIENT_STORAGE_DATA = 'get_client_storage_data',
  // Startup state, requested by the UI once it is listening. The sandbox also pushes
  // these once on launch, but a slow-loading UI can miss that push.
  GET_USER_ACCOUNT_DATA = 'get_user_account_data',
  GET_PLUGIN_SETTINGS = 'get_plugin_settings',
  GET_LAUNCH_COMMAND = 'get_launch_command',
  GET_SELECTION_PREVIEW = 'get_selection_preview',
}
