// routes
import { PATH_DASHBOARD } from "./routes/paths";

export const BE_PORT = 6789;

export const BASE_URL = `http://localhost:${BE_PORT}/api/v1`;

export const WS_URL = `http://localhost:${BE_PORT}/ws`

export const IMAGE_DB_API_KEY = '66bcab386c278f7ace4ac92db51c0992';

export const IMAGE_DB_URL = 'https://api.imgbb.com/1/upload';

export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
  themeContrast: "default",
  themeLayout: "horizontal",
  themeColorPresets: "default",
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

// DEFAULT ROOT PATH
export const DEFAULT_PATH = PATH_DASHBOARD.general.app; // as '/app'
