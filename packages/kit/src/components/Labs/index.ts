import { registerComponents } from "@elfui/core";

import { AiChat } from "./AIChat";
import { AiApprovalCard } from "./AiApprovalCard";
import { AiCodeBlock } from "./AiCodeBlock";
import { AiCommandSearch } from "./AiCommandSearch";
import { AiContextCard } from "./AiContextCard";
import { AiDiffTable } from "./AiDiffTable";
import { AiFilterTable } from "./AiFilterTable";
import { AiFineTuneCard } from "./AiFineTuneCard";
import { AiInsightCard } from "./AiInsightCard";
import { AiLoading } from "./AiLoading";
import { AiRecommendationCard } from "./AiRecommendationCard";
import { AiRecordsTable } from "./AiRecordsTable";
import { AiSidebarNav } from "./AiSidebarNav";
import { AiStreamingText } from "./AiStreamingText";
import { AiTaskRow } from "./AiTaskRow";
import { AiThinking } from "./AiThinking";
import { AiToolChips } from "./AiToolChips";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage } from "./ChatMessage";
import { ChatToolCall } from "./ChatToolCall";
import { CodeCard } from "./CodeCard";
import { Heatmap } from "./Heatmap";
import { MdPage } from "./MdPage";
import { MdOutline } from "./MdOutline";
import { Video } from "./Video";

registerComponents(
  Video,
  Heatmap,
  CodeCard,
  MdPage,
  MdOutline,
  AiChat,
  AiApprovalCard,
  AiCodeBlock,
  AiCommandSearch,
  AiContextCard,
  AiDiffTable,
  AiFilterTable,
  AiFineTuneCard,
  AiInsightCard,
  AiLoading,
  AiRecommendationCard,
  AiRecordsTable,
  AiSidebarNav,
  AiStreamingText,
  AiTaskRow,
  AiThinking,
  AiToolChips,
  ChatMessage,
  ChatComposer,
  ChatToolCall,
);

export * from "./AIChat";
export * from "./AiApprovalCard";
export * from "./AiCodeBlock";
export * from "./AiCommandSearch";
export * from "./AiContextCard";
export type {
  AiDiffCell,
  AiDiffRow,
  AiDiffStatus,
  AiDiffTableElement,
  AiDiffTableEmits,
  AiDiffTableLabels,
  AiDiffTableProps,
  AiTableColumn,
} from "./AiDiffTable";
export type {
  AiFilterChip,
  AiFilterRow,
  AiFilterTableElement,
  AiFilterTableEmits,
  AiFilterTableExpose,
  AiFilterTableLabels,
  AiFilterTableProps,
} from "./AiFilterTable";
export * from "./AiFineTuneCard";
export * from "./AiInsightCard";
export * from "./AiLoading";
export * from "./AiRecommendationCard";
export type {
  AiRecordRow,
  AiRecordsSortDetail,
  AiRecordsTableElement,
  AiRecordsTableEmits,
  AiRecordsTableExpose,
  AiRecordsTableLabels,
  AiRecordsTableProps,
} from "./AiRecordsTable";
export * from "./AiSidebarNav";
export * from "./AiStreamingText";
export * from "./AiTaskRow";
export * from "./AiThinking";
export * from "./AiToolChips";
export * from "./ChatComposer";
export * from "./ChatMessage";
export * from "./ChatToolCall";
export * from "./CodeCard";
export * from "./Heatmap";
export * from "./MdPage";
export * from "./MdOutline";
export * from "./Video";
