export const PAGINATION_SIZE = 32;
export const FILTER_NAMESPACE = "filter";
export const ATTR_LOADING_EAGER = "eager";
export const FOOTER_MENU_HANDLE = "footer";
export const HEADER_MENU_HANDLE = "main-menu";
export const FILTERABLE_COLLECTION_NAME = "all";
export const DEFAULT_GRID_IMG_LOAD_EAGER_COUNT = 4;

export function getImageLoadingPriority(
  index: number,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT
): "eager" | undefined {
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined;
}
