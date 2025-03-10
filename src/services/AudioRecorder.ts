export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;

  async start(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Failed to start audio recording. Please check your microphone permissions.');
    }
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;

        // Stop all tracks to release the microphone
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  isActive(): boolean {
    return this.isRecording;
  }
}
