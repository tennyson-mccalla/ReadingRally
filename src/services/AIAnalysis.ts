interface ReadingAnalysis {
  transcript: string;
  wpm: number;
  accuracy: number;
  fluency: number;
  feedback: string;
}

export class AIAnalysisService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async analyzeReading(
    audioBlob: Blob,
    targetText: string,
    durationSeconds: number
  ): Promise<ReadingAnalysis> {
    try {
      // First, get transcription from Whisper
      const transcript = await this.getWhisperTranscription(audioBlob);

      // Then analyze with GPT-4 Mini
      return await this.analyzeWithGPT(transcript, targetText, durationSeconds);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze reading. Please try again.');
    }
  }

  private async getWhisperTranscription(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.text;
  }

  private async analyzeWithGPT(
    transcript: string,
    targetText: string,
    durationSeconds: number
  ): Promise<ReadingAnalysis> {
    const prompt = `
      Analyze this reading session:
      Target text: "${targetText}"
      Actual reading: "${transcript}"
      Duration: ${durationSeconds} seconds

      Respond with a JSON object using exactly this format (maintain the exact key names and types):
      {
        "wpm": number,
        "accuracy": number,
        "fluency": number,
        "feedback": string
      }

      Requirements:
      - wpm: Calculate words per minute
      - accuracy: Percentage of words correct (0-100)
      - fluency: Reading fluency score (0-100)
      - feedback: Brief, encouraging feedback with one strength and one area to improve

      Return ONLY the JSON object, no other text.
    `;

    console.log('Sending prompt to GPT:', prompt);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive reading teacher. Analyze reading performance and provide encouraging feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      console.error('GPT API error:', await response.text());
      throw new Error('Analysis failed');
    }

    const data = await response.json();
    console.log('Raw GPT response:', data);

    try {
      const analysis = JSON.parse(data.choices[0].message.content);
      console.log('Parsed analysis:', analysis);
      return {
        transcript,
        wpm: analysis.wpm,
        accuracy: analysis.accuracy,
        fluency: analysis.fluency,
        feedback: analysis.feedback
      };
    } catch (error) {
      console.error('Failed to parse GPT response:', error);
      console.log('Raw message content:', data.choices[0].message.content);
      throw new Error('Failed to parse analysis results');
    }
  }
}
