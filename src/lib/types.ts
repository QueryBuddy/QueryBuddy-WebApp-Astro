import type { ChatCompletionContentPart, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam, ChatCompletionToolMessageParam } from 'openai/resources/chat/completions';

export type Message = (ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam | ChatCompletionToolMessageParam) & {
  tool_call_id?: string;
}

export type MessageContent = ChatCompletionContentPart & {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
    detail: "low" | "high" | "auto";
  };
}

export interface ModelResponse {
  status: string;
  content: string;
  isApp?: boolean;
  name?: string;
  args?: any;
}

export interface FunctionResult {
  result: any;
  callModel: boolean;
} 