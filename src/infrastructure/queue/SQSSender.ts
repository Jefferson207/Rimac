import { SQS } from 'aws-sdk';

export class SQSSender {
  private sqs: SQS;
  private queueUrl: string;

  constructor(queueUrl: string) {
    this.sqs = new SQS();
    this.queueUrl = queueUrl;
  }

  async sendMessage(message: any): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    };

    await this.sqs.sendMessage(params).promise();
    console.log('[SQS] Mensaje enviado a la cola:', this.queueUrl);
  }
}
