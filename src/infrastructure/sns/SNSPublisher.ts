import { ISNSPublisher } from '@/application/ports/ISNSPublisher';
import * as AWS from 'aws-sdk';

export class SNSPublisher implements ISNSPublisher {
  constructor(private sns = new AWS.SNS(), private topicArn = process.env.SNS_TOPIC_ARN!) {}

  async publish(data: any): Promise<void> {
    await this.sns.publish({
      TopicArn: this.topicArn,
      Message: JSON.stringify(data),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: data.countryISO,
        },
      },
    }).promise();
  }
}
