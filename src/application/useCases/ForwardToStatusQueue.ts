import { SQSSender } from '../../infrastructure/queue/SQSSender';
import { Appointment } from '../../domain/models/Appointment';

export class ForwardToStatusQueue {
  constructor(private readonly sender: SQSSender) {}

  async execute(appointment: Appointment): Promise<void> {
    const message = {
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
    };

    await this.sender.sendMessage(message);
  }
}
