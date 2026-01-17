import { AIRequest, AIResponse } from '../types';
import { API_CONFIG } from '../utils/constants';

class APIService {
  private endpoint: string;
  private timeout: number;

  constructor() {
    this.endpoint = API_CONFIG.defaultEndpoint;
    this.timeout = API_CONFIG.timeout;
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  async analyze(request: AIRequest): Promise<AIResponse> {
    // If no endpoint is set, use mock response
    if (!this.endpoint || this.endpoint === API_CONFIG.defaultEndpoint) {
      return this.mockResponse(request);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      
      throw error;
    }
  }

  /**
   * Mock response for development/demo
   */
  private async mockResponse(request: AIRequest): Promise<AIResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const hasImage = !!request.image;
    const hasText = !!request.text;

    let responseText = '';

    if (hasImage && hasText) {
      responseText = `I can see the image you've shared. Regarding your question "${request.text?.substring(0, 50)}..." - I've analyzed both the visual content and your text input. The image appears to show interesting details that relate to your query. In a production environment, this would provide detailed AI analysis combining both inputs.`;
    } else if (hasImage) {
      responseText = `I've analyzed the image you captured. In a production environment with a connected AI backend, I would provide detailed descriptions of objects, text, scenes, or any other relevant information visible in the photo. The image has been successfully processed and encoded.`;
    } else if (hasText) {
      responseText = `You asked: "${request.text}". This is a demonstration response. When connected to your AI backend, this would provide intelligent, contextual answers to your questions. The system is ready to process both text and images.`;
    } else {
      responseText = 'Please provide an image, text, or both for analysis.';
    }

    return {
      text: responseText,
      confidence: 0.95,
      metadata: {
        processingTime: Math.random() * 500 + 200,
        model: 'mock-v1',
        hasImage,
        hasText,
      },
    };
  }
}

export const apiService = new APIService();
