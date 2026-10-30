/**
 * 現在有効なバーティカル設定。
 * ジャンルを差し替えるときは、この import 先を config/verticals/<genre>.ts に変える。
 * アプリ側のコードはすべてこの `vertical` を参照し、ジャンル固有値を直接書かない。
 */
import { koosaiClubVertical, type VerticalConfig } from "./vertical.example";

// 第1号バーティカル = 交際クラブ版（vertical.example.ts の実例をそのまま有効化）
export const vertical: VerticalConfig = koosaiClubVertical;

export type { VerticalConfig, AxisConfig, SpecFieldConfig, PriceModelConfig } from "./vertical.example";
