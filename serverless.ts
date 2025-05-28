import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'rimac-appointment',
  frameworkVersion: '3',
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    environment: {
      DYNAMO_TABLE: 'AppointmentsTable',
      SNS_TOPIC_ARN: {
        Ref: 'AppointmentTopic',
      } as any,
      STATUS_QUEUE_URL: {
        Ref: 'EventStatusQueue',
      } as any,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:UpdateItem',
              'dynamodb:ListTables',
            ],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: '*',
          },
        ],
      },
    },
  },
  functions: {
    appointment: {
      handler: 'src/functions/appointment/index.main',
      events: [
        {
          http: {
            method: 'post',
            path: 'appointment',
          },
        },
        {
          http: {
            method: 'get',
            path: 'appointment/{insuredId}',
          },
        },
        {
          sqs: {
            arn: { 'Fn::GetAtt': ['EventStatusQueue', 'Arn'] },
          },
        },
      ],
    },
    appointmentPE: {
      handler: 'src/functions/appointment/appointment_pe.handler',
      events: [
        {
          sqs: {
            arn: { 'Fn::GetAtt': ['SqsPEQueue', 'Arn'] },
          },
        },
      ],
    },
    appointmentCL: {
      handler: 'src/functions/appointment/appointment_cl.handler',
      events: [
        {
          sqs: {
            arn: { 'Fn::GetAtt': ['SqsCLQueue', 'Arn'] },
          },
        },
      ],
    },
    docsUI: {
    handler: 'src/functions/docs/swagger.handler',
    events: [
      {
        http: {
          path: 'swagger',
          method: 'get',
          cors: true
        }
      }
    ]
  }
  },
  resources: {
  Resources: {
    AppointmentsTable: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: 'AppointmentsTable',
        AttributeDefinitions: [
          { AttributeName: 'insuredId', AttributeType: 'S' },
          { AttributeName: 'scheduleId', AttributeType: 'N' },
        ],
        KeySchema: [
          { AttributeName: 'insuredId', KeyType: 'HASH' },
          { AttributeName: 'scheduleId', KeyType: 'RANGE' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      },
    },
    AppointmentTopic: {
      Type: 'AWS::SNS::Topic',
      Properties: {
        TopicName: 'AppointmentTopic',
      },
    },
    EventStatusQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'event-status-queue',
      },
    },
    SqsPEQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'sqs_pe',
      },
    },
    SqsCLQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'sqs_cl',
      },
    },
    SNSSubscriptionPE: {
      Type: 'AWS::SNS::Subscription',
      Properties: {
        Protocol: 'sqs',
        TopicArn: { Ref: 'AppointmentTopic' },
        Endpoint: { 'Fn::GetAtt': ['SqsPEQueue', 'Arn'] },
        FilterPolicy: {
          countryISO: ['PE'],
        },
      },
    },
    SNSSubscriptionCL: {
      Type: 'AWS::SNS::Subscription',
      Properties: {
        Protocol: 'sqs',
        TopicArn: { Ref: 'AppointmentTopic' },
        Endpoint: { 'Fn::GetAtt': ['SqsCLQueue', 'Arn'] },
        FilterPolicy: {
          countryISO: ['CL'],
        },
      },
    },
    SQSPermissionPE: {
      Type: 'AWS::SQS::QueuePolicy',
      Properties: {
        Queues: [{ Ref: 'SqsPEQueue' }],
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'sqs:SendMessage',
              Resource: { 'Fn::GetAtt': ['SqsPEQueue', 'Arn'] },
              Condition: {
                ArnEquals: {
                  'aws:SourceArn': { Ref: 'AppointmentTopic' },
                },
              },
            },
          ],
        },
      },
    },
    SQSPermissionCL: {
      Type: 'AWS::SQS::QueuePolicy',
      Properties: {
        Queues: [{ Ref: 'SqsCLQueue' }],
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'sqs:SendMessage',
              Resource: { 'Fn::GetAtt': ['SqsCLQueue', 'Arn'] },
              Condition: {
                ArnEquals: {
                  'aws:SourceArn': { Ref: 'AppointmentTopic' },
                },
              },
            },
          ],
        },
      },
    },
  },
},

};

module.exports = serverlessConfiguration;
