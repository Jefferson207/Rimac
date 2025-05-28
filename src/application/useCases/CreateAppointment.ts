import { AppointmentRepository } from '@/domain/repositories/AppointmentRepository';
import { ISNSPublisher } from '@/application/ports/ISNSPublisher';
import { Appointment } from '@/domain/models/Appointment';
import { v4 as uuidv4 } from 'uuid';

export class CreateAppointment {
  constructor(
    private readonly repo: AppointmentRepository,
    private readonly sns: ISNSPublisher
  ) {}

  async execute(data: Omit<Appointment, 'requestId' | 'createdAt' | 'status'>): Promise<Appointment> {
    const appointment: Appointment = {
      ...data,
      requestId: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    await this.repo.save(appointment);
    await this.sns.publish(appointment);
    return appointment;
  }
}
