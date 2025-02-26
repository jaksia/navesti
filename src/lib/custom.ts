import { colors } from "./consts";

export enum CustomLightColor {
    BLUE = "blue",
    RED = "red",
    GREEN = "green",
    YELLOW = "yellow",
    WHITE = "white"
}

export const customColorClasses = {
    [CustomLightColor.BLUE]: colors.blue,
    [CustomLightColor.RED]: colors.red,
    [CustomLightColor.GREEN]: colors.green,
    [CustomLightColor.YELLOW]: colors.yellow,
    [CustomLightColor.WHITE]: colors.white
};

export const maxLightCounts = {
    [CustomLightColor.RED]: 1,
    [CustomLightColor.GREEN]: 1,
    [CustomLightColor.YELLOW]: 1,
    [CustomLightColor.WHITE]: 1,
    [CustomLightColor.BLUE]: 1
};

export enum Mode {
    BUILD = "build",
    MANUAL = "manual",
    SIGNAL = "signal"
}