interface ReadingAnalysis {
  transcript: string;
  wpm: number;
  accuracy: number;
  fluency: number;
  feedback: string;
  pronunciationNotes: {
    potentialIssues: string[];
    strengths: string[];
    practiceWords: string[];
  };
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
      Analyze this reading session with special attention to pronunciation:
      Target text: "${targetText}"
      Actual reading (Note: This is a Whisper transcription that may have auto-corrected pronunciations): "${transcript}"
      Duration: ${durationSeconds} seconds

      Important: Since Whisper may have corrected mispronunciations in the transcription, analyze the text carefully for:
      1. Word substitutions or skips that might indicate pronunciation difficulty
      2. Word patterns that suggest the reader might be struggling (e.g., hesitations, repetitions)
      3. Areas where the transcription seems "too perfect" given the context

      Respond with a JSON object using exactly this format:
      {
        "wpm": number,
        "accuracy": number,
        "fluency": number,
        "feedback": string,
        "pronunciationNotes": {
          "potentialIssues": string[],
          "strengths": string[],
          "practiceWords": string[]
        }
      }

      Requirements:
      - wpm: Calculate words per minute
      - accuracy: Percentage of words correct (0-100)
      - fluency: Reading fluency score (0-100)
      - feedback: Brief, encouraging feedback focusing on both strengths and areas for improvement
      - pronunciationNotes: Specific observations about pronunciation patterns
        - potentialIssues: List specific words or patterns that might need attention
        - strengths: List areas of strong pronunciation
        - practiceWords: Suggest 2-3 words to practice that follow similar patterns

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
            content: 'You are an experienced reading teacher and speech pathologist. Focus on identifying potential pronunciation patterns and providing constructive, encouraging feedback.'
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
        feedback: analysis.feedback,
        pronunciationNotes: analysis.pronunciationNotes
      };
    } catch (error) {
      console.error('Failed to parse GPT response:', error);
      console.log('Raw message content:', data.choices[0].message.content);
      throw new Error('Failed to parse analysis results');
    }
  }
}
