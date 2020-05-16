import { readFileSync } from "fs";

export function capitalize(s: string) {
  if (typeof s !== "string") return "";
  return s.replace(/^./, s[0].toUpperCase());
}

export function removeFromArray(array: string[], item: string) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function readConfig(configPath: string) {
  const rawdata = readFileSync(configPath);
  return JSON.parse(rawdata.toString());
}

/**
 * Definition of generator config
 * doc: {
 *  componentsPath: path of folder containing all doc components
 *  destPath: path of build
 *  order?: order of components in build
 *  exlude?: exluded components
 * }
 */
export interface Config {
  doc: {
    componentsPath: string;
    destPath: string;
    order?: string[];
    exlude?: string[];
  };
}
